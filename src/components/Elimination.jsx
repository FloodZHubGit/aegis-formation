import { isHost, myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";

export const Elimination = () => {
  const me = myPlayer();
  const { playerToEliminate, players, checkGameEnd } = useGameEngine();

  const eliminatedPlayer = players.find(
    (player) => player.id === playerToEliminate
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6 w-full max-w-lg">
      <p className="text-2xl font-bold text-gray-800 mb-4">
        {eliminatedPlayer
          ? `👋 ${eliminatedPlayer.state.profile.name} a été éliminé`
          : "Personne n'a été éliminé"}
      </p>
      {isHost() && (
        <button
          onClick={checkGameEnd}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Suivant
        </button>
      )}
    </div>
  );
};
