import React, { useState } from "react";
import { useGameEngine } from "../hooks/useGameEngine";
import { isHost, myPlayer } from "playroomkit";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Brain, Award, ChevronRight, Eye, Video } from "lucide-react";

export const HostScreen = () => {
  const {
    players,
    phase,
    currentQuestionIndex,
    questions,
    showAnswer,
    nextQuestion,
    revealAnswer,
    gameSetup,
    startQuiz,
  } = useGameEngine();
  const me = myPlayer();

  const handleSetupGame = () => {
    gameSetup();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white p-8">
      <AnimatePresence mode="wait">
        {phase === "lobby" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-extrabold text-center mb-8">
              Game Lobby
            </h1>
            {isHost() && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full max-w-md mx-auto flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                onClick={handleSetupGame}
              >
                Start Brainstorming
                <Brain className="ml-2 w-5 h-5" />
              </motion.button>
            )}
            <PlayerList players={players} me={me} showWord={false} />
          </motion.div>
        )}

        {phase === "mindmap" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-extrabold text-center mb-8">
              Mindmap Challenge
              <Brain className="inline-block ml-2 text-blue-300" />
            </h1>
            {isHost() && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full max-w-md mx-auto flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                onClick={startQuiz}
              >
                Start Quiz
                <Play className="ml-2 w-5 h-5" />
              </motion.button>
            )}
            <PlayerList players={players} me={me} showWord={true} />
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
            <div className="flex justify-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={showAnswer ? nextQuestion : revealAnswer}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                {showAnswer ? (
                  <>
                    Next Question
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  <>
                    Show Answer
                    <Eye className="ml-2 w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
            <PlayerList players={players} me={me} showScore={true} />
            <div className="text-center text-xl font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlayerList = ({
  players,
  me,
  showWord = false,
  showScore = false,
  showReportedComments = false,
}) => (
  <ul className="space-y-4 max-w-2xl mx-auto">
    {players.map(
      (player) =>
        player.id !== me.id && (
          <motion.li
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center p-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg"
          >
            <img
              className="w-12 h-12 rounded-full mr-4 border-2 border-white"
              src={player.state.profile.photo}
              alt={`${player.state.profile.name}'s avatar`}
            />
            <span className="flex-1 text-lg font-medium">
              {player.state.profile.name}
            </span>
            {showWord && (
              <span className="text-sm ml-4 bg-blue-500 px-2 py-1 rounded-full">
                Word: {player.state.word || "None"}
              </span>
            )}
            {showReportedComments && (
              <span className="text-sm ml-4 bg-yellow-500 px-2 py-1 rounded-full">
                Reported: {player.state.reportedComments || 0}
              </span>
            )}
          </motion.li>
        )
    )}
  </ul>
);
