import { useEffect } from "react";

const BASE_URL = "https://client.camb.ai/apis";
// const API_KEY = process.env.REACT_APP_API_KEY; // Using environment variable
const API_KEY = "5a8e9f0f-d75e-4336-b3cd-0957b5dc1705"; // Using environment variable
const HEADERS = { "x-api-key": API_KEY };

async function generateTTS(text) {
    console.log("Generating TTS for text:", text);

    try {
        // Step 1: Send initial TTS request
        const ttsPayload = {
            text: text,
            voice_id: 20299,
            language: 1,
            age: 35,
            gender: 1,
        };

        console.log("TTS Payload:", API_KEY);
        const response = await fetch(`${BASE_URL}/tts`, {
            method: "POST",
            headers: {
                ...HEADERS,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ttsPayload),
        });

        const data = await response.json();
        const taskId = data.task_id;
        console.log(`Task ID: ${taskId}`);

        // Step 2: Polling loop until task is complete
        let runId;
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait before polling

            const statusRes = await fetch(`${BASE_URL}/tts/${taskId}`, {
                method: "GET",
                headers: HEADERS,
            });

            const statusData = await statusRes.json();
            console.log(`Polling: ${statusData.status}`);

            if (statusData.status === "SUCCESS") {
                runId = statusData.run_id;
                break;
            }
        }

        console.log(`Run ID: ${runId}`);

        // Step 3: Fetch generated audio file
        const audioRes = await fetch(`${BASE_URL}/tts-result/${runId}?output_type=raw_bytes`, {
            method: "GET",
            headers: HEADERS,
        });

        const audioBlob = await audioRes.blob();
        console.log("Audio URL BLOB:", audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Audio URL created:", audioUrl);
        return audioUrl; // Returns the URL to use in an audio player

    } catch (error) {
        console.error("Error generating TTS:", error);
        return null;
    }
}

export default generateTTS;
