"use client"

import { Button } from "@/components/ui/button"
import { SparklesIcon, RocketIcon, LightbulbIcon } from "lucide-react"
import TypewriterEffect from "./TypewriterEffect"
import Link from "next/link"
import { useState } from "react"
import { BACKEND_URL } from "@/lib/api";
import GestureToggleButton from "@/components/GestureDetector";
import VirtualKeyboard from "./VirtualKeyboard";
import VoiceCommandOverlay from "./VoiceCommandOverlay";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useRef } from "react";

export default function Hero() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [activated, setActivated] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleGetStarted = async () => {
    setLoading(true);
    setMessage("");
    setActivated(true);

    // Start camera and hand detection
    const video = document.createElement("video");
    video.style.display = "none";
    document.body.appendChild(video);
    videoRef.current = video;

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();
      streamRef.current = stream;
      setMessage("Camera access granted. Initializing hand detection...");
    } catch (e) {
      setMessage("Camera access denied or not available.");
      setLoading(false);
      return;
    }

    // Load MediaPipe Hands
    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(async (results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Send landmarks to backend
        try {
          const resp = await fetch(`${BACKEND_URL}/process-landmarks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ landmarks: results.multiHandLandmarks }),
          });
          const data = await resp.json();
          setMessage(`Connected to backend! Action: ${data.action}`);
          console.log("Sent landmarks to backend:", results.multiHandLandmarks);
          console.log("Backend response:", data);
        } catch (err) {
          setMessage("Error sending landmarks to backend.");
          console.error("Error sending landmarks to backend:", err);
        }
      } else {
        setMessage("No hand detected. Show your hand to the camera.");
      }
    });

    // Use MediaPipe Camera Utils to process video frames
    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480,
    });
    camera.start();
    cameraRef.current = camera;

    setMessage("Gesture Control Activated! (Camera running)");
    setLoading(false);
  };

  const handleStop = async () => {
    setLoading(true);
    setMessage("");
    try {
      await fetch(`${BACKEND_URL}/stop-gesture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setActivated(false);
      setMessage("Gesture Control Stopped.");
      // Stop camera and stream
      if (cameraRef.current) cameraRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.remove();
        videoRef.current = null;
      }
    } catch (e) {
      setMessage("Could not connect to backend.");
    }
    setLoading(false);
  };

  // (Dummy landmarks and sendLandmarks function removed)

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-12 dark:bg-black/50 light:bg-transparent pt-24">
      {/* Camera overlay and gesture toggle button removed, now global */}
      {/* Floating buttons removed, now global */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 dark:text-white light:text-gray-800">
        <TypewriterEffect
          text="GestureGuy"
          speed={10}
          delay={0}
          className="bg-gradient-to-r from-neon-purple to-neon-blue text-transparent bg-clip-text block light:from-peach-500 light:to-peach-400"
        />
        <TypewriterEffect text="The Gesture-Controlled Software Interface" speed={2} delay={150} className="block" />
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 dark:text-gray-300 light:text-gray-700">
        Discover the future of interaction. Control your digital world with intuitive hand gestures, making technology
        an extension of yourself.
      </p>
      <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-400">
        {/* Updated "Explore Features" button to link to the new page */}
        <Link href="/explore-features" passHref>
          <Button className="px-8 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <SparklesIcon className="mr-2 h-5 w-5" />
            Explore Features
          </Button>
        </Link>
        <Button
          variant="outline"
          className="px-8 py-3 text-lg border-2 border-white text-white bg-transparent hover:bg-white hover:text-purple-600 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={handleGetStarted}
          disabled={loading || activated}
        >
          {loading && !activated ? (
            <span className="animate-spin mr-2">🔄</span>
          ) : (
            <RocketIcon className="mr-2 h-5 w-5" />
          )}
          {loading && !activated ? "Activating..." : "Get Started"}
        </Button>
        {activated && (
          <Button
            variant="destructive"
            className="px-8 py-3 text-lg border-2 border-white text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={handleStop}
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin mr-2">🔄</span>
            ) : (
              <span className="mr-2">🛑</span>
            )}
            {loading ? "Stopping..." : "Stop"}
          </Button>
        )}
        {/* (Send Dummy Landmarks button removed) */}
        <Link href="/about-project" passHref>
          <Button
            variant="secondary"
            className="px-8 py-3 text-lg bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <LightbulbIcon className="mr-2 h-5 w-5" />
            Learn More
          </Button>
        </Link>
      </div>
      {message && (
        <div className="mt-4 text-green-400 font-bold">{message}</div>
      )}
    </section>
  )
}