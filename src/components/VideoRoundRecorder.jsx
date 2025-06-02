// src/components/VideoRoundRecorder.jsx

import React, { useEffect, useRef, useState } from 'react';

export default function VideoRoundRecorder() {
  const videoPreviewRef = useRef(null);
  const playbackVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);            // ← mutable array for chunks
  const [mediaStream, setMediaStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);

  // 1) Initialize camera at low resolution
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 320 },
            height: { ideal: 240 },
          },
          audio: false,
        });
        setMediaStream(stream);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Check permissions.');
      }
    }
    initCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []); // run once

  // 2) Start recording
  const startRound = () => {
    if (!mediaStream) {
      console.warn('Camera not ready');
      return;
    }

    // Clear previous clip URL
    if (recordedBlobUrl) {
      URL.revokeObjectURL(recordedBlobUrl);
      setRecordedBlobUrl(null);
    }
    // Reset the chunks array
    chunksRef.current = [];

    try {
      // Low‐bitrate WebM (adjust bitsPerSecond as needed)
      const options = {
        mimeType: 'video/webm; codecs=vp8',
        videoBitsPerSecond: 250_000, // ~250 kbps
      };
      const recorder = new MediaRecorder(mediaStream, options);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          // Push chunk into the ref array immediately
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        // Build a Blob from everything in chunksRef.current
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        console.log(url);
        setRecordedBlobUrl(url);

        // (Optionally) clear the chunksRef for safety
        chunksRef.current = [];
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.error('MediaRecorder error:', err);
      alert('Could not start recording. Your browser may not support low‐bitrate WebM.');
    }
  };

  // 3) Stop recording
  const endRound = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '1rem auto', fontFamily: 'sans-serif' }}>
      <h1>Cornhole Prototype: Record a Round</h1>

      {/* Live camera preview (320×240) */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <video
          ref={videoPreviewRef}
          autoPlay
          playsInline
          muted
          width={320}
          height={240}
          style={{ border: '1px solid #444' }}
        />
      </div>

      {/* Start / End buttons */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <button
          onClick={startRound}
          disabled={recording || !mediaStream}
          style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          Start Round
        </button>
        <button
          onClick={endRound}
          disabled={!recording}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          End Round
        </button>
      </div>

      {/* Playback of the just‐recorded clip */}
      {recordedBlobUrl && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <h2>Recorded Clip:</h2>
          <video
            ref={playbackVideoRef}
            src={recordedBlobUrl}
            autoPlay={true}
            controls
            width={320}
            height={240}
            style={{ border: '1px solid #222' }}
          />
        </div>
      )}
    </div>
  );
}
