import { myPlayer, isHost } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";
import { useState } from "react";

export const Game = () => {
    const me = myPlayer();
    const { players, startGame, phase } = useGameEngine();
    const hostId = players.find(player => player.isHost)?.id; // Get the host's ID

    const totalPlayers = players.length;
    const [numIncognito, setNumIncognito] = useState(0);
    const [numMrBlanco, setNumMrBlanco] = useState(0);

    // Calculate the number of civilians based on the total players minus incognito and Mr. Blanco
    const numCivilians = totalPlayers - numIncognito - numMrBlanco;
    const maxBadRoles = Math.floor(totalPlayers / 2); // Maximum bad roles allowed

    const handleIncognitoChange = (delta) => {
        const newIncognito = numIncognito + delta;
        if (newIncognito >= 0 && newIncognito + numMrBlanco <= maxBadRoles) {
            setNumIncognito(newIncognito);
        }
    };

    const handleMrBlancoChange = (delta) => {
        const newMrBlanco = numMrBlanco + delta;
        const newIncognito = numIncognito; // Capture the current value of numIncognito
        // Ensure we don't exceed the total players minus the required civilians
        if (newMrBlanco >= 0 && newIncognito + newMrBlanco <= maxBadRoles) {
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
        <div className="flex flex-col items-center bg-gradient-to-b from-purple-400 to-pink-300 min-h-screen p-6">
            <h1 className="text-5xl font-extrabold text-white text-center mb-4 drop-shadow-lg">Incognito</h1>
            {isHost() && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-4 w-full max-w-md">
                    <p className="text-xl text-gray-700 mb-2">🎉 Vous êtes l'hôte de la partie!</p>
                    <p className="text-lg font-semibold text-gray-800 mb-2">Joueurs: <span className="text-green-500">{totalPlayers}</span></p>
                    <p className="text-lg font-semibold text-gray-800 mb-2">Civils: <span className="text-green-500">{numCivilians}</span></p>
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                        Incognito + Mr. Blanco: <span className="text-red-500">{numIncognito + numMrBlanco}</span> / <span className="text-red-500">{maxBadRoles}</span>
                    </p>
                    <div className="flex items-center mb-4 bg-gray-100 p-3 rounded-lg shadow-sm">
                        <span className="mr-2 font-medium text-gray-700">Incognito:</span>
                        <button 
                            onClick={() => handleIncognitoChange(-1)} 
                            className="bg-gray-200 hover:bg-gray-300 text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center transition" 
                            disabled={numIncognito <= 0}
                        >
                            -
                        </button>
                        <span className="mx-2 text-lg font-semibold">{numIncognito}</span>
                        <button 
                            onClick={() => handleIncognitoChange(1)} 
                            className="bg-gray-200 hover:bg-gray-300 text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center transition"
                        >
                            +
                        </button>
                    </div>
                    <div className="flex items-center mb-4 bg-gray-100 p-3 rounded-lg shadow-sm">
                        <span className="mr-2 font-medium text-gray-700">Mr. Blanco:</span>
                        <button 
                            onClick={() => handleMrBlancoChange(-1)} 
                            className="bg-gray-200 hover:bg-gray-300 text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center transition" 
                            disabled={numMrBlanco <= 0}
                        >
                            -
                        </button>
                        <span className="mx-2 text-lg font-semibold">{numMrBlanco}</span>
                        <button 
                            onClick={() => handleMrBlancoChange(1)} 
                            className="bg-gray-200 hover:bg-gray-300 text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center transition"
                        >
                            +
                        </button>
                    </div>
                    <button 
                        onClick={startGame(numIncognito, numMrBlanco)}
                        className="mt-3 bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
                    >
                        🎮 Commencer la partie
                    </button>
                </div>
            )}
            <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">Joueurs:</h3>
            <ul className="w-full max-w-md bg-white rounded-xl shadow-lg p-4">
                {players.map((player, index) => (
                    <li 
                        key={index} 
                        className={`flex items-center py-4 border-b border-gray-200 hover:bg-gray-100 transition ${player.id === me.id ? 'bg-yellow-100' : ''}`}
                    >
                        <img 
                            src={player.state.profile.photo} 
                            alt={`${player.state.profile.name}'s avatar`} 
                            className="w-14 h-14 rounded-full mr-4" 
                            style={{ borderColor: player.state.profile.color }} // Use player color for border
                        />
                        <span className={`text-gray-800 text-lg font-medium ${player.id === hostId ? 'font-bold' : ''}`}>
                            {player.state.profile.name} {player.id === me.id ? "🌟 (toi)" : ""}
                            {player.id === hostId && " 👑 (Hôte)"}
                        </span>
                        {isHost() && player.id !== hostId && player.id !== me.id && (
                            <button 
                                onClick={() => handleKick(player)}
                                className="ml-auto mr-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition"
                            >
                                Kick
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}