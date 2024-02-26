import { myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";

export const UI = () => {
  const {
    playerTurn,
    players,
    winner,
    winnerIndex,
    selectNewColor,
    selectColor,
  } = useGameEngine();
  const currentPlayer = players[playerTurn];
  const me = myPlayer();

  return (
    <div className="fixed top-0 left-0 p-4">
      <p className="pointer-events-none text-lg font-bold">Players:</p>
      {players.map((player, index) => (
        <p className="pointer-events-none text-xl" key={index}>
          {index === playerTurn ? (
            <strong>Current Player: {player.state.profile.name}</strong>
          ) : (
            player.state.profile.name
          )}
        </p>
      ))}
      {winner && (
        <p className="pointer-events-none text-2xl font-bold">
          Winner: {players[winnerIndex].state.profile.name}
        </p>
      )}
      {selectNewColor && currentPlayer === me && (
        <div>
          <p>Choose a new color:</p>
          <button onClick={() => selectColor("red")} className="bg-red-500">
            Red
          </button>
          <button onClick={() => selectColor("green")} className="bg-green-500">
            Green
          </button>
          <button onClick={() => selectColor("blue")} className="bg-blue-500">
            Blue
          </button>
          <button
            onClick={() => selectColor("yellow")}
            className="bg-yellow-500"
          >
            Yellow
          </button>
        </div>
      )}
    </div>
  );
};
