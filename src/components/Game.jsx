import { myPlayer, isHost } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";
import { useState } from "react";

export const Game = () => {
  const me = myPlayer();
  const { players, startGame, phase } = useGameEngine();

  const totalPlayers = players.length;
  const [numIncognito, setNumIncognito] = useState(0);
  const [numMrBlanco, setNumMrBlanco] = useState(0);

  const numCivilians = totalPlayers - numIncognito - numMrBlanco;
  const maxBadRoles = Math.floor(totalPlayers / 2);

  const handleIncognitoChange = (delta) => {
    const newIncognito = numIncognito + delta;
    if (newIncognito >= 0 && newIncognito + numMrBlanco <= maxBadRoles) {
      setNumIncognito(newIncognito);
    }
  };

  const handleMrBlancoChange = (delta) => {
    const newMrBlanco = numMrBlanco + delta;
    if (newMrBlanco >= 0 && numIncognito + newMrBlanco <= maxBadRoles) {
      setNumMrBlanco(newMrBlanco);
    }
  };

  const handleKick = async (player) => {
    try {
      await player.kick();
    } catch (error) {
      console.error("Failed to kick player:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-purple-400 to-pink-300 min-h-screen p-4">
      <h1 className="text-5xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
        Incognito
      </h1>
      {isHost() && (
        <div className="bg-white rounded-lg shadow-md p-5 mb-6 w-full max-w-lg">
          <p className="text-xl font-semibold text-gray-700 mb-4">
            🎉 Vous êtes l'hôte de la partie!
          </p>
          <p className="text-lg font-medium text-gray-800">
            Joueurs: <span className="text-green-600">{totalPlayers}</span>
          </p>
          <p className="text-lg font-medium text-gray-800">
            Civils: <span className="text-green-600">{numCivilians}</span>
          </p>
          <div className="flex justify-between mb-4">
            <p className="text-lg font-medium text-gray-800">
              Incognito + Mr. Blanco:{" "}
              <span className="text-red-500">{numIncognito + numMrBlanco}</span>{" "}
              / <span className="text-red-500">{maxBadRoles}</span>
            </p>
          </div>

          {/* Controls for adjusting Incognito and Mr. Blanco */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Incognito Controls */}
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium text-gray-800 mb-2">
                Incognito:
              </span>
              <div className="flex">
                <button
                  onClick={() => handleIncognitoChange(-1)}
                  className="px-3 py-2 bg-gray-300 rounded-l-lg"
                  disabled={numIncognito <= 0}
                >
                  -
                </button>
                <span className="px-4 py-2 bg-white border-t border-b border-gray-200">
                  {numIncognito}
                </span>
                <button
                  onClick={() => handleIncognitoChange(1)}
                  className="px-3 py-2 bg-gray-300 rounded-r-lg"
                  disabled={numIncognito + numMrBlanco >= maxBadRoles}
                >
                  +
                </button>
              </div>
            </div>

            {/* Mr. Blanco Controls */}
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium text-gray-800 mb-2">
                Mr. Blanco:
              </span>
              <div className="flex">
                <button
                  onClick={() => handleMrBlancoChange(-1)}
                  className="px-3 py-2 bg-gray-300 rounded-l-lg"
                  disabled={numMrBlanco <= 0}
                >
                  -
                </button>
                <span className="px-4 py-2 bg-white border-t border-b border-gray-200">
                  {numMrBlanco}
                </span>
                <button
                  onClick={() => handleMrBlancoChange(1)}
                  className="px-3 py-2 bg-gray-300 rounded-r-lg"
                  disabled={numIncognito + numMrBlanco >= maxBadRoles}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Start Game Button */}
          <button
            onClick={() => startGame(numIncognito, numMrBlanco)}
            className={`w-full py-3 font-semibold text-center text-gray-800 rounded-lg shadow transition-transform ${
              totalPlayers < 3
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:scale-105 hover:shadow-lg"
            }`}
            disabled={totalPlayers < 3}
          >
            🎮 Commencer la partie
          </button>
          {totalPlayers < 3 && (
            <p className="text-red-500 mt-2 text-center">
              Au moins 3 joueurs sont nécessaires pour commencer la partie.
            </p>
          )}
        </div>
      )}

      {/* Player List */}
      <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
        Joueurs:
      </h3>
      <ul className="w-full max-w-lg bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[400px]">
        {players.map((player, index) => (
          <li
            key={index}
            className={`flex items-center py-3 border-b border-gray-200 hover:bg-gray-100 transition ${
              player.id === me.id ? "bg-yellow-100" : ""
            }`}
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
            </span>
            {isHost() && player.id !== me.id && (
              <button
                onClick={() => handleKick(player)}
                className="ml-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full transition"
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
