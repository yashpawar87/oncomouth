# 🧠 OncoMouth AI — Oral Cancer Detection System

A full-stack AI-powered clinical decision support tool for early oral cancer detection. Upload an oral MRI scan or photograph and receive an instant diagnosis — **Normal**, **Pre-Cancer**, or **Cancer** — with confidence scores and a **Grad-CAM heatmap** highlighting the regions the model focused on.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **3-Class Classification** | Classifies oral cavity images into Normal, Pre-Cancer, or Cancer |
| **EfficientNet-B3 Backbone** | State-of-the-art convolutional backbone via `timm`, fine-tuned on oral pathology data |
| **Temperature-Calibrated Inference** | Softmax probabilities calibrated with temperature scaling (T=1.2) for reliable confidence scores |
| **Grad-CAM Visualization** | Generates a heatmap overlay showing which image regions most influenced the AI diagnosis |
| **MLflow Model Registry** | Models are versioned, tracked, and served through MLflow for reproducibility |
| **HIPAA-Secure by Design** | All inference runs locally — no patient data ever leaves your environment |
| **Modern Clinical UI** | Premium React frontend with animated landing page and real-time prediction dashboard |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  ┌──────────────┐    ┌──────────────────────────────────────┐   │
│  │  Landing Page │───▶│       Prediction Dashboard           │   │
│  │  (HomePage)   │    │  ┌────────┐ ┌────────┐ ┌─────────┐  │   │
│  └──────────────┘    │  │Upload  │ │Preview │ │Results  │  │   │
│                      │  │Box     │ │Image   │ │+ GradCAM│  │   │
│                      │  └────────┘ └────────┘ └─────────┘  │   │
│                      └──────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ POST /predict (image)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │Preprocessing │─▶│  Inference   │─▶│  Grad-CAM Generator  │   │
│  │ (300×300,    │  │(EfficientNet │  │ (Hook last conv,     │   │
│  │  ImageNet    │  │   -B3 +      │  │  backward pass,      │   │
│  │  normalize)  │  │  classifier) │  │  JET overlay)        │   │
│  └──────────────┘  └──────┬───────┘  └──────────┬───────────┘   │
│                           │                      │               │
│                    ┌──────▼──────────────────────▼────────┐      │
│                    │  JSON Response                        │      │
│                    │  • prediction (Normal/PreCancer/Cancer│      │
│                    │  • confidence score                   │      │
│                    │  • probability breakdown              │      │
│                    │  • gradcam_image (base64 PNG)         │      │
│                    └──────────────────────────────────────┘      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MLflow Model Registry                        │
│                   OncomouthCancerModel v1                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
PR-Cancer-Detection/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app, /predict endpoint, CORS
│   │   ├── model.py           # Model loading (MLflow), inference + Grad-CAM call
│   │   ├── gradcam.py         # Grad-CAM utility (hooks, heatmap generation)
│   │   └── preprocessing.py   # Image transforms (resize, normalize)
│   ├── models/
│   │   └── best_model.pth     # Trained model checkpoint
│   ├── register_model.py      # One-time script to register model with MLflow
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile             # Backend containerization
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.tsx            # Router (/ → HomePage, /dashboard → Dashboard)
        ├── App.css            # Animations (fade-in, gradient text, floating blobs)
        ├── pages/
        │   ├── HomePage.tsx   # Landing page (hero, features, how-it-works, CTA)
        │   └── Dashboard.tsx  # Prediction dashboard (upload, preview, results)
        ├── components/
        │   ├── UploadBox.tsx   # Drag-and-drop image upload
        │   ├── PreviewImage.tsx# Scan viewer with scan-bar animation
        │   └── ResultCard.tsx  # Diagnosis result, probabilities, Grad-CAM viewer
        └── services/
            └── api.ts         # API client (POST /predict)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML Model** | PyTorch · EfficientNet-B3 (timm) · Temperature Scaling |
| **Explainability** | Grad-CAM (custom hooks on last conv layer) |
| **Model Management** | MLflow Model Registry |
| **Backend** | FastAPI · Uvicorn · Python 3.12 |
| **Frontend** | React 18 · TypeScript · TailwindCSS 3 |
| **Image Processing** | OpenCV (headless) · Pillow · torchvision |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- Trained model checkpoint (`backend/models/best_model.pth`)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Register model with MLflow (first time only)
python register_model.py

# Start the API server
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`.

---

## 🔬 How It Works

1. **Upload** — User uploads an oral cavity image (MRI scan or photograph) via the dashboard.
2. **Preprocess** — The image is resized to 300×300 and normalized with ImageNet statistics.
3. **Inference** — EfficientNet-B3 backbone extracts features → custom classifier head outputs logits for 3 classes → temperature-scaled softmax produces calibrated probabilities.
4. **Grad-CAM** — A backward pass computes gradients at the last convolutional layer. The weighted activation map is overlaid on the original image using a JET colormap.
5. **Results** — The frontend displays the diagnosis (Normal / Pre-Cancer / Cancer), confidence %, probability breakdown bars, and the Grad-CAM heatmap.

---

## 📊 Model Details

| Parameter | Value |
|-----------|-------|
| Architecture | EfficientNet-B3 + 3-layer MLP classifier |
| Input Size | 300 × 300 × 3 (RGB) |
| Output Classes | Normal, PreCancer, Cancer |
| Temperature | 1.2 |
| Backbone Features | 1536-dim (EfficientNet-B3) |
| Classifier | 1536→512→256→3 (with ReLU + Dropout 0.3) |

---

## 🌐 API Reference

### `POST /predict`

Upload an image for diagnosis.

**Request:** `multipart/form-data` with field `file` (image)

**Response:**
```json
{
  "prediction": "PreCancer",
  "confidence": 0.847,
  "probabilities": {
    "Normal": 0.102,
    "PreCancer": 0.847,
    "Cancer": 0.051
  },
  "gradcam_image": "<base64-encoded PNG>"
}
```

---

## ⚠️ Disclaimer

> This tool is intended for **research and clinical decision support only**. It is not a substitute for professional medical diagnosis. Always consult qualified healthcare professionals for clinical decisions.

---

## 📄 License

This project is for academic and research purposes.
