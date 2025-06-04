import React, { useEffect, useRef, useState } from "react";

/**
 * Flip this flag to `false` if you want to hide the played‐back recording.
 */
const ENABLE_PLAYBACK = false;

export default function VideoRecorderModule(props) {
    const videoPreviewRef = useRef(null);
    const playbackVideoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [mediaStream, setMediaStream] = useState(null);
    const [recording, setRecording] = useState(false);
    const [statusText, setStatusText] = useState("Ready");
    const recordedBlobUrl = props.recordedBlobUrl;
    const setRecordedBlobUrl = props.setRecordedBlobUrl;
    const modelLoading = props.modelLoading;

    useEffect(() => {
        async function initCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
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
                console.error("Error accessing camera:", err);
                setStatusText("Camera Error");
            }
        }
        initCamera();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((t) => t.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startRecording = () => {
        if (!mediaStream) return;

        if (recordedBlobUrl) {
            URL.revokeObjectURL(recordedBlobUrl);
            setRecordedBlobUrl(null);
        }
        chunksRef.current = [];

        try {
            const options = {
                mimeType: "video/webm; codecs=vp8",
                videoBitsPerSecond: 200_000,
            };
            const recorder = new MediaRecorder(mediaStream, options);

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: "video/webm",
                });
                const url = URL.createObjectURL(blob);
                setRecordedBlobUrl(url);
                setStatusText("Ready");
                chunksRef.current = [];
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setRecording(true);
            setStatusText("Recording...");
        } catch (err) {
            console.error("MediaRecorder error:", err);
            setStatusText("Recording Error");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const cardStyle = {
        maxWidth: "360px",
        margin: "1rem auto",
        background: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        padding: "0.5rem",
    };

    const previewContainerStyle = {
        position: "relative",
        background: "#FBEEC2",
        borderRadius: "12px",
        overflow: "hidden",
    };

    const videoPreviewStyle = {
        width: "100%",
        height: "auto",
        objectFit: "cover",
        display: recording || mediaStream ? "block" : "none",
    };

    const placeholderStyle = {
        width: "100%",
        height: "0",
        paddingTop: "56%", // 16:9 aspect ratio placeholder
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777777",
        fontSize: "2rem",
    };

    const statusBarStyle = {
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: "rgba(232, 212, 141, 0.9)",
        padding: "0.5rem 0",
        textAlign: "center",
        fontWeight: 500,
        color: "#333333",
    };

    const controlsContainerStyle = {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "0.75rem",
    };

    const buttonBaseStyle = {
        flex: "1 1 45%",
        padding: "0.5rem",
        fontSize: "1rem",
        fontWeight: 500,
        borderRadius: "8px",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    };

    const startButtonStyle = {
        ...buttonBaseStyle,
        background: recording ? "#cccccc" : "#2196F3",
        color: "#ffffff",
        opacity: recording ? 0.6 : 1,
    };

    const stopButtonStyle = {
        ...buttonBaseStyle,
        background: recording ? "#E53935" : "#cccccc",
        color: recording ? "#ffffff" : "#666666",
        opacity: recording ? 1 : 0.6,
    };

    return (
        <div>
            <div style={cardStyle}>
                <div style={previewContainerStyle}>
                    <video
                        ref={videoPreviewRef}
                        autoPlay
                        playsInline
                        muted
                        style={videoPreviewStyle}
                    />

                    {!mediaStream && (
                        <div style={placeholderStyle}>
                            {/* Simple camera SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M4.5 9.5a4 4 0 1 1 7 0 4 4 0 0 1-7 0z" />
                                <path d="M8 1a2 2 0 0 0-2 2v1H4.5a1 1 0 0 0-1 1v1H2a2 2 0 0 0-2 2v4.5a1.5 1.5 0 0 0 1.5 1.5H4v-1H1.5a.5.5 0 0 1-.5-.5V6a1 1 0 0 1 1-1h1.5V4a1 1 0 0 1 1-1H6V3a2 2 0 0 1 2-2h.01zm3.5 4.5V4h-1.5a1 1 0 0 0-1 1v1H5.5a1 1 0 0 0-1 1v4.5a.5.5 0 0 0 .5.5H8v1H4.5A1.5 1.5 0 0 1 3 10.5V7a2 2 0 0 1 2-2H5v1a2 2 0 0 0 2 2h.01A2 2 0 0 0 11 6zm-3 1a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                            </svg>
                        </div>
                    )}

                    <div style={statusBarStyle}>{statusText}</div>
                </div>

                <div style={controlsContainerStyle}>
                    <button
                        style={startButtonStyle}
                        onClick={startRecording}
                        disabled={recording || !mediaStream || modelLoading}
                    >
                        Start Round
                    </button>

                    <button
                        style={stopButtonStyle}
                        onClick={stopRecording}
                        disabled={!recording}
                    >
                        End Round
                    </button>
                </div>
            </div>

            {ENABLE_PLAYBACK && recordedBlobUrl && (
                <div
                    style={{
                        maxWidth: "360px",
                        margin: "1rem auto",
                        textAlign: "center",
                        fontFamily: "sans-serif",
                    }}
                >
                    <h2 style={{ marginBottom: "0.5rem", color: "#333" }}>
                        Recorded Clip
                    </h2>
                    <video
                        ref={playbackVideoRef}
                        src={recordedBlobUrl}
                        controls
                        autoPlay={true}
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            border: "1px solid #CCC",
                        }}
                    />
                </div>
            )}
        </div>
    );
}
