import { myPlayer, isHost } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";
import { useState } from "react";
import { Lobby } from "./Lobby";
import { Discussion } from "./Discussion";
import { Vote } from "./Vote";
import { Elimination } from "./Elimination";
import { Fin } from "./Fin";

export const Incognito = () => {
  const me = myPlayer();
  const { players, startGame, phase } = useGameEngine();

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-purple-400 to-pink-300 min-h-screen p-4">
      <h1 className="text-5xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
        Incognito
      </h1>
      <div className="text-2xl font-bold text-white mb-4">
        Phase en cours: {phase}
      </div>
      {phase === "lobby" && <Lobby />}
      {phase === "discussion" && <Discussion />}
      {phase === "vote" && <Vote />}
      {phase === "elimination" && <Elimination />}
      {phase === "fin" && <Fin />}
    </div>
  );
};
