import torch
import torch.nn as nn
import timm
from PIL import Image
import io
from app.preprocessing import transform_image
from app.gradcam import generate_gradcam

MODEL_PATH = "models/best_model.pth"
NUM_CLASSES = 3

class OralCancerModel(nn.Module):
    def __init__(self, num_classes=3):
        super().__init__()
        self.backbone = timm.create_model('efficientnet_b3', pretrained=False, num_classes=0)
        backbone_out_features = self.backbone.num_features
        self.classifier = nn.Sequential(
            nn.Linear(backbone_out_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        features = self.backbone(x)
        return self.classifier(features)

def load_model():
    print("Loading model weights directly from PyTorch checkpoint...")
    model = OralCancerModel(num_classes=NUM_CLASSES)
    
    # Load the trained weights
    checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
    
    # Check if the checkpoint is a full dictionary with 'model_state_dict' or just the raw weights
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
    else:
        state_dict = checkpoint
        
    model.load_state_dict(state_dict)
    model.eval()
    print("✅ Model loaded successfully!")

    temperature = 1.2
    class_names = ["Normal", "PreCancer", "Cancer"]

    return model, temperature, class_names

async def predict_image(file, model, temperature, class_names):
    image_bytes = await file.read()
    original_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = transform_image(original_image)

    # ---- Standard inference (no grad) ----
    with torch.no_grad():
        logits = model(input_tensor) / temperature
        probs = torch.softmax(logits, dim=1)[0]

    pred_idx = torch.argmax(probs).item()

    # ---- Grad-CAM (needs grad) ----
    gradcam_b64 = generate_gradcam(
        model=model,
        input_tensor=input_tensor,
        original_pil=original_image,
        target_class=pred_idx,
        temperature=temperature,
    )

    return {
        "prediction": class_names[pred_idx],
        "confidence": float(probs[pred_idx]),
        "probabilities": {
            class_names[i]: float(probs[i]) for i in range(len(class_names))
        },
        "gradcam_image": gradcam_b64,
    }
