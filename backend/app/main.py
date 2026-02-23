from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.model import load_model, predict_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model, temperature, class_names = load_model()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    return await predict_image(file, model, temperature, class_names)
