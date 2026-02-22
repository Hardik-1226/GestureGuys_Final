 GestureGuy 

Touchless Virtual Mouse using Hand Gesture Recognition (Software-Based)

Control your system cursor using just your hand gestures via webcame no physical mouse needed. This project uses computer vision to turn your hand into a fully functional pointing device.

🚀 Features

🖐️ Real time hand tracking using webcam

🖱️ Cursor movement with index finger

👌 Pinch gesture for left click

✌️ Multi finger gestures for additional controls 

⚡ Smooth and optimized tracking with reduced jitter

💻 Fully software-based 

🧠 Tech Stack

Python

OpenCV – Video capture & image processing

MediaPipe – Hand tracking & landmark detection

PyAutoGUI / pynput – Mouse control automation

⚙️ How It Works

Captures live video feed using webcam

Detects hand landmarks using MediaPipe

Tracks finger positions in real-time

Maps hand coordinates to screen resolution

Executes mouse actions based on gestures:

👉 Index finger → Move cursor

🤏 Pinch (thumb + index) → Left click

✌️ Two fingers → Right click (if implemented)
