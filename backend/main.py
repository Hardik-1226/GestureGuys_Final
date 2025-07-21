from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
# import threading
# import cv2
# from cvzone.HandTrackingModule import HandDetector
# import pyautogui
# import time

# FastAPI Setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Remove gesture thread and camera code, keep only API endpoints

def recognize_gesture(landmarks):
    if not landmarks or not isinstance(landmarks, list):
        return "no_hand"
    hand = landmarks[0]
    # Use dict keys for JS MediaPipe format
    if isinstance(hand[8], dict) and isinstance(hand[12], dict):
        if hand[8]['y'] < hand[12]['y']:
            return "index_above_middle"
    return "unknown"

@app.post("/process-landmarks")
async def process_landmarks(request: Request):
    data = await request.json()
    landmarks = data.get("landmarks")
    action = recognize_gesture(landmarks)
    return {"status": "received", "action": action}

@app.post("/stop-gesture")
async def stop_gesture():
    return {"status": "stopped"}

@app.get("/")
def read_root():
    return {"message": "GestureGuy backend is running!"}
