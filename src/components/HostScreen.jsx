import React from "react";
import { useGameEngine } from "../hooks/useGameEngine";
import { isHost, myPlayer } from "playroomkit";

export const HostScreen = () => {
  const { players, phase } = useGameEngine();
  const me = myPlayer();
  console.log("players", players);

  const handleKick = async (player) => {
    try {
      await player.kick();
    } catch (error) {
      console.error("Failed to kick player:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ecran formateur</h1>
      <ul className="space-y-4">
        {players
          .filter((player) => player.id !== me.id)
          .map((player) => (
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
              {isHost() && (
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={() => handleKick(player)}
                >
                  Kick
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
