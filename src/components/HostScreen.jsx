import React from "react";
import { useGameEngine } from "../hooks/useGameEngine";
import { isHost, myPlayer } from "playroomkit";

export const HostScreen = () => {
  const { players, phase, gameSetup, wordList } = useGameEngine();
  const me = myPlayer();

  const handleSetupGame = () => {
    gameSetup();
  };

  return (
    <>
      {phase === "lobby" && (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Host Screen</h1>
          {isHost() && (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-4"
              onClick={handleSetupGame}
            >
              Setup Game
            </button>
          )}
          <ul className="space-y-4">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex items-center p-4 bg-white shadow rounded-lg"
              >
                <img
                  className="w-12 h-12 rounded-full mr-4"
                  src={player.state.profile.photo}
                  alt={`${player.state.profile.name}'s avatar`}
                />
                <span className="flex-1 text-lg font-medium">
                  {player.state.profile.name}
                </span>
                <span className="text-sm ml-4">
                  Word: {player.state.word || "None"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase === "mindmap" && (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Mindmap</h1>
          {isHost() && (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-4"
              onClick={handleSetupGame}
            >
              Setup Game
            </button>
          )}
          <ul className="space-y-4">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex items-center p-4 bg-white shadow rounded-lg"
              >
                <img
                  className="w-12 h-12 rounded-full mr-4"
                  src={player.state.profile.photo}
                  alt={`${player.state.profile.name}'s avatar`}
                />
                <span className="flex-1 text-lg font-medium">
                  {player.state.profile.name}
                </span>
                <span className="text-sm ml-4">
                  Word: {player.state.word || "None"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
