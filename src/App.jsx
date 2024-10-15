import {
  isHost,
  isStreamScreen,
  myPlayer,
  useMultiplayerState,
  usePlayers,
} from "playroomkit";
import { useState } from "react";
import { useGameEngine } from "./hooks/useGameEngine";

function WaitingScreen() {
  return <h1>Waiting for the host to start the game...</h1>;
}

function App() {
  const [chatMessages, setChatMessages] = useMultiplayerState(
    "chatMessages",
    []
  );
  const [newMessage, setNewMessage] = useState("");
  const me = myPlayer();
  const { players } = useGameEngine();
  const [gameStarted, setGameStarted] = useState(false);

  console.log(me);

  const handleSendMessage = () => {
    const messageWithName = `${me.state.profile.name}: ${newMessage}`;
    setChatMessages([...chatMessages, messageWithName]);
    setNewMessage("");
  };

  const handleDeleteMessages = () => {
    setChatMessages([]);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (isStreamScreen()) {
    if (!gameStarted) {
      return <WaitingScreen />;
    }
    return (
      <div>
        <h1>{isHost() ? "Host Stream Screen" : "Guest Stream Screen"}</h1>
        <ul>
          {chatMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <button onClick={handleDeleteMessages}>Delete Messages</button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    );
  } else {
    if (!gameStarted) {
      if (isHost()) {
        return (
          <div>
            <h1>Host Waiting Screen</h1>
            <ul>
              {players.map((player) => (
                <li key={player.id}>{player.state.profile.name}</li>
              ))}
            </ul>
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        );
      } else {
        return <WaitingScreen />;
      }
    }
    return (
      <div>
        <h1>Game Screen</h1>
        <ul>
          {chatMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    );
  }
}

export default App;
