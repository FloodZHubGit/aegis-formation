import {
  isHost,
  isStreamScreen,
  myPlayer,
  useMultiplayerState,
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
    return (
      <div>
        <h1>Stream Screen</h1>
      </div>
    );
  } else {
    if (!gameStarted) {
      if (isHost()) {
        return (
          <div>
            <h1>Host Screen</h1>
          </div>
        );
      } else {
        return (
          <div>
            <h1>Player screen</h1>
          </div>
        );
      }
    }
  }
}

export default App;
