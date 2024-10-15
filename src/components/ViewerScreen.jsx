import React from "react";
import { useGameEngine } from "../hooks/useGameEngine";
import { myPlayer } from "playroomkit";

export const ViewerScreen = () => {
  const { players, phase } = useGameEngine();
  const me = myPlayer();

  return (
    <>
      {phase === "lobby" && (
        <div className="p-4">
          <p>En attente du démarrage de la formation...</p>
        </div>
      )}
      <div className="p-4">
        <div className="flex flex-col items-center p-2 bg-white shadow rounded-lg">
          <img
            className="w-16 h-16 rounded-full mb-2"
            src={me.state.profile.photo}
            alt={`${me.state.profile.name}'s avatar`}
          />
          <span className="text-sm font-medium text-center">
            {me.state.profile.name}
          </span>
        </div>
      </div>
    </>
  );
};
