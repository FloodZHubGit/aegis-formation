import React, { useState } from "react";
import { useGameEngine } from "../hooks/useGameEngine";
import { myPlayer } from "playroomkit";

export const ViewerScreen = () => {
  const { players, phase, wordList, setWordList } = useGameEngine();
  const me = myPlayer();
  const [word, setWord] = useState(me.state.word || "");

  const handleWordChange = (e) => {
    setWord(e.target.value);
  };

  const updateWord = async () => {
    if (me.state.word) {
      return;
    }
    try {
      await me.setState("word", word, true);
      setWordList([...wordList, word]);
    } catch (error) {
      console.error("Failed to set word:", error);
    }
  };

  return (
    <>
      {phase === "lobby" && (
        <div className="p-4">
          <p>Waiting for the host to start the game...</p>
        </div>
      )}
      <div className="p-4">
        <div className="flex flex-col items-center p-2 bg-white shadow rounded-lg">
          <img
            className="w-16 h-16 rounded-full mb-2"
            src={me.state.profile.photo}
            alt={`${me.state.profile.name}'s avatar`}
          />
          <span className="text-sm font-medium text-center">
            {me.state.profile.name}
          </span>
          {phase === "mindmap" && (
            <div className="mt-4">
              <input
                type="text"
                value={word}
                onChange={handleWordChange}
                placeholder="Enter your word"
                className="border rounded p-2 mb-2"
              />
              <button
                onClick={updateWord}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Set Word
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
