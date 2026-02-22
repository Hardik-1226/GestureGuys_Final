"use client";
import React, { useRef, useEffect, useState } from "react";

const instructions = [
  { gesture: "Move index finger", action: "Move cursor (inverted X, smoothed)" },
  { gesture: "Pinch (index & thumb)", action: "Click" },
  { gesture: "Double pinch (index & thumb, twice)", action: "Double Click" },
  { gesture: "Swipe up/down with middle finger", action: "Scroll page" },
  { gesture: "Spread thumb & pinky", action: "Zoom in" },
  { gesture: "Pinch thumb & middle", action: "Zoom out" },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const COOLDOWNS = {
  click: 500,
  doubleClick: 700,
  scroll: 400,
  zoom: 800,
};

export function GestureToggleButton() {
  const [enabled, setEnabled] = React.useState(false);
  return (
    <>
      <button
        onClick={() => setEnabled((prev) => !prev)}
        style={{
          position: 'fixed', bottom: 32, left: 32, zIndex: 10001,
          background: enabled ? '#8A2BE2' : '#444', color: '#fff', border: 'none', borderRadius: 50, width: 56, height: 56,
          fontWeight: 'bold', fontSize: 28, boxShadow: '0 2px 12px #0008', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title={enabled ? 'Disable Gesture Control' : 'Enable Gesture Control'}
      >
        <span role="img" aria-label="hand">🖐️</span>
      </button>
      {enabled && <GestureDetector enabled={true} />}
    </>
  );
}

// New default export: just re-export GestureToggleButton
export default GestureToggleButton;

export function GestureDetector({ enabled, showInstructions }: { enabled: boolean, showInstructions?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastScrollY = useRef<number | null>(null);
  const lastPinch = useRef<boolean>(false);
  const lastZoomIn = useRef<boolean>(false);
  const lastZoomOut = useRef<boolean>(false);
  const lastClickTime = useRef<number>(0);
  const lastDoubleClickTime = useRef<number>(0);
  const lastScrollTime = useRef<number>(0);
  const lastZoomTime = useRef<number>(0);
  const [lastGesture, setLastGesture] = useState<string>("");
  const cursorPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    if (!enabled || !videoRef.current) return;

    // Gesture detection is temporarily disabled due to module compatibility issues
    // TODO: Implement gesture detection with dynamic script loading or alternative library
    
    return () => {
      // Cleanup
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div>
        <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
        {/* Custom cursor for gesture control */}
        <div id="gesture-cursor" style={{
          position: "fixed",
          width: 20,
          height: 20,
          background: "#8A2BE2",
          borderRadius: "50%",
          pointerEvents: "none",
          left: 0,
          top: 0,
          zIndex: 99999,
          opacity: 0.8,
          border: "2px solid white",
        }} />
        {/* Feedback for last gesture */}
        <div style={{ position: 'fixed', left: 24, bottom: 120, zIndex: 10000, background: '#23272f', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 18, minWidth: 120, textAlign: 'center', opacity: 0.95 }}>
          {lastGesture && <span>Last: <b style={{ color: '#8A2BE2' }}>{lastGesture}</b></span>}
        </div>
      </div>
      {/* Instructions panel */}
      {showInstructions && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 10000, background: '#222', color: '#fff', padding: 16, borderRadius: 8, maxWidth: 400 }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: 8 }}>Gesture Instructions</h3>
          <ul style={{ fontSize: 15, lineHeight: 1.7 }}>
            {instructions.map((item, i) => (
              <li key={i}><b>{item.gesture}:</b> {item.action}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}