import {
  isHost,
  useMultiplayerState,
  usePlayersList,
  getState,
} from "playroomkit";
import React from "react";

const GameEngineContext = React.createContext();

export const GameEngineProvider = ({ children }) => {
  const [phase, setPhase] = useMultiplayerState("phase", "lobby");
  const [wordList, setWordList] = useMultiplayerState("wordList", []);
  const [questions, setQuestions] = useMultiplayerState("questions", [
    {
      index: 0,
      question:
        "Quel pourcentage de jeunes de moins de 13 ans possèdent un compte sur un réseau social, bien que cela soit interdit par la plupart des plateformes ?",
      options: ["45%", "50%", "63%", "75%"],
      answer: "63%",
      explanation:
        "Malgré les règles de nombreuses plateformes interdisant l’inscription des moins de 13 ans, environ 63% des jeunes de cette tranche d’âge possèdent un compte. Cela pose des risques accrus de surexposition et de cyberharcèlement pour les plus jeunes.",
    },
    {
      index: 1,
      question:
        "Combien de temps, en moyenne, les jeunes de 16 à 25 ans passent-ils chaque jour sur les réseaux sociaux ?",
      options: [
        "1 à 2 heures",
        "2 à 3 heures",
        "3 à 5 heures",
        "Plus de 6 heures",
      ],
      answer: "3 à 5 heures",
      explanation:
        "Les études montrent que les jeunes passent en moyenne 3 à 5 heures par jour sur les réseaux sociaux. Cette durée d’utilisation intense augmente les risques de dépendance, de perte de productivité, et d’exposition à des contenus potentiellement nuisibles.",
    },
    {
      index: 2,
      question:
        "Quel pourcentage de jeunes a déjà été victime de harcèlement sur les réseaux sociaux ?",
      options: ["1/10", "1/5", "1/4", "1/2"],
      answer: "1/5",
      explanation:
        "Environ 1 jeune sur 5 déclare avoir été victime de harcèlement en ligne. Les réseaux sociaux, en raison de leur accessibilité et de leur anonymat relatif, peuvent devenir des plateformes propices à la cyberintimidation.",
    },
    {
      index: 3,
      question:
        "Quel est le risque le plus courant lié au partage excessif d’informations personnelles sur les réseaux sociaux ?",
      options: [
        "Perte de contacts",
        "Piratage de compte",
        "Usurpation d'identité",
        "Perte d'abonnés",
      ],
      answer: "Usurpation d'identité",
      explanation:
        "L’usurpation d’identité est un risque majeur lié à la divulgation d’informations personnelles en ligne. Les cybercriminels peuvent utiliser ces données pour accéder à des comptes, voler des informations sensibles ou mener des escroqueries.",
    },
    {
      index: 4,
      question:
        "Parmi ces comportements, lequel contribue le plus à la propagation de fausses informations sur les réseaux sociaux ?",
      options: [
        "Partager des articles sans les lire",
        "Suivre trop de comptes",
        "Aimer des publications",
        "Poster des photos de vacances",
      ],
      answer: "Partager des articles sans les lire",
      explanation:
        "Partager des articles sans les lire ou vérifier leur source est une des principales causes de propagation de fausses informations en ligne. Une vérification des sources et des faits avant tout partage est cruciale pour contrer ce phénomène.",
    },
    {
      index: 5,
      question:
        "Quel est le principal objectif des algorithmes des réseaux sociaux ?",
      options: [
        "Protéger la vie privée des utilisateurs",
        "Augmenter le temps passé sur la plateforme",
        "Promouvoir des contenus éducatifs",
        "Limiter la diffusion de contenus violents",
      ],
      answer: "Augmenter le temps passé sur la plateforme",
      explanation:
        "Les algorithmes des réseaux sociaux sont conçus pour maximiser l'engagement et le temps passé par les utilisateurs sur la plateforme, souvent en leur proposant des contenus susceptibles de susciter des réactions émotionnelles, qu’ils soient positifs ou négatifs.",
    },
    {
      index: 6,
      question:
        "Quel des éléments suivants constitue un signe de dépendance aux réseaux sociaux ?",
      options: [
        "Utilisation occasionnelle",
        "Difficulté à se concentrer sans vérifier son téléphone",
        "Poster une fois par semaine",
        "Utiliser les réseaux uniquement pour le travail",
      ],
      answer: "Difficulté à se concentrer sans vérifier son téléphone",
      explanation:
        "La difficulté à se concentrer sans vérifier son téléphone est un symptôme de dépendance aux réseaux sociaux. Ce comportement peut avoir des conséquences sur la santé mentale et sur la productivité des individus.",
    },
    {
      index: 7,
      question:
        "Quel est le principal danger des “challenges” populaires sur les réseaux sociaux ?",
      options: [
        "Ils augmentent le nombre d’abonnés",
        "Ils sont souvent source de mèmes",
        "Ils peuvent encourager des comportements à risque",
        "Ils créent une communauté soudée",
      ],
      answer: "Ils peuvent encourager des comportements à risque",
      explanation:
        "Certains challenges viraux encouragent les jeunes à adopter des comportements dangereux pour imiter d’autres utilisateurs ou attirer l’attention. Il est essentiel de promouvoir des pratiques responsables et de sensibiliser les utilisateurs à ces risques.",
    },
    {
      index: 8,
      question:
        "Pourquoi les faux profils sur les réseaux sociaux sont-ils si courants ?",
      options: [
        "Ils permettent de tester de nouvelles fonctionnalités",
        "Ils sont utilisés pour espionner des amis",
        "Ils servent à des fins de phishing et de manipulation",
        "Ils aident à obtenir plus de “likes”",
      ],
      answer: "Ils servent à des fins de phishing et de manipulation",
      explanation:
        "Les faux profils sont souvent créés pour des tentatives de phishing (hameçonnage) ou pour manipuler des opinions en ligne. Ces profils sont utilisés pour influencer des discussions, obtenir des informations sensibles ou diffuser de fausses informations.",
    },
    {
      index: 9,
      question:
        "Quel est le meilleur moyen de protéger ses données personnelles sur les réseaux sociaux ?",
      options: [
        "Ne pas utiliser de photo de profil",
        "Paramétrer ses comptes en mode privé et limiter le partage",
        "Se déconnecter après chaque utilisation",
        "Ne pas poster de messages privés",
      ],
      answer: "Paramétrer ses comptes en mode privé et limiter le partage",
      explanation:
        "Paramétrer ses comptes en mode privé et limiter le partage d’informations personnelles est le meilleur moyen de protéger ses données sur les réseaux sociaux. Cela réduit les risques d’usurpation d’identité et de cyberharcèlement.",
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useMultiplayerState(
    "currentQuestionIndex",
    0
  );
  const [showAnswer, setShowAnswer] = useMultiplayerState("showAnswer", false);

  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id));

  const gameSetup = () => {
    if (isHost()) {
      players.forEach((player) => {
        player.setState("word", "", true);
        player.setState("score", 0, true);
        player.setState("selectedAnswer", null, true);
      });

      setPhase("mindmap");
    }
  };

  const startQuiz = () => {
    if (isHost()) {
      setPhase("quiz");
    }
  };

  const nextQuestion = () => {
    if (isHost()) {
      setShowAnswer(false);

      const currentIndex = currentQuestionIndex + 1;
      if (currentIndex < questions.length) {
        setCurrentQuestionIndex(currentIndex);
      }

      players.forEach((player) => {
        player.setState("selectedAnswer", null, true);
      });
    }
  };

  const revealAnswer = () => {
    if (isHost()) {
      setShowAnswer(true);
      players.forEach((player) => {
        if (
          player.state.selectedAnswer === questions[currentQuestionIndex].answer
        ) {
          player.setState("score", (player.state.score || 0) + 1, true);
        }
      });
    }
  };

  const selectAnswer = (playerId, answer) => {
    const player = players.find((p) => p.id === playerId);
    if (player && !showAnswer) {
      player.setState("selectedAnswer", answer, true);
    }
  };

  const gameState = {
    players,
    wordList,
    setWordList,
    phase,
    questions,
    setQuestions,
    currentQuestionIndex,
    showAnswer,
    nextQuestion,
    revealAnswer,
    selectAnswer,
  };

  return (
    <GameEngineContext.Provider
      value={{
        ...gameState,
        gameSetup,
        startQuiz,
      }}
    >
      {children}
    </GameEngineContext.Provider>
  );
};

export const useGameEngine = () => {
  const context = React.useContext(GameEngineContext);
  if (context === undefined) {
    throw new Error("useGameEngine must be used within a GameEngineProvider");
  }
  return context;
};
