# Use a slim Python 3.12 image
FROM python:3.12-slim

# Create user with UID 1000 - required by Hugging Face Spaces
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set working directory
WORKDIR $HOME/app

# Copy the requirements file into the container
COPY --chown=user requirements.txt .

# Install system dependencies needed for OpenCV
USER root
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*
USER user

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the backend code into the container
COPY --chown=user . $HOME/app/

# Expose port (Hugging Face default)
EXPOSE 7860

# Run FastAPI app directly (no MLflow registration required)
CMD uvicorn app.main:app --host 0.0.0.0 --port 7860
