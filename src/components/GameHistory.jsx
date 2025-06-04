import React, { useEffect, useRef, useState } from "react";

function readHistoryFromStorage() {
    try {
        const json = localStorage.getItem("gameHistory");
        if (!json) return [];
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeHistoryToStorage(historyArray) {
    try {
        localStorage.setItem("gameHistory", JSON.stringify(historyArray));
    } catch {
        // ignore if unavailable
    }
}

export default function GameHistory({
    gameNumber,
    gameWinner,
    team1FinalScore,
    team2FinalScore,
    totalRounds,
}) {
    const [history, setHistory] = useState([]);
    const prevGameRef = useRef(gameNumber);

    useEffect(() => {
        const stored = readHistoryFromStorage();
        setHistory(stored);
        prevGameRef.current = gameNumber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (gameNumber > prevGameRef.current) {
            const finishedGameId = prevGameRef.current;
            const newEntry = {
                gameId: finishedGameId,
                totalRounds: totalRounds,
                winner: gameWinner,
                team1Score: team1FinalScore,
                team2Score: team2FinalScore,
            };

            const updated = [...history, newEntry];
            setHistory(updated);
            writeHistoryToStorage(updated);

            prevGameRef.current = gameNumber;
        }
    }, [
        gameNumber,
        gameWinner,
        team1FinalScore,
        team2FinalScore,
        totalRounds,
        history,
    ]);

    const containerStyle = {
        maxWidth: "360px",
        margin: "1rem auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const headerStyle = {
        fontSize: "1.25rem",
        fontWeight: 600,
        textAlign: "center",
        color: "#333333",
        marginBottom: "0.5rem",
    };

    const emptyMessageStyle = {
        textAlign: "center",
        color: "#777777",
        fontSize: "1rem",
        padding: "1rem",
        backgroundColor: "#F9F9F9",
        border: "1px dashed #CCCCCC",
        borderRadius: "8px",
    };

    const cardStyle = {
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "0.75rem 1rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "80px",
    };

    const leftColumnStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
    };

    const gameIdStyle = {
        fontSize: "1rem",
        fontWeight: 600,
        color: "#333333",
    };

    const roundsStyle = {
        fontSize: "0.875rem",
        color: "#555555",
    };

    const winnerStyle = {
        fontSize: "0.875rem",
        color: "#777777",
    };

    const scoreStyle = {
        fontSize: "1rem",
        fontWeight: 500,
        color: "#222222",
    };

    const rightColumnStyle = {
        textAlign: "right",
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>Game History</div>

            {history.length === 0 ? (
                <div style={emptyMessageStyle}>Start playing to see scores</div>
            ) : (
                history
                .slice()
                .reverse()
                .map((entry) => (
                    <div key={entry.gameId} style={cardStyle}>
                        <div style={leftColumnStyle}>
                            <div style={gameIdStyle}>Game {entry.gameId}</div>
                            <div style={roundsStyle}>
                                Rounds: {entry.totalRounds}
                            </div>
                            <div style={winnerStyle}>
                                Winner:{" "}
                                {entry.winner === "team1" ? "Team 1" : "Team 2"}
                            </div>
                        </div>
                        <div style={rightColumnStyle}>
                            <div style={scoreStyle}>
                                {entry.team1Score} - {entry.team2Score}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
