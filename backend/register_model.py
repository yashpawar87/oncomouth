"""
Script to register the best_model.pth with MLflow Model Registry.
Run this once to make the model available for the FastAPI backend.
"""
import torch
import torch.nn as nn
import timm
import mlflow
import mlflow.pytorch

# Model configuration
MODEL_PATH = "models/best_model.pth"
MODEL_NAME = "OncomouthCancerModel"
NUM_CLASSES = 3  # Normal, PreCancer, Cancer

class OralCancerModel(nn.Module):
    """
    Custom model architecture matching the training setup.
    Uses timm EfficientNet-B3 backbone with custom classifier head.
    """
    def __init__(self, num_classes=3):
        super().__init__()
        # Create backbone (timm efficientnet_b3)
        self.backbone = timm.create_model('efficientnet_b3', pretrained=False, num_classes=0)
        
        # Get the backbone output features
        backbone_out_features = self.backbone.num_features  # 1536 for efficientnet_b3
        
        # Custom classifier matching the checkpoint structure:
        # classifier.0, classifier.3, classifier.6 
        self.classifier = nn.Sequential(
            nn.Linear(backbone_out_features, 512),  # classifier.0
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 256),  # classifier.3
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)  # classifier.6
        )

    def forward(self, x):
        features = self.backbone(x)
        return self.classifier(features)

def main():
    print("Loading model weights...")
    model = OralCancerModel(num_classes=NUM_CLASSES)
    
    # Load the trained weights
    checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
    state_dict = checkpoint["model_state_dict"]
    
    # Load state dict
    model.load_state_dict(state_dict)
    model.eval()
    print("✅ Model loaded successfully!")
    
    # Print model info
    print(f"   Backbone: timm efficientnet_b3")
    print(f"   Classes: {NUM_CLASSES} (Normal, PreCancer, Cancer)")
    print(f"   Checkpoint val_f1: {checkpoint.get('val_f1', 'N/A')}")
    print(f"   Checkpoint val_acc: {checkpoint.get('val_acc', 'N/A')}")
    
    # Start MLflow run and log the model
    print("\nRegistering model with MLflow...")
    mlflow.set_experiment("OncoMouth-Cancer-Detection")
    
    with mlflow.start_run(run_name="model-registration"):
        # Log metrics from checkpoint
        if "val_f1" in checkpoint:
            mlflow.log_metric("val_f1", checkpoint["val_f1"])
        if "val_acc" in checkpoint:
            mlflow.log_metric("val_acc", checkpoint["val_acc"])
        
        # Log the PyTorch model
        mlflow.pytorch.log_model(
            pytorch_model=model,
            artifact_path="model",
            registered_model_name=MODEL_NAME,
        )
        print(f"✅ Model registered as '{MODEL_NAME}' version 1!")

if __name__ == "__main__":
    main()
