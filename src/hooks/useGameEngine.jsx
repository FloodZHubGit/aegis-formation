import { isHost, useMultiplayerState, usePlayersList, getState } from "playroomkit"
import React from "react";
import { wordList } from "../data/wordList";

const GameEngineContext = React.createContext();

export const GameEngineProvider = ({ children }) => {
  const [winnersIndex, setWinnersIndex] = useMultiplayerState("winnersIndex", []);
  const [winner, setWinner] = useMultiplayerState("winner", false);

  const [phase, setPhase] = useMultiplayerState("phase", "lobby");
  

  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id));

  const gameState = {
    players,
    winnersIndex,
    winner,
    phase,
  };

  const gameSetup = (incognitoPlayers, mrBlancoPlayers) => {
    if (isHost()) {
      if (players.length > 2) {
        setPhase("game");
        // assign roles to the players, if a player is not mr blanco or incognito, they are a civilian
        let roles = [];
        for (let i = 0; i < incognitoPlayers; i++) {
          roles.push("incognito");
        }
        for (let i = 0; i < mrBlancoPlayers; i++) {
          roles.push("mr blanco");
        }
        for (let i = 0; i < players.length - incognitoPlayers - mrBlancoPlayers; i++) {
          roles.push("civilian");
        }
        // shuffle the roles array
        roles.sort(() => Math.random() - 0.5);
        // assign the roles to the players
        players.forEach((player, index) => {
          player.setState("role", roles[index], true);
        });
        // print all players and their roles
        players.forEach((player) => {
          console.log(player.state.profile.name, player.getState("role"));
        });
        // get a random word and similar word from the wordList (src/data/wordList.js)
        const randomIndex = Math.floor(Math.random() * wordList.length);
        const word = wordList[randomIndex].word;
        const similar = wordList[randomIndex].similar;
        // assign the word to the player, if civilian, assign the word, if incognito, assign the similar word, if mr blanco, dont assign a word
        players.forEach((player) => {
          if (player.getState("role") === "civilian") {
            player.setState("word", word, true);
          } else if (player.getState("role") === "incognito") {
            player.setState("word", similar, true);
          } else {
            player.setState("word", "", true);
          }
        });

        // console log all player words
        players.forEach((player) => {
          console.log(player.state.profile.name, player.getState("word"));
        });
      }
    } 
  }

  const startGame = (incognitoPlayers, mrBlancoPlayers) => () => {
    gameSetup(incognitoPlayers, mrBlancoPlayers);
  };

  return (
    <GameEngineContext.Provider
      value={{ ...gameState, startGame }}
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