import {
  isHost,
  isStreamScreen,
  myPlayer,
  useMultiplayerState,
} from "playroomkit";
import { useState } from "react";
import { useGameEngine } from "./hooks/useGameEngine";

function WaitingScreen() {
  return (
    <h1 className="text-2xl font-bold text-center mt-10">
      Waiting for the host to start the game...
    </h1>
  );
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
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Stream Screen</h1>
        <ul className="mb-4">
          {chatMessages.map((message, index) => (
            <li key={index} className="border-b py-2">
              {message}
            </li>
          ))}
        </ul>
        {gameStarted && (
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border p-2 flex-grow"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Send
            </button>
          </div>
        )}
        <button
          onClick={handleDeleteMessages}
          className="bg-red-500 text-white p-2 rounded"
        >
          Delete Messages
        </button>
      </div>
    );
  } else {
    if (!gameStarted) {
      if (isHost()) {
        return (
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Host Screen</h1>
            <button
              onClick={handleStartGame}
              className="bg-green-500 text-white p-2 rounded"
            >
              Start Game
            </button>
          </div>
        );
      } else {
        return <WaitingScreen />;
      }
    } else {
      return (
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">
            {isHost() ? "Host Screen" : "Player Screen"}
          </h1>
          <ul className="mb-4">
            {chatMessages.map((message, index) => (
              <li key={index} className="border-b py-2">
                {message}
              </li>
            ))}
          </ul>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border p-2 flex-grow"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      );
    }
  }
}

export default App;
