import React, { useState, useEffect } from "react";

function defaultCalculateScores(currentScore, scoreData) {
    const result = currentScore || { team1score: 0, team2score: 0 };
    if (!scoreData) return result;

    if (scoreData.team === "team1") {
        result.team1score += scoreData.points;
    } else if (scoreData.team === "team2") {
        result.team2score += scoreData.points;
    }
    return result;
}

export default function Scoreboard({
    round,
    roundData,
    onGameComplete,
    calculateScores = defaultCalculateScores,
}) {
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState("");

    useEffect(() => {
        const { team1score, team2score } = calculateScores(roundData);
        setTeam1Score(team1score);
        setTeam2Score(team2score);
    }, [roundData, calculateScores]);

    const handleGameComplete = () => {
        const winner = team1Score > team2Score ? "team1" : "team2";
        onGameComplete(winner, team1Score, team2Score, round);
    };

    const handleEditClick = (team) => {
        setEditingField(team);
        setTempValue((team === "team1" ? team1Score : team2Score).toString());
    };

    const handleSaveClick = (team) => {
        const val = parseInt(tempValue, 10);
        if (!isNaN(val) && val >= 0) {
            if (team === "team1") setTeam1Score(val);
            else setTeam2Score(val);
        }
        setEditingField(null);
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    const getResultText = () => {
        return team1Score > team2Score
            ? "Player 1 wins this round!"
            : "Player 2 wins this round!";
    };

    const containerStyle = {
        maxWidth: "360px",
        margin: "1rem auto",
        background: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        padding: "1rem",
        fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const roundTextStyle = {
        fontSize: "1.25rem",
        fontWeight: 600,
        textAlign: "center",
        marginBottom: "0.25rem",
        color: "#333333",
    };

    const underlineStyle = {
        width: "64px",
        height: "4px",
        margin: "0.25rem auto 0.75rem auto",
        borderRadius: "2px",
        background: "linear-gradient(to right, #2196F3 50%, #E53935 50%)",
    };

    const separatorStyle = {
        width: "100%",
        height: "1px",
        background: "#EEEEEE",
        margin: "0.75rem 0",
    };

    const scoresRowStyle = {
        display: "flex",
        justifyContent: "space-between",
        gap: "0.5rem",
        marginBottom: "0.75rem",
    };

    const cardStyle = {
        flex: "1 1 0",
        background: "#FAFAFA",
        borderRadius: "12px",
        padding: "0.75rem",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    };

    const playerLabelStyle = {
        fontSize: "0.9rem",
        fontWeight: 500,
        marginBottom: "0.5rem",
        color: "#555555",
    };

    const scoreNumberStyle = (team) => ({
        fontSize: "2rem",
        fontWeight: 600,
        marginBottom: "0.5rem",
        color: team === "team1" ? "#2196F3" : "#E53935",
    });

    const editButtonStyle = (team) => ({
        padding: "0.4rem 0.75rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        borderRadius: "6px",
        border: `2px solid ${team === "team1" ? "#2196F3" : "#E53935"}`,
        background: "transparent",
        color: team === "team1" ? "#2196F3" : "#E53935",
        cursor: "pointer",
    });

    const inputStyle = {
        width: "60px",
        padding: "0.3rem",
        fontSize: "1rem",
        textAlign: "center",
        borderRadius: "4px",
        border: "1px solid #CCCCCC",
        marginBottom: "0.5rem",
    };

    const saveCancelRowStyle = {
        display: "flex",
        justifyContent: "center",
        gap: "0.5rem",
    };

    const saveButtonStyle = {
        padding: "0.3rem 0.6rem",
        fontSize: "0.85rem",
        background: "#4CAF50",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    };

    const cancelButtonStyle = {
        padding: "0.3rem 0.6rem",
        fontSize: "0.85rem",
        background: "#F44336",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    };

    const resultTextStyle = {
        textAlign: "center",
        fontSize: "1rem",
        fontWeight: 500,
        color: "#444444",
        marginBottom: "0.75rem",
    };

    const completeButtonStyle = {
        display: "block",
        margin: "0.5rem auto 0",
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        backgroundColor: "#4CAF50",
        color: "#FFF",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    };

    return (
        <div style={containerStyle}>
            {/* Round Header */}
            <div style={roundTextStyle}>Round {round}</div>
            <div style={underlineStyle} />

            {/* Separator */}
            <div style={separatorStyle} />

            {/* Scores Row */}
            <div style={scoresRowStyle}>
                {/* Player 1 Card */}
                <div style={cardStyle}>
                    <div style={playerLabelStyle}>Player 1</div>
                    {editingField === "team1" ? (
                        <>
                            <input
                                type="number"
                                min="0"
                                style={inputStyle}
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                            />
                            <div style={saveCancelRowStyle}>
                                <button
                                    style={saveButtonStyle}
                                    onClick={() => handleSaveClick("team1")}
                                >
                                    Save
                                </button>
                                <button
                                    style={cancelButtonStyle}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={scoreNumberStyle("team1")}>
                                {team1Score}
                            </div>
                            <button
                                style={editButtonStyle("team1")}
                                onClick={() => handleEditClick("team1")}
                            >
                                ✎ Edit
                            </button>
                        </>
                    )}
                </div>

                {/* Player 2 Card */}
                <div style={cardStyle}>
                    <div style={playerLabelStyle}>Player 2</div>
                    {editingField === "team2" ? (
                        <>
                            <input
                                type="number"
                                min="0"
                                style={inputStyle}
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                            />
                            <div style={saveCancelRowStyle}>
                                <button
                                    style={saveButtonStyle}
                                    onClick={() => handleSaveClick("team2")}
                                >
                                    Save
                                </button>
                                <button
                                    style={cancelButtonStyle}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={scoreNumberStyle("team2")}>
                                {team2Score}
                            </div>
                            <button
                                style={editButtonStyle("team2")}
                                onClick={() => handleEditClick("team2")}
                            >
                                ✎ Edit
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Result Text (no tie case) */}
            <div style={resultTextStyle}>{getResultText()}</div>

            {/* Button to finalize this game */}
            <button style={completeButtonStyle} onClick={handleGameComplete}>
                Complete Game
            </button>
        </div>
    );
}
