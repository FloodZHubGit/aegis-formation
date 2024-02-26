import { myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";

export const UI = () => {
  const { playerTurn, players } = useGameEngine();
  const currentPlayer = players[playerTurn];
  const me = myPlayer();

  console.log("currentPlayer", currentPlayer);

  return (
    <div className="pointer-events-none fixed top-0 left-0 p-4">
      <p className="pointer-events-none text-lg font-bold">Current Player:</p>
      <p className="pointer-events-none text-xl">
        {currentPlayer.state.profile.name}
      </p>
    </div>
  );
};
