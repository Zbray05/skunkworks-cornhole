import React, { useState, useEffect } from "react";
import Scoreboard from "./Scoreboard.jsx";
import GameStats from "./GameStats.jsx";
import GameHistory from "./GameHistory.jsx";
import VideoRoundRecorder from "./VideoRoundRecorder.jsx";
import useModelScore from "../hooks/useModelScore.js";

function readCountFromStorage(key) {
    try {
        const val = parseInt(localStorage.getItem(key), 10);
        return isNaN(val) ? 0 : val;
    } catch {
        return 0;
    }
}

export default function CornholeApp() {
    const [gameNumber, setGameNumber] = useState(readCountFromStorage("totalGames") + 1 || 1);

    const [gameWinner, setGameWinner] = useState("team1");

    const [team1FinalScore, setTeam1FinalScore] = useState(0);
    const [team2FinalScore, setTeam2FinalScore] = useState(0);

    const [totalRounds, setTotalRounds] = useState(0);

    const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);

    const {
        data: roundData,
        loading: modelLoading,
        // error: llmError,
    } = useModelScore(recordedBlobUrl);

    useEffect(() => {
        if (roundData) {
            setTotalRounds((prev) => prev + 1);
        }
    }, [roundData]);

    const handleGameComplete = (winner, final1, final2, roundsCount) => {
        setGameWinner(winner);
        setTeam1FinalScore(final1);
        setTeam2FinalScore(final2);
        setTotalRounds(roundsCount);

        setGameNumber((prev) => prev + 1);
        setTotalRounds(0);
    };

    return (
        <div
            style={{
                background: "#FAF5EA",
                padding: "20px",
                maxWidth: "800px",
                margin: "auto",
            }}
        >
            <VideoRoundRecorder
                modelLoading={modelLoading}
                recordedBlobUrl={recordedBlobUrl}
                setRecordedBlobUrl={setRecordedBlobUrl}
            />

            <Scoreboard
                round={totalRounds}
                roundData={roundData}
                onGameComplete={handleGameComplete}
            />

            <GameStats gameNumber={gameNumber} gameWinner={gameWinner} readCountFromStorage={readCountFromStorage}/>

            <GameHistory
                gameNumber={gameNumber}
                gameWinner={gameWinner}
                team1FinalScore={team1FinalScore}
                team2FinalScore={team2FinalScore}
                totalRounds={totalRounds}
            />
        </div>
    );
}
