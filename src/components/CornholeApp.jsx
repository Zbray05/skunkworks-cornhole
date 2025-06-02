import React, { useEffect, useRef, useState } from 'react';

// Change this to your actual LLM endpoint:
const LLM_API_ENDPOINT = 'https://api.example.com/v1/analyze';

export default function CornholeApp() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [mediaStream, setMediaStream] = useState(null);
  const [captureIntervalId, setCaptureIntervalId] = useState(null);

  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [isTossInProgress, setIsTossInProgress] = useState(false);

  // 1. On mount, request camera
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: 640, height: 480 },
          audio: false,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Cannot access camera. Please grant permission.');
      }
    }
    initCamera();

    // Cleanup on unmount
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []); // empty deps → run once

  // 2. Utility: draw video frame → blob
  const grabFrameAsBlob = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
    });
  };

  // 3. Send frame to LLM
  const sendFrameToLLM = async (frameBlob) => {
    if (!frameBlob) return null;
    const formData = new FormData();
    formData.append('image', frameBlob, 'frame.jpg');
    formData.append(
      'instructions',
      JSON.stringify({
        prompt:
          'Overhead view of a cornhole board. Count how many bags per team landed in hole vs. on board vs. on ground. Return JSON: {teamA_hole:X, teamA_board:Y, teamA_ground:Z, teamB_hole:X2, teamB_board:Y2, teamB_ground:Z2}.',
      })
    );
    try {
      const res = await fetch(LLM_API_ENDPOINT, {
        method: 'POST',
        body: formData,
        // If your endpoint uses JSON+base64 instead, convert blob accordingly.
        // headers: { 'Authorization': `Bearer ${LLM_API_KEY}` }
      });
      if (!res.ok) {
        console.error('LLM API error:', res.statusText);
        return null;
      }
      const data = await res.json();
      return data; // e.g. { teamA_hole: 1, teamA_board: 0, … }
    } catch (err) {
      console.error('Error sending to LLM:', err);
      return null;
    }
  };

  // 4. Update scores based on LLM result (with cancellation scoring)
  const updateScoresFromLLMResult = (result) => {
    if (!result) return;
    const aHole = result.teamA_hole || 0;
    const aBoard = result.teamA_board || 0;
    const bHole = result.teamB_hole || 0;
    const bBoard = result.teamB_board || 0;

    const teamAPts = aHole * 3 + aBoard * 1;
    const teamBPts = bHole * 3 + bBoard * 1;
    const netA = teamAPts - teamBPts;
    const netB = teamBPts - teamAPts;

    if (netA > 0) setTeamAScore((prev) => prev + netA);
    if (netB > 0) setTeamBScore((prev) => prev + netB);
  };

  // 5. The capture loop: run roughly every 3 seconds
  const captureAndAnalyze = async () => {
    const frameBlob = await grabFrameAsBlob();
    if (!frameBlob) return;

    const result = await sendFrameToLLM(frameBlob);
    if (!result) return;

    // Determine if board is clear
    const totalBagsOnBoard =
      (result.teamA_hole || 0) +
      (result.teamA_board || 0) +
      (result.teamB_hole || 0) +
      (result.teamB_board || 0);

    if (!isTossInProgress && totalBagsOnBoard > 0) {
      // A new toss just landed
      setIsTossInProgress(true);
      updateScoresFromLLMResult(result);
      return;
    }

    if (isTossInProgress && totalBagsOnBoard === 0) {
      // Players cleared the board → next toss is possible
      setIsTossInProgress(false);
    }
  };

  // 6. Handlers for Start / Stop
  const startScoring = () => {
    if (!mediaStream) {
      console.warn('Camera not ready.');
      return;
    }
    setTeamAScore(0);
    setTeamBScore(0);
    setIsTossInProgress(false);

    // Sample every 3 seconds
    const id = setInterval(captureAndAnalyze, 3000);
    setCaptureIntervalId(id);
  };

  const stopScoring = () => {
    clearInterval(captureIntervalId);
    setCaptureIntervalId(null);
  };

  return (
    <div className="container">
      <header>
        <h1>Cornhole Scorekeeper</h1>
      </header>

      <main>
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="640"
            height="480"
            style={{ border: '1px solid #444' }}
          />
          {/* Hidden canvas for frame capture */}
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            style={{ display: 'none' }}
          />
        </div>

        <section className="controls">
          <button
            onClick={startScoring}
            disabled={Boolean(captureIntervalId)}
          >
            Start Scoring
          </button>
          <button
            onClick={stopScoring}
            disabled={!captureIntervalId}
          >
            Stop
          </button>
        </section>

        <section className="scoreboard">
          <h2>Score</h2>
          <div>Team A: {teamAScore}</div>
          <div>Team B: {teamBScore}</div>
        </section>
      </main>
    </div>
  );
}
