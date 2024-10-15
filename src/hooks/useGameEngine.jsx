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
  const [wordList, setWordList] = useMultiplayerState("wordList", []);
  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id));

  const gameSetup = () => {
    if (isHost()) {
      players.forEach((player) => {
        player.setState("word", "", true);
      });

      setPhase("mindmap");
    }
  };

  const gameState = {
    players,
    wordList,
    setWordList,
    phase,
  };

  return (
    <GameEngineContext.Provider
      value={{
        ...gameState,
        gameSetup,
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
