import React, { useEffect, useRef, useState } from "react";

function writeCountToStorage(key, value) {
    try {
        localStorage.setItem(key, value.toString());
    } catch {
        // ignore if storage unavailable
    }
}

export default function GameStats({ gameNumber, gameWinner, readCountFromStorage}) {
    const [totalGames, setTotalGames] = useState(0);
    const [team1Wins, setTeam1Wins] = useState(0);
    const [team2Wins, setTeam2Wins] = useState(0);

    const prevGameRef = useRef(gameNumber);

    useEffect(() => {
        const storedTotal = readCountFromStorage("totalGames");
        const storedTeam1 = readCountFromStorage("team1Wins");
        const storedTeam2 = readCountFromStorage("team2Wins");

        setTotalGames(storedTotal);
        setTeam1Wins(storedTeam1);
        setTeam2Wins(storedTeam2);
        prevGameRef.current = gameNumber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (gameNumber > prevGameRef.current) {
            const newTotal = totalGames + 1;
            setTotalGames(newTotal);
            writeCountToStorage("totalGames", newTotal);

            if (gameWinner === "team1") {
                const newTeam1 = team1Wins + 1;
                setTeam1Wins(newTeam1);
                writeCountToStorage("team1Wins", newTeam1);
            } else {
                const newTeam2 = team2Wins + 1;
                setTeam2Wins(newTeam2);
                writeCountToStorage("team2Wins", newTeam2);
            }

            prevGameRef.current = gameNumber;
        }
    }, [gameNumber, gameWinner, totalGames, team1Wins, team2Wins]);

    const containerStyle = {
        maxWidth: "360px",
        margin: "1rem auto",
        display: "flex",
        gap: "0.5rem",
        fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const boxBaseStyle = {
        flex: "1 1 0",
        borderRadius: "8px",
        padding: "0.75rem",
        textAlign: "center",
        color: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    };

    const totalGamesStyle = {
        ...boxBaseStyle,
        backgroundColor: "#333333", // black
    };

    const team1Style = {
        ...boxBaseStyle,
        backgroundColor: "#2196F3", // blue
    };

    const team2Style = {
        ...boxBaseStyle,
        backgroundColor: "#E53935", // red
    };

    const labelStyle = {
        fontSize: "0.875rem",
        marginBottom: "0.25rem",
        opacity: 0.9,
    };

    const numberStyle = {
        fontSize: "1.5rem",
        fontWeight: 600,
    };

    return (
        <div style={containerStyle}>
            <div style={team1Style}>
                <div style={labelStyle}>Team 1 Wins</div>
                <div style={numberStyle}>{team1Wins}</div>
            </div>

            <div style={totalGamesStyle}>
                <div style={labelStyle}>Total Games</div>
                <div style={numberStyle}>{totalGames}</div>
            </div>

            <div style={team2Style}>
                <div style={labelStyle}>Team 2 Wins</div>
                <div style={numberStyle}>{team2Wins}</div>
            </div>
        </div>
    );
}
