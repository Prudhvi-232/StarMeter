import base64
import io
import random
from typing import Dict

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Initialize the FastAPI app
app = FastAPI(title="Star Meter API", description="API for face detection and rating.")

# Add CORS middleware to allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the pre-trained Haar Cascade model for face detection
# This file is included with the opencv-python package
try:
    face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(face_cascade_path)
    if face_cascade.empty():
        raise IOError(f"Unable to load the face cascade classifier from {face_cascade_path}")
except Exception as e:
    print(f"Error loading Haar Cascade: {e}")
    face_cascade = None

# --- MOCK CLASSIFICATION DATA ---
# In a real application, you would load your trained model and class dictionary here.
# For now, we use a placeholder list of names that matches your HTML.
__class_names = ["Allu Arjun", "Samantha", "Sindhuri", "Vijay", "Virat Kohli"]

# Pydantic model for the base64 image request
class ImageB64(BaseModel):
    b64_string: str

def process_image_and_classify_face(image_bytes: bytes) -> Dict:
    """
    Detects faces in an image and returns mock classification results.
    In a real application, you would replace the mock logic with your trained model.
    """
    if face_cascade is None:
        return {"error": "Face detection model not loaded. Please check server logs."}
    try:
        # Decode the image
        image_np = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

        if image is None:
            return {"error": "Could not decode image."}

        # Convert to grayscale and detect faces
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray_image,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )
        
        if not len(faces):
            return {"error": "No face detected. Please upload a clearer image."}

        # --- MOCK MODEL PREDICTION ---
        # In a real app, you would crop the face, resize it, and feed it to your model.
        # For now, we'll return randomized mock predictions.
        
        # Generate random scores
        scores = [random.random() for _ in __class_names]
        
        # Make one score much higher to simulate a confident prediction
        high_confidence_index = random.randint(0, len(__class_names) - 1)
        scores[high_confidence_index] = scores[high_confidence_index] * 4 + 0.6
        
        # Normalize to be more like probabilities
        total = sum(scores)
        scores = [s / total for s in scores]

        predictions = []
        best_match = ""
        max_score = 0

        for name, score in zip(__class_names, scores):
            predictions.append({"name": name, "score": f"{score * 100:.2f}%"})
            if score > max_score:
                max_score = score
                best_match = name

        return {
            "predictions": predictions,
            "best_match": best_match
        }
    except Exception as e:
        return {"error": f"An error occurred during processing: {str(e)}"}


@app.post("/api/detect_from_upload")
async def detect_from_upload(file: UploadFile = File(...)):
    """
    Endpoint to handle face detection and classification from a direct file upload.
    """
    image_bytes = await file.read()
    result = process_image_and_classify_face(image_bytes)
    return result

@app.post("/api/detect_from_b64")
async def detect_from_b64(image_data: ImageB64):
    """
    Endpoint to handle face detection from a base64 encoded string.
    """
    try:
        b64_string = image_data.b64_string
        if "," in b64_string:
            _, encoded = b64_string.split(",", 1)
        else:
            encoded = b64_string
            
        image_bytes = base64.b64decode(encoded)
        result = process_image_and_classify_face(image_bytes)
        return result
    except Exception as e:
        return {"error": f"Invalid base64 string: {str(e)}"}

# Mount the 'docs' directory to serve the static frontend files (HTML, CSS, JS)
# The html=True argument configures it to serve index.html for the root path.
app.mount("/", StaticFiles(directory="docs", html=True), name="static")