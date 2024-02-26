import { myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";

export const UI = () => {
  const { playerTurn, players, winner, winnerIndex } = useGameEngine();
  const currentPlayer = players[playerTurn];
  const me = myPlayer();

  return (
    <div className="pointer-events-none fixed top-0 left-0 p-4">
      <p className="pointer-events-none text-lg font-bold">Current Player:</p>
      <p className="pointer-events-none text-xl">
        {currentPlayer.state.profile.name}
      </p>
      {winner && (
        <p className="pointer-events-none text-2xl font-bold">
          Winner: {players[winnerIndex].state.profile.name}
        </p>
      )}
    </div>
  );
};
