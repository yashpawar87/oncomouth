import torchvision.transforms as transforms
import torch
from PIL import Image

def get_transforms():
    """
    Returns the preprocessing pipeline for EfficientNet-B3.
    Keep this as close as possible to what you used in training.
    """
    return transforms.Compose([
        transforms.Resize((300, 300)),   # EfficientNet-friendly size
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],  # ImageNet mean (standard for EfficientNet)
            std=[0.229, 0.224, 0.225]
        )
    ])

def transform_image(image: Image.Image) -> torch.Tensor:
    """
    Convert PIL image → model-ready tensor.
    Input:  PIL Image
    Output: (1, C, H, W) tensor
    """
    transform = get_transforms()

    # Ensure RGB (important for MRI grayscale images)
    if image.mode != "RGB":
        image = image.convert("RGB")

    tensor = transform(image)
    tensor = tensor.unsqueeze(0)  # add batch dimension

    return tensor
