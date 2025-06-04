import React, { useState, useEffect } from "react";

export default function Scoreboard({ round, roundData, onGameComplete }) {
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [tempValue, setTempValue] = useState("");
    const [editingTeam, setEditingTeam] = useState(null);

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
        if (team1Score === 0 && team2Score === 0) return;
        const winner = team1Score > team2Score ? "team1" : "team2";
        setTeam1Score(0);
        setTeam2Score(0);
        onGameComplete(winner, team1Score, team2Score, round);
    };

    // When user taps “Edit” on one of the cards:
    const openEditModal = (team) => {
        setEditingTeam(team);
        if (team === "team1") {
            setTempValue(team1Score);
        } else {
            setTempValue(team2Score);
        }
    };

    // Save the modal value back to that team’s score
    const saveEdit = () => {
        if (editingTeam === "team1") {
            setTeam1Score(tempValue);
        } else if (editingTeam === "team2") {
            setTeam2Score(tempValue);
        }
        setEditingTeam(null);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingTeam(null);
    };

    const themeColor = editingTeam === "team1" ? "#2196F3" : "#E53935";
    const lightThemeColor = editingTeam === "team1" ? "#E3F2FD" : "#FCE4EC";
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

    const saveButtonStyle = {
        flex: 1,
        padding: "0.5rem 0",
        fontSize: "1rem",
        backgroundColor: themeColor, // dynamic button color
        border: "none",
        borderRadius: "8px",
        color: "#FFFFFF",
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

    const minusPlusButtonStyle = {
        width: "40px",
        height: "40px",
        borderRadius: "20px",
        backgroundColor: lightThemeColor, // dynamic “light” background
        border: `2px solid ${themeColor}`, // dynamic border
        color: themeColor, // dynamic text color
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: "40px",
        textAlign: "center",
        cursor: "pointer",
        userSelect: "none",
    };

    const modalNumberStyle = {
        fontSize: "2rem",
        fontWeight: 600,
        color: themeColor, // dynamic color
        minWidth: "32px",
        textAlign: "center",
    };

    const modalButtonsRowStyle = {
        display: "flex",
        justifyContent: "space-between",
        gap: "0.5rem",
    };
    const modalTitleStyle = {
        fontSize: "1.25rem",
        fontWeight: 600,
        textAlign: "center",
        color: "#333333",
        marginBottom: "0.25rem",
    };

    const modalUnderlineStyle = {
        width: "64px",
        height: "4px",
        margin: "0.25rem auto 0.75rem auto",
        borderRadius: "2px",
        background: themeColor, // dynamic underline color
    };

    const modalValueRowStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        margin: "1rem 0",
    };

    const modalOverlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const modalDialogStyle = {
        background: "#FFFFFF",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "320px",
        padding: "1rem",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    };

    return (
        <div style={containerStyle}>
            <div style={roundTextStyle}>Round {round}</div>
            <div style={underlineStyle} />

            <div style={separatorStyle} />

            <div style={scoresRowStyle}>
                <div style={cardStyle}>
                    <div style={teamLabelStyle}>Team 1</div>
                    <div style={scoreNumberStyle("team1")}>{team1Score}</div>
                    <button
                        style={editButtonStyle("team1")}
                        onClick={() => openEditModal("team1")}
                    >
                        ✎ Edit
                    </button>
                </div>

                <div style={cardStyle}>
                    <div style={teamLabelStyle}>Team 2</div>
                    <div style={scoreNumberStyle("team2")}>{team2Score}</div>
                    <button
                        style={editButtonStyle("team2")}
                        onClick={() => openEditModal("team2")}
                    >
                        ✎ Edit
                    </button>
                </div>
            </div>

            <button style={completeButtonStyle} onClick={handleGameComplete}>
                Complete Game
            </button>
            {editingTeam && (
                <div style={modalOverlayStyle}>
                    <div style={modalDialogStyle}>
                        <div style={modalTitleStyle}>
                            Edit{" "}
                            {editingTeam === "team1" ? "Team 1" : "Team 2"}{" "}
                            Score
                        </div>
                        <div style={modalUnderlineStyle} />

                        <div style={modalValueRowStyle}>
                            {/* Minus Button */}
                            <div
                                style={minusPlusButtonStyle}
                                onClick={() =>
                                    setTempValue((prev) =>
                                        prev > 0 ? prev - 1 : 0
                                    )
                                }
                            >
                                −
                            </div>

                            {/* Current Value */}
                            <div style={modalNumberStyle}>{tempValue}</div>

                            {/* Plus Button */}
                            <div
                                style={minusPlusButtonStyle}
                                onClick={() => setTempValue((prev) => prev + 1)}
                            >
                                +
                            </div>
                        </div>

                        <div style={modalButtonsRowStyle}>
                            <button style={saveButtonStyle} onClick={saveEdit}>
                                ✓ Save
                            </button>
                            <button
                                style={cancelButtonStyle}
                                onClick={cancelEdit}
                            >
                                × Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
