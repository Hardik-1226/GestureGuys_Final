from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import openai

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
    # Defensive: check for dict structure
    if not (isinstance(hand[4], dict) and isinstance(hand[8], dict) and isinstance(hand[12], dict) and isinstance(hand[20], dict)):
        return "unknown"
    # Index above middle
    if hand[8]['y'] < hand[12]['y']:
        return "index_above_middle"
    # Thumbs up (thumb tip above all other fingertips)
    if hand[4]['y'] < hand[8]['y'] and hand[4]['y'] < hand[12]['y'] and hand[4]['y'] < hand[20]['y']:
        return "thumbs_up_scroll_up"
    # Thumbs down (thumb tip below all other fingertips)
    if hand[4]['y'] > hand[8]['y'] and hand[4]['y'] > hand[12]['y'] and hand[4]['y'] > hand[20]['y']:
        return "thumbs_down_scroll_down"
    # Index finger tip near thumb tip (click)
    pinch_dist = ((hand[8]['x'] - hand[4]['x']) ** 2 + (hand[8]['y'] - hand[4]['y']) ** 2) ** 0.5
    if pinch_dist < 0.05:
        return "pinch_click"
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

@app.post("/ai-assistant")
async def ai_assistant(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    if not prompt:
        return {"error": "No prompt provided"}
    openai.api_key = os.environ.get("OPENAI_API_KEY")
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
        )
        return {"response": response.choices[0].message["content"]}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def read_root():
    return {"message": "GestureGuy backend is running!"}
