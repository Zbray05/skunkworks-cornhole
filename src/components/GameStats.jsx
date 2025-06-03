// src/components/GameStats.jsx

import React, { useEffect, useRef, useState } from 'react';

/**
 * Read an integer from localStorage[key], or return 0 if missing/invalid.
 */
function readCountFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

/**
 * Write an integer value to localStorage[key].
 */
function writeCountToStorage(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore if localStorage is unavailable
  }
}

/**
 * GameStats component
 *
 * Props:
 *   - gameNumber (number):  The index of the current game (1, 2, 3, …).
 *       Whenever this prop increments compared to the last processed value,
 *       GameStats will count the previous game as “completed.”
 *
 *   - gameWinner ("team1" | "team2" | "tie"):
 *       Who won that completed game. If "tie", only totalGames increments.
 *
 * Usage:
 *   <GameStats
 *     gameNumber={currentGameNumber}
 *     gameWinner={currentGameWinner}
 *   />
 *
 * Under the hood:
 *   • On mount: reads three keys from localStorage:
 *       "totalGames", "team1Wins", "team2Wins" (defaults to 0 if missing).
 *   • Stores them in React state: totalGames, team1Wins, team2Wins.
 *   • Keeps a ref prevGameRef to know which gameNumber was last handled.
 *   • In a useEffect watching [gameNumber, gameWinner, totalGames, team1Wins, team2Wins]:
 *       – If gameNumber > prevGameRef.current, it:
 *           1. totalGames += 1  → persist & setState
 *           2. If gameWinner === "team1", team1Wins += 1;
 *              if gameWinner === "team2", team2Wins += 1;
 *              if "tie", skip team increments.
 *           3. Update prevGameRef.current = gameNumber
 *
 *   • Renders three colored boxes:
 *       • Total Games (black background)
 *       • Team 1 Wins (blue background)
 *       • Team 2 Wins (red background)
 */
export default function GameStats({ gameNumber, gameWinner }) {
  const [totalGames, setTotalGames] = useState(0);
  const [team1Wins, setTeam1Wins] = useState(0);
  const [team2Wins, setTeam2Wins] = useState(0);

  // Track the last “gameNumber” we handled
  const prevGameRef = useRef(gameNumber);

  // On mount: initialize from localStorage
  useEffect(() => {
    const storedTotal = readCountFromStorage('totalGames');
    const storedTeam1 = readCountFromStorage('team1Wins');
    const storedTeam2 = readCountFromStorage('team2Wins');

    setTotalGames(storedTotal);
    setTeam1Wins(storedTeam1);
    setTeam2Wins(storedTeam2);

    prevGameRef.current = gameNumber;
  }, []); // run only once

  // When gameNumber increments, update counts
  useEffect(() => {
    if (gameNumber > prevGameRef.current) {
      // 1) Increment total games
      const newTotal = totalGames + 1;
      setTotalGames(newTotal);
      writeCountToStorage('totalGames', newTotal);

      // 2) Increment the appropriate team win count
      if (gameWinner === 'team1') {
        const newTeam1 = team1Wins + 1;
        setTeam1Wins(newTeam1);
        writeCountToStorage('team1Wins', newTeam1);
      } else if (gameWinner === 'team2') {
        const newTeam2 = team2Wins + 1;
        setTeam2Wins(newTeam2);
        writeCountToStorage('team2Wins', newTeam2);
      }
      // If gameWinner === 'tie', we only increment totalGames.

      // 3) Mark this gameNumber as processed
      prevGameRef.current = gameNumber;
    }
    // We include all state values in dependencies so the UI stays in sync.
  }, [gameNumber, gameWinner, totalGames, team1Wins, team2Wins]);

  // -------------------------------------------------------------------
  // Inline styles for the three statistic boxes:
  // -------------------------------------------------------------------
  const containerStyle = {
    maxWidth: '360px',
    margin: '1rem auto',
    display: 'flex',
    gap: '0.5rem',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const boxBaseStyle = {
    flex: '1 1 0',
    borderRadius: '8px',
    padding: '0.75rem',
    textAlign: 'center',
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const totalGamesStyle = {
    ...boxBaseStyle,
    backgroundColor: '#333333', // black
  };

  const team1Style = {
    ...boxBaseStyle,
    backgroundColor: '#2196F3', // blue
  };

  const team2Style = {
    ...boxBaseStyle,
    backgroundColor: '#E53935', // red
  };

  const labelStyle = {
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
    opacity: 0.9,
  };

  const numberStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
  };

  return (

    <div style={containerStyle}>

      {/* Team 1 Wins */}
      <div style={team1Style}>
        <div style={labelStyle}>Team 1 Wins</div>
        <div style={numberStyle}>{team1Wins}</div>
      </div>

      {/* Total Games */}
      <div style={totalGamesStyle}>
        <div style={labelStyle}>Total Games</div>
        <div style={numberStyle}>{totalGames}</div>
      </div>


      {/* Team 2 Wins */}
      <div style={team2Style}>
        <div style={labelStyle}>Team 2 Wins</div>
        <div style={numberStyle}>{team2Wins}</div>
      </div>
    </div>
  );
}
