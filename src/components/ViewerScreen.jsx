import React, { useState, useEffect } from "react";
import { useGameEngine } from "../hooks/useGameEngine";
import { myPlayer } from "playroomkit";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, Award, Brain } from "lucide-react";

export const ViewerScreen = () => {
  const {
    phase,
    questions,
    currentQuestionIndex,
    wordList,
    setWordList,
    selectAnswer,
    showAnswer,
  } = useGameEngine();
  const me = myPlayer();
  const [word, setWord] = useState(me.state.word || "");
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  const handleWordChange = (e) => {
    setWord(e.target.value);
  };

  const updateWord = async () => {
    if (me.state.word) return;
    try {
      await me.setState("word", word, true);
      setWordList([...wordList, word]);
    } catch (error) {
      console.error("Failed to set word:", error);
    }
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    selectAnswer(me.id, answer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white p-8">
      <AnimatePresence mode="wait">
        {phase === "lobby" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <Loader2 className="w-16 h-16 animate-spin mb-4" />
            <p className="text-2xl font-semibold text-center">
              En attente du début de la formation...
            </p>
          </motion.div>
        )}

        {phase === "mindmap" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center space-y-6"
          >
            <h1 className="text-4xl font-extrabold text-center mb-8">
              Mindmap Challenge
              <Brain className="inline-block ml-2 text-blue-300" />
            </h1>
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6 w-full max-w-md">
              <div className="flex flex-col items-center">
                <img
                  className="w-24 h-24 rounded-full mb-4 border-4 border-white"
                  src={me.state.profile.photo}
                  alt={`${me.state.profile.name}'s avatar`}
                />
                <span className="text-xl font-semibold text-center mb-6">
                  {me.state.profile.name}
                </span>
                <input
                  type="text"
                  value={word}
                  onChange={handleWordChange}
                  placeholder="Enter your word"
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-50 backdrop-blur-sm text-black placeholder-gray-500 mb-4"
                  disabled={!!me.state.word}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={updateWord}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!!me.state.word}
                >
                  Set Word
                  <Send className="ml-2 w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-extrabold text-center mb-8">
              Quiz Time!
              <Award className="inline-block ml-2 text-yellow-300" />
            </h1>
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">
                Ton score: {me.state.score || 0} / {questions.length}
              </h3>
              <h2 className="text-3xl font-bold mb-6">
                {questions[currentQuestionIndex].question}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => {
                    let buttonStyle = "bg-blue-500 hover:bg-blue-600";
                    if (showAnswer) {
                      if (option === questions[currentQuestionIndex].answer) {
                        buttonStyle = "bg-green-500";
                      } else if (option === selectedAnswer) {
                        buttonStyle = "bg-red-500";
                      } else {
                        buttonStyle = "bg-gray-400";
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAnswerClick(option)}
                        disabled={selectedAnswer !== null || showAnswer}
                        className={`p-4 rounded-lg text-white font-semibold text-lg transition-colors ${buttonStyle}`}
                      >
                        {option}
                      </motion.button>
                    );
                  }
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
