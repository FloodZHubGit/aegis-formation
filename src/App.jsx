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

// Helper function to render a mind map (basic grid for simplicity)
function MindMap({ words }) {
  return (
    <div className="flex flex-wrap justify-center">
      {words.map((word, index) => (
        <div
          key={index}
          className="bg-blue-200 text-blue-900 p-2 m-2 rounded shadow-lg"
        >
          {word}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [chatMessages, setChatMessages] = useMultiplayerState(
    "chatMessages",
    []
  );
  const [words, setWords] = useMultiplayerState("words", []); // New multiplayer state for words
  const [newWord, setNewWord] = useState("");
  const me = myPlayer();
  const { players } = useGameEngine();
  const [gameStarted, setGameStarted] = useState(false);

  console.log(me);

  const handleAddWord = () => {
    if (newWord.trim()) {
      setWords([...words, newWord.trim()]);
      setNewWord("");
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleDeleteWords = () => {
    setWords([]); // Clear the mind map
  };

  if (isStreamScreen()) {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Mind Map - Social Networks</h1>
        <MindMap words={words} /> {/* Render the mind map */}
        {gameStarted && (
          <div className="flex space-x-2 mb-4 mt-4">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="border p-2 flex-grow"
              placeholder="Enter a word about Social Networks"
            />
            <button
              onClick={handleAddWord}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add Word
            </button>
          </div>
        )}
        <button
          onClick={handleDeleteWords}
          className="bg-red-500 text-white p-2 rounded mt-4"
        >
          Clear Mind Map
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
          <div className="flex space-x-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="border p-2 flex-grow"
              placeholder="Enter a word about Social Networks"
            />
            <button
              onClick={handleAddWord}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Word
            </button>
          </div>
        </div>
      );
    }
  }
}

export default App;
