import React, { useState, useEffect } from 'react';
import generateTTS from './GenerateTTSUrl.jsx';

const PlayAudio = ({winner}) => {
    
    const [text, setTextToSpeech] = useState("");
    const [audioSrc, setAudioSrc] = useState(null);
    console.log("Current Team 1 Score:", winner);

    useEffect(() => {
        const ttsText = `The winner is ${winner.winner}. Team 1 scored ${winner.team1} points and Team 2 scored ${winner.team2} points.`;
        setTextToSpeech(ttsText);

        const fetchAudio = async () => {
            const url = await generateTTS(ttsText);
            console.log("Audio URL:", url);
            setAudioSrc(url);
        };

        fetchAudio();
    }, [winner]);

    useEffect(() => {
        if (audioSrc) {
            const audioElement = document.getElementById('myAudio');   
            if (audioElement) {
                audioElement.src = audioSrc;
                audioElement.play().catch(error => {
                    console.error("Error playing audio:", error);
                });
            }
        }
    }, [audioSrc]);

    console.log("Text to speech set to:", text);
    
    return (
        <div>
            <audio id="myAudio" src={audioSrc} autoplay></audio>
        </div>
    );
};

export default PlayAudio;
