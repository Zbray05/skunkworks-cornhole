import React, { useState, useEffect } from "react";

export default function Scoreboard({ round, roundData, onGameComplete }) {
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState("");

    useEffect(() => {
        if (!roundData) return;

        console.log("Updating scores with round data:", roundData);

        if (roundData.team === "team1") {
            setTeam1Score((prev) => prev + roundData.points);
        } else if (roundData.team === "team2") {
            setTeam2Score((prev) => prev + roundData.points);
        }
    }, [roundData]);

    const handleGameComplete = () => {
        if (team1Score === 0 && team2Score === 0) return
        const winner = team1Score > team2Score ? "team1" : "team2";
        setTeam1Score(0);
        setTeam2Score(0);
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

    const teamLabelStyle = {
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
            <div style={roundTextStyle}>Round {round}</div>
            <div style={underlineStyle} />

            <div style={separatorStyle} />

            <div style={scoresRowStyle}>
                <div style={cardStyle}>
                    <div style={teamLabelStyle}>Team 1</div>
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
                    <div style={teamLabelStyle}>Team 2</div>
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

            <button style={completeButtonStyle} onClick={handleGameComplete}>
                Complete Game
            </button>
        </div>
    );
}
