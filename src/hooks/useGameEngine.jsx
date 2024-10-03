import {
  isHost,
  useMultiplayerState,
  usePlayersList,
  getState,
} from "playroomkit";
import React from "react";
import { wordList } from "../data/wordList";

const GameEngineContext = React.createContext();

export const GameEngineProvider = ({ children }) => {
  const [winner, setWinner] = useMultiplayerState("winner", "");
  const [winners, setWinners] = useMultiplayerState("winnersIndex", []);
  const [playerToEliminate, setPlayerToEliminate] = useMultiplayerState(
    "playerToEliminate",
    ""
  );
  const [phase, setPhase] = useMultiplayerState("phase", "lobby");
  const [speakingOrder, setSpeakingOrder] = useMultiplayerState(
    "speakingOrder",
    []
  );

  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id));

  const gameState = {
    players,
    winners,
    winner,
    phase,
    speakingOrder,
    playerToEliminate,
  };

  const goToVotePhase = () => {
    setPhase("vote");
    players.forEach((player) => {
      player.setState("hasVoted", false, true);
      player.setState("votedFor", "", true);
      player.setState("votes", 0, true);
    });
  };

  const goToEliminationPhase = () => {
    // Find the players with the most votes
    let maxVotes = -1;
    let playersToEliminate = [];

    players.forEach((player) => {
      const votes = player.getState("votes");
      if (votes > maxVotes) {
        maxVotes = votes;
        playersToEliminate = [player];
      } else if (votes === maxVotes) {
        playersToEliminate.push(player);
      }
    });

    // Eliminate a player with the most votes
    if (playersToEliminate.length > 0) {
      const playerToEliminate =
        playersToEliminate.length === 1
          ? playersToEliminate[0]
          : playersToEliminate[
              Math.floor(Math.random() * playersToEliminate.length)
            ];

      playerToEliminate.setState("alive", false, true);
      setPlayerToEliminate(playerToEliminate.id);
    } else {
      setPlayerToEliminate("");
    }

    setPhase("elimination");
  };

  const checkGameEnd = () => {
    const alivePlayers = players.filter((player) => player.getState("alive"));
    const incognitosAlive = alivePlayers.filter(
      (player) => player.getState("role") === "incognito"
    ).length;
    const mrBlancoAlive = alivePlayers.filter(
      (player) => player.getState("role") === "mr blanco"
    ).length;
    const civiliansAlive = alivePlayers.filter(
      (player) => player.getState("role") === "civilian"
    ).length;

    if (incognitosAlive === 0 && mrBlancoAlive === 0) {
      setWinner("civilians");
      const winners = alivePlayers.map((player) => player);
      setWinners(winners);
      setPhase("fin");
    } else if (civiliansAlive === 1) {
      setWinner("incognitos");
      const winners = alivePlayers
        .filter((player) => player.getState("role") === "incognito")
        .map((player) => player);
      setWinners(winners);
      setPhase("fin");
    } else {
      // reset the votes
      players.forEach((player) => {
        player.setState("hasVoted", false, true);
        player.setState("votedFor", "", true);
        player.setState("votes", 0, true);
      });

      // set a new speaking order (without the eliminated player)
      const order = players
        .filter((player) => player.getState("alive"))
        .map((player) => player);
      order.sort(() => Math.random() - 0.5);
      setSpeakingOrder(order);

      setPhase("discussion");
    }
  };

  const goToLobby = () => {
    setPhase("lobby");
  };

  const gameSetup = (incognitoPlayers, mrBlancoPlayers) => {
    if (isHost()) {
      if (players.length > 2) {
        // assign roles to the players, if a player is not mr blanco or incognito, they are a civilian
        let roles = [];
        for (let i = 0; i < incognitoPlayers; i++) {
          roles.push("incognito");
        }
        for (let i = 0; i < mrBlancoPlayers; i++) {
          roles.push("mr blanco");
        }
        for (
          let i = 0;
          i < players.length - incognitoPlayers - mrBlancoPlayers;
          i++
        ) {
          roles.push("civilian");
        }
        // shuffle the roles array
        roles.sort(() => Math.random() - 0.5);
        // assign the roles to the players
        players.forEach((player, index) => {
          player.setState("role", roles[index], true);
          player.setState("word", "", true);
          player.setState("alive", true, true);
          player.setState("hasVoted", false, true);
          player.setState("votedFor", "", true);
          player.setState("votes", 0, true);
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

        players.forEach((player) => {
          console.log(player.state.profile.name, player.getState("word"));
        });

        // Generate a random speaking order
        const order = players.map((player) => player);
        order.sort(() => Math.random() - 0.5);
        setSpeakingOrder(order);

        setPhase("discussion");
      }
    }
  };

  const startGame = (incognitoPlayers, mrBlancoPlayers) => () => {
    gameSetup(incognitoPlayers, mrBlancoPlayers);
  };

  return (
    <GameEngineContext.Provider
      value={{
        ...gameState,
        startGame,
        goToVotePhase,
        goToEliminationPhase,
        checkGameEnd,
        goToLobby,
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
