import React, { useEffect, useState } from "react";
import { useGameEngine } from "../hooks/useGameEngine";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Brain, Award, Volume2, VolumeX } from "lucide-react";

const useSpeech = () => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  const speak = (text) => {
    if (!supported) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.9;

    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return { speak, stop, speaking, supported };
};

export const StreamScreen = () => {
  const {
    players,
    wordList,
    phase,
    questions,
    currentQuestionIndex,
    showAnswer,
  } = useGameEngine();
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak, stop, speaking, supported } = useSpeech();
  const [lastSpokenWord, setLastSpokenWord] = useState("");
  const [quizIntroSpoken, setQuizIntroSpoken] = useState(false);

  useEffect(() => {
    if (phase === "quiz" && showAnswer) {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [phase, showAnswer]);

  useEffect(() => {
    // Speak phase titles
    if (phase === "lobby") {
      speak("Bienvenue sur la formation de Aegis !");
    } else if (phase === "mindmap") {
      speak("Défi de carte mentale");
    } else if (phase === "quiz" && !quizIntroSpoken) {
      speak("C'est l'heure du quiz !");
      setQuizIntroSpoken(true);
    }

    // Speak questions and answers
    if (phase === "quiz") {
      if (!showAnswer) {
        speak(questions[currentQuestionIndex].question);
      } else {
        speak(
          `La bonne réponse est ${questions[currentQuestionIndex].answer}. ${questions[currentQuestionIndex].explanation}`
        );
      }
    }

    return () => stop();
  }, [phase, currentQuestionIndex, showAnswer, questions, quizIntroSpoken]);

  useEffect(() => {
    // Speak new words added to the mindmap
    if (phase === "mindmap" && wordList.length > 0) {
      const latestWord = wordList[wordList.length - 1];
      if (latestWord !== lastSpokenWord) {
        speak(latestWord);
        setLastSpokenWord(latestWord);
      }
    }
  }, [phase, wordList, lastSpokenWord]);

  const toggleSpeech = () => {
    if (speaking) {
      stop();
    } else {
      // Repeat the last spoken text
      if (phase === "quiz") {
        if (!showAnswer) {
          speak(questions[currentQuestionIndex].question);
        } else {
          speak(
            `La bonne réponse est ${questions[currentQuestionIndex].answer}. ${questions[currentQuestionIndex].explanation}`
          );
        }
      } else if (phase === "mindmap" && wordList.length > 0) {
        speak(wordList[wordList.length - 1]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white p-8">
      {supported && (
        <button
          onClick={toggleSpeech}
          className="fixed top-4 right-4 z-10 p-2 bg-white bg-opacity-20 backdrop-blur-lg rounded-full shadow-lg"
        >
          {speaking ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>
      )}
      <AnimatePresence>
        {phase === "lobby" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-extrabold text-center mb-8">
              Bienvenue sur la formation de Aegis !
              <Sparkles className="inline-block ml-2 text-yellow-300" />
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg"
                >
                  <img
                    className="w-20 h-20 rounded-full mb-3 border-4 border-white"
                    src={player.state.profile.photo}
                    alt={`${player.state.profile.name}'s avatar`}
                  />
                  <span className="text-lg font-semibold text-center">
                    {player.state.profile.name}
                  </span>
                </motion.div>
              ))}
            </div>
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
              Défi de carte mentale
              <Brain className="inline-block ml-2 text-blue-300" />
            </h1>
            <ul className="space-y-4 max-w-2xl mx-auto">
              {wordList.map((word, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg"
                >
                  <span className="flex-1 text-xl font-medium">{word}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-extrabold text-center mb-8">
              C'est l'heure du quiz !
              <Award className="inline-block ml-2 text-yellow-300" />
            </h1>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="p-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4">
                {questions[currentQuestionIndex].question}
              </h2>
              {!showAnswer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {questions[currentQuestionIndex].options.map(
                    (option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 bg-white bg-opacity-30 rounded-lg cursor-pointer transition-colors hover:bg-opacity-40"
                      >
                        {option}
                      </motion.div>
                    )
                  )}
                </motion.div>
              )}
              {showAnswer && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xl font-semibold text-green-300 mb-2">
                    Bonne réponse: {questions[currentQuestionIndex].answer}
                  </p>
                  <p className="text-lg mt-2">
                    Explication: {questions[currentQuestionIndex].explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          <canvas id="confetti-canvas" />
        </div>
      )}
    </div>
  );
};
