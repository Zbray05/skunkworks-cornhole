// src/components/Scoreboard.jsx

import React, { useState, useEffect } from "react";

/**
 * defaultCalculateScores:
 *   - Input:  llmData (e.g. { team: 'team1', points: 3 })
 *   - Output: { team1score: <number>, team2score: <number> }
 *
 * Feel free to replace this with your own function (via props)
 * if your LLM starts returning a more complex object.
 */
function defaultCalculateScores(currentScore, scoreData) {
    const result = currentScore || { team1score: 0, team2score: 0 };
    if (!scoreData) return result;

    // Example shape: { team: 'team1' | 'team2', points: <number> }
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
    calculateScores = defaultCalculateScores,
}) {
    // Internal state for each team’s score
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);

    // Which field is in “edit mode” right now: 'team1' | 'team2' | null
    const [editingField, setEditingField] = useState(null);

    // Temporary input value when editing
    const [tempValue, setTempValue] = useState("");

    // Whenever llmData changes, recalc both scores in one go:
    useEffect(() => {
        const { team1score, team2score } = calculateScores(roundData);
        setTeam1Score(team1score);
        setTeam2Score(team2score);
    }, [roundData, calculateScores]);

    // Called when the user clicks “Edit” on one of the two cards
    const handleEditClick = (team) => {
        setEditingField(team);
        setTempValue(
            team === "team1" ? team1Score.toString() : team2Score.toString()
        );
    };

    // Called when user clicks “Save” after editing a score
    const handleSaveClick = (team) => {
        const val = parseInt(tempValue, 10);
        if (!isNaN(val) && val >= 0) {
            if (team === "team1") setTeam1Score(val);
            else setTeam2Score(val);
        }
        setEditingField(null);
    };

    // Cancel editing (just drop the temp value)
    const handleCancel = () => {
        setEditingField(null);
    };

    // Decide result text based on numeric comparison
    const getResultText = () => {
        if (team1Score > team2Score) return "Player 1 wins this round!";
        if (team2Score > team1Score) return "Player 2 wins this round!";
        return "It's a tie!";
    };

    //
    // Inline styles to mimic your screenshot
    //
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
    };

    return (
        <div style={containerStyle}>
            <div style={roundTextStyle}>Round {round}</div>
            <div style={underlineStyle} />

            <div style={separatorStyle} />

            <div style={scoresRowStyle}>
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

            {false && <div style={resultTextStyle}>{getResultText()}</div>}
        </div>
    );
}
