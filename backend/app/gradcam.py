"""
Grad-CAM (Gradient-weighted Class Activation Mapping) utility.
Generates a heatmap overlay showing which image regions most influenced the prediction.

Works with the OralCancerModel architecture:
  backbone  = timm EfficientNet-B3 (num_classes=0)
  classifier = Sequential(Linear→ReLU→Dropout→Linear→ReLU→Dropout→Linear)
"""

import base64
import io
from typing import Optional

import cv2
import numpy as np
import torch
from PIL import Image


def _find_last_conv_layer(backbone: torch.nn.Module) -> torch.nn.Module:
    """
    Walk the backbone to find the last Conv2d layer.
    For timm efficientnet_b3 this is typically `backbone.conv_head`.
    Falls back to the last Conv2d found anywhere in the module tree.
    """
    # Try known timm attribute first
    if hasattr(backbone, "conv_head"):
        return backbone.conv_head

    # Fallback: walk all modules and grab the last Conv2d
    last_conv = None
    for module in backbone.modules():
        if isinstance(module, torch.nn.Conv2d):
            last_conv = module
    if last_conv is None:
        raise RuntimeError("Could not locate a Conv2d layer in the backbone.")
    return last_conv


def generate_gradcam(
    model: torch.nn.Module,
    input_tensor: torch.Tensor,
    original_pil: Image.Image,
    target_class: Optional[int] = None,
    temperature: float = 1.0,
) -> str:
    """
    Run Grad-CAM and return a base64-encoded PNG of the heatmap overlaid on
    the original image.

    Parameters
    ----------
    model : nn.Module
        The full OralCancerModel (must have `.backbone` and `.classifier`).
    input_tensor : Tensor
        Pre-processed input (1, C, H, W).
    original_pil : PIL.Image
        The original (un-normalised) image for overlay.
    target_class : int or None
        Class index to visualise.  If None, uses the predicted class.
    temperature : float
        Temperature scaling applied to logits (must match inference).

    Returns
    -------
    str
        Base64-encoded PNG string of the heatmap overlay.
    """

    # ---- storage for hooks ----
    activations: list[torch.Tensor] = []
    gradients: list[torch.Tensor] = []

    target_layer = _find_last_conv_layer(model.backbone)

    def forward_hook(_module, _input, output):
        activations.append(output.detach())

    def backward_hook(_module, _grad_input, grad_output):
        gradients.append(grad_output[0].detach())

    fwd_handle = target_layer.register_forward_hook(forward_hook)
    bwd_handle = target_layer.register_full_backward_hook(backward_hook)

    # ---- forward pass (with grads) ----
    input_tensor = input_tensor.clone().requires_grad_(True)
    logits = model(input_tensor) / temperature

    if target_class is None:
        target_class = int(torch.argmax(logits, dim=1).item())

    # ---- backward for target class ----
    model.zero_grad()
    score = logits[0, target_class]
    score.backward()

    # ---- remove hooks ----
    fwd_handle.remove()
    bwd_handle.remove()

    # ---- compute Grad-CAM map ----
    act = activations[0]          # (1, C, h, w)
    grad = gradients[0]           # (1, C, h, w)
    weights = grad.mean(dim=(2, 3), keepdim=True)  # GAP over spatial dims
    cam = (weights * act).sum(dim=1, keepdim=True)  # weighted sum → (1, 1, h, w)
    cam = torch.relu(cam)         # ReLU
    cam = cam.squeeze().cpu().numpy()

    # ---- normalise to [0, 1] ----
    cam_min, cam_max = cam.min(), cam.max()
    if cam_max - cam_min > 1e-8:
        cam = (cam - cam_min) / (cam_max - cam_min)
    else:
        cam = np.zeros_like(cam)

    # ---- resize to match original image ----
    orig_np = np.array(original_pil.convert("RGB"))
    h, w = orig_np.shape[:2]
    cam_resized = cv2.resize(cam, (w, h))

    # ---- apply colourmap and blend ----
    heatmap = cv2.applyColorMap(np.uint8(255 * cam_resized), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    overlay = np.float32(heatmap) * 0.4 + np.float32(orig_np) * 0.6
    overlay = np.clip(overlay, 0, 255).astype(np.uint8)

    # ---- encode to base64 PNG ----
    pil_overlay = Image.fromarray(overlay)
    buffer = io.BytesIO()
    pil_overlay.save(buffer, format="PNG")
    b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return b64_str
