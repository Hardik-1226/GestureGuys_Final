'use client';

import React, { useState } from "react";
import GestureToggleButton from "@/components/GestureDetector";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import VoiceCommandOverlay from "@/components/VoiceCommandOverlay";

export default function FloatingControls() {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  // Download PDF handler
  const handleDownloadPDF = async () => {
    // Dynamically import html2pdf.js
    const html2pdf = (await import("html2pdf.js"))?.default || (await import("html2pdf.js"));
    // Hide floating controls for export
    const controls = document.querySelectorAll('.floating-control');
    controls.forEach(el => (el as HTMLElement).style.display = 'none');
    // Export the main content
    const element = document.getElementById('resume-content');
    if (element) {
      await html2pdf()
        .set({
          margin: 0,
          filename: 'GestureGuy-Resume.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        })
        .from(element)
        .save();
    }
    // Restore controls
    controls.forEach(el => (el as HTMLElement).style.display = '');
  };

  return (
    <>
      {/* Gesture toggle button */}
      <div className="floating-control">
        <GestureToggleButton />
      </div>
      {/* Virtual keyboard toggle button */}
      <button
        className="floating-control"
        onClick={() => setShowKeyboard((prev) => !prev)}
        style={{
          position: 'fixed', bottom: 100, left: 32, zIndex: 10001,
          background: showKeyboard ? '#8A2BE2' : '#444', color: '#fff', border: 'none', borderRadius: 50, width: 56, height: 56,
          fontWeight: 'bold', fontSize: 28, boxShadow: '0 2px 12px #0008', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title={showKeyboard ? 'Hide Virtual Keyboard' : 'Show Virtual Keyboard'}
      >
        <span role="img" aria-label="keyboard">⌨️</span>
      </button>
      {showKeyboard && <VirtualKeyboard />}
      {/* Voice command toggle button */}
      <button
        className="floating-control"
        onClick={() => setShowVoice((prev) => !prev)}
        style={{
          position: 'fixed', bottom: 168, left: 32, zIndex: 10001,
          background: showVoice ? '#8A2BE2' : '#444', color: '#fff', border: 'none', borderRadius: 50, width: 56, height: 56,
          fontWeight: 'bold', fontSize: 28, boxShadow: '0 2px 12px #0008', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title={showVoice ? 'Hide Voice Command' : 'Show Voice Command'}
      >
        <span role="img" aria-label="microphone">🎤</span>
      </button>
      {showVoice && <VoiceCommandOverlay />}
      {/* Download PDF button */}
      <button
        className="floating-control"
        style={{
          position: 'fixed', bottom: 236, left: 32, zIndex: 10001,
          background: '#444', color: '#fff', border: 'none', borderRadius: 50, width: 56, height: 56,
          fontWeight: 'bold', fontSize: 24, boxShadow: '0 2px 12px #0008', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Download Resume as PDF"
        onClick={handleDownloadPDF}
      >
        <span role="img" aria-label="download">⬇️</span>
      </button>
    </>
  );
} 