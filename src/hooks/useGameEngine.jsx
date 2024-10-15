import {
  isHost,
  useMultiplayerState,
  usePlayersList,
  getState,
} from "playroomkit";
import React from "react";

const GameEngineContext = React.createContext();

export const GameEngineProvider = ({ children }) => {
  const [phase, setPhase] = useMultiplayerState("phase", "lobby");
  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id));

  const gameSetup = (incognitoPlayers, mrBlancoPlayers) => {
    if (isHost()) {
      players.forEach((player, index) => {
        player.setState("word", "", true);
      });

      setPhase("mindmap");
    }
  };

  const gameState = {
    players,
    phase,
  };

  return (
    <GameEngineContext.Provider
      value={{
        ...gameState,
      }}
    >
      {children}
    </GameEngineContext.Provider>
  );
};

export const useGameEngine = () => {
  const context = React.useContext(GameEngineContext);
  if (context === undefined) {
    throw new Error("useGameEngine must be used within a GameEngineProvider");
  }
  return context;
};
