import mlflow.pytorch
import torch
from PIL import Image
import io
from app.preprocessing import transform_image
from app.gradcam import generate_gradcam

MLFLOW_MODEL_URI = "models:/OncomouthCancerModel/1"

def load_model():
    model = mlflow.pytorch.load_model(MLFLOW_MODEL_URI)
    model.eval()

    # You still need temperature from your checkpoint
    # Easiest way: store it in a small JSON file
    temperature = 1.2   # <-- use the value from your training output

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
