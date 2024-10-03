import {
  getState,
  isHost,
  onPlayerJoin,
  useMultiplayerState,
  usePlayersList,
} from "playroomkit";
import React, { useEffect } from "react";
import { randInt } from "three/src/math/MathUtils";

const GameEngineContext = React.createContext();

const CARDS_PER_PLAYER = 7;

export const GameEngineProviderOld = ({ children }) => {
  const [winnerIndex, setWinnerIndex] = useMultiplayerState(
    "winnerIndex",
    null
  );
  const [winner, setWinner] = useMultiplayerState("winner", false);
  const [turnOrder, setTurnOrder] = useMultiplayerState("turnOrder", 1);
  const [timer, setTimer] = useMultiplayerState("timer", 0);
  const [playerTurn, setPlayerTurn] = useMultiplayerState("playerTurn", 0);
  const [playerStart, setPlayerStart] = useMultiplayerState("playerStart", 0);
  const [deck, setDeck] = useMultiplayerState("deck", []);
  const [lastPlayedCard, setLastPlayedCard] = useMultiplayerState(
    "lastPlayedCard",
    null
  );
  const [selectNewColor, setSelectNewColor] = useMultiplayerState(
    "selectNewColor",
    false
  );

  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id));

  const gameState = {
    players,
    timer,
    playerTurn,
    playerStart,
    deck,
    lastPlayedCard,
    winner,
    winnerIndex,
    selectNewColor,
  };

  const playCard = (playerIndex, cardIndex) => {
    if (playerIndex !== playerTurn) {
      return;
    }
    const player = players[playerIndex];
    const cards = player.getState("cards") || [];
    const card = cards[cardIndex];
    if (
      card.type === "wild" ||
      card.type === lastPlayedCard.type ||
      card.value === lastPlayedCard.value
    ) {
      setLastPlayedCard(card, true);
      cards.splice(cardIndex, 1);
      player.setState("cards", cards, true);

      if (cards.length === 0) {
        player.setState("winner", true, true);
        setWinnerIndex(playerIndex, true);
        setWinner(true, true);
      }

      if (card.value === "picker") {
        const nextPlayer = players[(playerTurn + 1) % players.length];
        const cards = nextPlayer.getState("cards") || [];
        for (let i = 0; i < 2; i++) {
          if (deck.length > 0) {
            const randomIndex = Math.floor(Math.random() * deck.length);
            const randomCard = deck.splice(randomIndex, 1)[0];
            cards.push(randomCard);
          }
        }
        nextPlayer.setState("cards", cards, true);
        setDeck(deck, true);
      }

      if (card.value === "reverse") {
        setTurnOrder(-turnOrder, true);
      }

      if (card.value === "color_changer" || card.value === "pick_four") {
        setSelectNewColor(true, true);
        if (card.value === "pick_four") {
          const nextPlayer = players[(playerTurn + turnOrder) % players.length];
          const cards = nextPlayer.getState("cards") || [];
          for (let i = 0; i < 4; i++) {
            if (deck.length > 0) {
              const randomIndex = Math.floor(Math.random() * deck.length);
              const randomCard = deck.splice(randomIndex, 1)[0];
              cards.push(randomCard);
            }
          }
          nextPlayer.setState("cards", cards, true);
          setDeck(deck, true);
          setPlayerTurn((playerTurn + 2 * turnOrder) % players.length, true);
        }
      } else {
        if (card.value === "skip" || card.value === "picker") {
          if (turnOrder > 0) {
            setPlayerTurn((playerTurn + 2) % players.length, true);
          }
          if (turnOrder < 0) {
            setPlayerTurn(
              (playerTurn + players.length - 2) % players.length,
              true
            );
          }
        } else {
          if (turnOrder > 0) {
            setPlayerTurn((playerTurn + 1) % players.length, true);
          }
          if (turnOrder < 0) {
            setPlayerTurn(
              (playerTurn + players.length - 1) % players.length,
              true
            );
          }
        }
      }
    }
  };

  const selectColor = (color) => {
    setSelectNewColor(false, true);
    const lastCard = getState("lastPlayedCard");
    lastCard.type = color;
    lastCard.value = "color_changer";
    setLastPlayedCard(lastCard, true);
    if (turnOrder > 0) {
      setPlayerTurn((playerTurn + 1) % players.length, true);
    }
    if (turnOrder < 0) {
      setPlayerTurn((playerTurn + players.length - 1) % players.length, true);
    }
  };

  const drawCard = (playerIndex) => {
    const newDeck = [...getState("deck")];
    const player = players[playerIndex];
    const cards = player.getState("cards") || [];
    const randomIndex = randInt(0, newDeck.length - 1);
    cards.push(newDeck[randomIndex]);
    newDeck.splice(randomIndex, 1);
    player.setState("cards", cards, true);
    setDeck(newDeck, true);
  };

  const distributeCards = (cardsPerPlayer) => {
    const newDeck = [...getState("deck")];
    players.forEach((player) => {
      const cards = player.getState("cards") || [];
      for (let i = cards.length; i < cardsPerPlayer; i++) {
        const randomIndex = randInt(0, newDeck.length - 1);
        cards.push(newDeck[randomIndex]);
        newDeck.splice(randomIndex, 1);
      }
      player.setState("cards", cards, true);
    });
    setDeck(newDeck, true);

    const randomIndex = randInt(0, newDeck.length - 1);
    const randomCard = newDeck[randomIndex];
    newDeck.splice(randomIndex, 1);
    setLastPlayedCard(randomCard, true);
    setDeck(newDeck, true);
  };

  const startGame = () => {
    if (isHost()) {
      setPlayerStart(0);
      setPlayerTurn(0);
      setDeck(
        [
          // numbers
          ...new Array(1).fill(0).map(() => ({ type: "blue", value: 0 })),
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: 1 })),
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: 2 })),
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: 3 })),
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: 4 })),
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: 5 })),
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: 6 })),
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: 7 })),
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: 8 })),
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: 9 })),
          ...new Array(1).fill(0).map(() => ({ type: "red", value: 0 })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: 1 })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: 2 })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: 3 })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: 4 })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: 5 })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: 6 })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: 7 })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: 8 })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: 9 })),
          ...new Array(1).fill(0).map(() => ({ type: "yellow", value: 0 })),
          ...new Array(2).fill(0).map(() => ({ type: "yellow", value: 1 })),
          ...new Array(2).fill(0).map(() => ({ type: "yellow", value: 2 })),
          ...new Array(2).fill(0).map(() => ({ type: "yellow", value: 3 })),
          ...new Array(2).fill(0).map(() => ({ type: "yellow", value: 4 })),
          ...new Array(2).fill(0).map(() => ({ type: "yellow", value: 5 })),
          ...new Array(2).fill(0).map(() => ({ type: "yellow", value: 6 })),
          ...new Array(2).fill(0).map(() => ({ type: "yellow", value: 7 })),
          ...new Array(2).fill(0).map(() => ({ type: "yellow", value: 8 })),
          ...new Array(2).fill(0).map(() => ({ type: "yellow", value: 9 })),
          ...new Array(1).fill(0).map(() => ({ type: "green", value: 0 })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: 1 })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: 2 })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: 3 })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: 4 })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: 5 })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: 6 })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: 7 })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: 8 })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: 9 })),
          // pickers
          ...new Array(2)
            .fill(0)
            .map(() => ({ type: "blue", value: "picker" })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: "picker" })),
          ...new Array(2)
            .fill(0)
            .map(() => ({ type: "yellow", value: "picker" })),
          ...new Array(2)
            .fill(0)
            .map(() => ({ type: "green", value: "picker" })),
          // reverses
          ...new Array(2)
            .fill(0)
            .map(() => ({ type: "blue", value: "reverse" })),
          ...new Array(2)
            .fill(0)
            .map(() => ({ type: "red", value: "reverse" })),
          ...new Array(2)
            .fill(0)
            .map(() => ({ type: "yellow", value: "reverse" })),
          ...new Array(2)
            .fill(0)
            .map(() => ({ type: "green", value: "reverse" })),
          // skips
          ...new Array(2).fill(0).map(() => ({ type: "blue", value: "skip" })),
          ...new Array(2).fill(0).map(() => ({ type: "red", value: "skip" })),
          ...new Array(2)
            .fill(0)
            .map(() => ({ type: "yellow", value: "skip" })),
          ...new Array(2).fill(0).map(() => ({ type: "green", value: "skip" })),
          // wilds
          ...new Array(4)
            .fill(0)
            .map(() => ({ type: "wild", value: "pick_four" })),
          ...new Array(4)
            .fill(0)
            .map(() => ({ type: "wild", value: "color_changer" })),
        ],
        true
      );
      players.forEach((player) => {
        player.setState("cards", [], true);
        player.setState("winner", false, true);
      });
      distributeCards(CARDS_PER_PLAYER);
    }
  };

  useEffect(() => {
    startGame();
    onPlayerJoin(startGame);
  }, []);

  return (
    <GameEngineContext.Provider
      value={{ ...gameState, drawCard, playCard, selectColor }}
    >
      {children}
    </GameEngineContext.Provider>
  );
};

export const useGameEngineOld = () => {
  const context = React.useContext(GameEngineContext);
  if (context === undefined) {
    throw new Error("useGameEngine must be used within a GameEngineProvider");
  }
  return context;
};
