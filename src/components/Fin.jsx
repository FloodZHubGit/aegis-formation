import { isHost, myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";

export const Fin = () => {
  const me = myPlayer();
  const { playerToEliminate, players, goToLobby, winners, winner } =
    useGameEngine();

  console.log("winner", winner);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-5 mb-6 w-full max-w-lg">
        <p className="text-lg font-medium text-gray-800">
          Ton rôle était: <span>{me.getState("role")}</span>
        </p>

        <p className="text-lg font-medium text-gray-800">
          Les gagnants sont: {winner}
        </p>

        {isHost() && (
          <button
            onClick={goToLobby}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retourner au lobby
          </button>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
          Gagnants:
        </h3>
        <ul className="w-full max-w-lg bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[400px]">
          {winners.map((winner, index) => (
            <li
              key={index}
              className={`flex items-center py-3 border-b border-gray-200 hover:bg-gray-100 transition ${
                winner.id === me.id ? "bg-yellow-100" : ""
              }`}
            >
              <img
                src={winner.state.profile.photo}
                alt={`${winner.state.profile.name}'s avatar`}
                className="w-12 h-12 rounded-full ml-3 mr-3"
                style={{ borderColor: winner.state.profile.color }}
              />
              <span className="text-lg font-medium">
                {winner.state.profile.name}
                {winner.id === me.id ? " 🌟 (toi)" : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
