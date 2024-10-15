import React from "react";
import { useGameEngine } from "../hooks/useGameEngine";

export const StreamScreen = () => {
  const { players } = useGameEngine();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stream Screen</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex flex-col items-center p-2 bg-white shadow rounded-lg"
          >
            <img
              className="w-16 h-16 rounded-full mb-2"
              src={player.state.profile.photo}
              alt={`${player.state.profile.name}'s avatar`}
            />
            <span className="text-sm font-medium text-center">
              {player.state.profile.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
