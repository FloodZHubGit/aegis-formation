import {
  isHost,
  isStreamScreen,
  myPlayer,
  useMultiplayerState,
} from "playroomkit";
import { useState, useEffect } from "react";
import { useGameEngine } from "./hooks/useGameEngine";

function WaitingScreen() {
  return (
    <h1 className="text-2xl font-bold text-center mt-10">
      Waiting for the host to start the game...
    </h1>
  );
}

// Helper function to render a mind map with rotation and scaling based on frequency
function MindMap({ words }) {
  return (
    <div className="flex flex-wrap justify-center items-center">
      {Object.entries(words).map(([word, count], index) => {
        const size = 1 + count * 0.3; // Scale word size based on frequency
        const rotation = (index % 4) * 15 - 30; // Rotate words for visual interest
        return (
          <div
            key={index}
            style={{
              transform: `rotate(${rotation}deg) scale(${size})`,
            }}
            className="bg-blue-200 text-blue-900 p-2 m-2 rounded shadow-lg"
          >
            {word}
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [words, setWords] = useMultiplayerState("words", {});
  const [newWord, setNewWord] = useState("");
  const [wordSubmitted, setWordSubmitted] = useState(false);
  const me = myPlayer();
  const { players } = useGameEngine();
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Reset state when game starts
    if (gameStarted) {
      setWordSubmitted(false);
      setNewWord("");
    }
  }, [gameStarted]);

  const handleAddWord = () => {
    if (newWord.trim() && !wordSubmitted) {
      const word = newWord.trim().toLowerCase();
      setWords((prevWords) => {
        // Increment the count of the word or add it if it doesn't exist
        return {
          ...prevWords,
          [word]: (prevWords[word] || 0) + 1,
        };
      });
      setWordSubmitted(true);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (isStreamScreen()) {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Mind Map - Social Networks</h1>
        <MindMap words={words} /> {/* Render the mind map */}
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
          <div className="mb-4">
            {wordSubmitted ? (
              <p className="text-green-600">Thank you for your contribution!</p>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="border p-2 flex-grow"
                  placeholder="Enter a word about Social Networks"
                  disabled={wordSubmitted}
                />
                <button
                  onClick={handleAddWord}
                  className="bg-blue-500 text-white p-2 rounded"
                  disabled={wordSubmitted}
                >
                  Submit Word
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
}

export default App;
