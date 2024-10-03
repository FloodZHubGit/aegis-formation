import { isHost, myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";
import { useState } from "react";

export const Discussion = () => {
  const me = myPlayer();
  const { players, speakingOrder, goToVotePhase } = useGameEngine();
  const [isWordVisible, setIsWordVisible] = useState(true);

  const toggleWordVisibility = () => {
    setIsWordVisible(!isWordVisible);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-5 mb-6 w-full max-w-lg">
        <p className="text-lg font-medium text-gray-800">
          Ton mot est:{" "}
          <span className="text-green-600">
            {isWordVisible ? me.getState("word") : "****"}
          </span>
        </p>
        <p className="text-lg font-medium text-red-600">
          {me.getState("alive") ? "" : "Vous êtes mort"}
        </p>
        <button
          onClick={toggleWordVisibility}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isWordVisible ? "Cacher le mot" : "Afficher le mot"}
        </button>
        <p className="text-lg font-medium text-gray-800 mt-4">
          Ordre de parole:{" "}
          <span className="text-green-600">
            {speakingOrder
              .map((player) => player.state.profile.name)
              .join(", ")}
          </span>
        </p>
        {isHost() && (
          <button
            onClick={goToVotePhase}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Aller à la phase de vote
          </button>
        )}
      </div>

      <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
        Joueurs:
      </h3>
      <ul className="w-full max-w-lg bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[400px]">
        {players.map((player, index) => (
          <li
            key={index}
            className={`flex items-center py-3 border-b border-gray-200 hover:bg-gray-100 transition ${
              player.id === me.id ? "bg-yellow-100" : ""
            } ${!player.getState("alive") ? "text-gray-500" : ""}`}
          >
            <img
              src={player.state.profile.photo}
              alt={`${player.state.profile.name}'s avatar`}
              className="w-12 h-12 rounded-full ml-3 mr-3"
              style={{ borderColor: player.state.profile.color }}
            />
            <span className={`text-lg font-medium`}>
              {player.state.profile.name}{" "}
              {player.id === me.id ? "🌟 (toi)" : ""}
              {!player.getState("alive") && " 💀 (mort)"}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
