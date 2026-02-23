const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export interface PredictionResult {
  prediction: 'Normal' | 'PreCancer' | 'Cancer';
  confidence: number;
  probabilities: {
    Normal: number;
    PreCancer: number;
    Cancer: number;
  };
  gradcam_image: string; // base64-encoded PNG
}

export const runInference = async (file: File, patientId: string): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('patientId', patientId);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Prediction service unavailable. Check FastAPI/MLflow status.');
  }

  return await response.json();
};