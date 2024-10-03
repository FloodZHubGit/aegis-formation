import { isHost, myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";
import { useState } from "react";

export const Vote = () => {
  const me = myPlayer();
  const { players, goToEliminationPhase } = useGameEngine();
  const [isWordVisible, setIsWordVisible] = useState(true);
  const [hasVoted, setHasVoted] = useState(me.getState("hasVoted") || false);
  const [votedFor, setVotedFor] = useState(me.getState("votedFor") || null);

  const toggleWordVisibility = () => {
    setIsWordVisible(!isWordVisible);
  };

  const handleVote = (playerId) => {
    if (!me.getState("alive")) {
      console.log("Dead players can't vote.");
      return;
    }
    if (!hasVoted) {
      me.setState("hasVoted", true, true);
      me.setState("votedFor", playerId, true);
      const votedPlayer = players.find((player) => player.id === playerId);
      votedPlayer.setState(
        "votes",
        (votedPlayer.getState("votes") || 0) + 1,
        true
      );
      setHasVoted(true);
      setVotedFor(playerId);

      // Check if all alive players have voted
      const allVoted = alivePlayers.every((player) =>
        player.getState("hasVoted")
      );
      if (allVoted) {
        goToEliminationPhase();
      }
    }
  };

  const alivePlayers = players.filter((player) => player.getState("alive"));
  const totalVotes = alivePlayers.reduce(
    (acc, player) => acc + (player.getState("hasVoted") ? 1 : 0),
    0
  );
  const votesNeeded = Math.ceil(alivePlayers.length);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-5 mb-6 w-full max-w-lg">
        <p className="text-2xl font-bold text-gray-800 mb-4">
          C'est l'heure de voter
        </p>
        <p className="text-lg font-medium text-gray-800">
          Ton mot est:{" "}
          <span className="text-green-600">
            {isWordVisible ? me.getState("word") : "****"}
          </span>
        </p>
        <button
          onClick={toggleWordVisibility}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isWordVisible ? "Cacher le mot" : "Afficher le mot"}
        </button>
      </div>

      <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
        Joueurs:
      </h3>
      <p className="text-lg font-medium text-white text-center mb-4">
        Votes: {totalVotes} / {votesNeeded}
      </p>
      <ul className="w-full max-w-lg bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[400px]">
        {players.map((player, index) => (
          <li
            key={index}
            className={`flex items-center py-3 border-b border-gray-200 hover:bg-gray-100 transition ${
              player.id === me.id ? "bg-yellow-100" : ""
            } ${!player.getState("alive") ? "text-gray-500" : ""}`}
          >
            <img
              src={player.state.profile.photo}
              alt={`${player.state.profile.name}'s avatar`}
              className="w-12 h-12 rounded-full ml-3 mr-3"
              style={{ borderColor: player.state.profile.color }}
            />
            <span className={`text-lg font-medium`}>
              {player.state.profile.name}{" "}
              {player.id === me.id ? "🌟 (toi)" : ""}
              {!player.getState("alive") && " 💀 (mort)"}
            </span>
            {!hasVoted &&
              player.id !== me.id &&
              me.getState("alive") &&
              player.getState("alive") && (
                <button
                  onClick={() => handleVote(player.id)}
                  className="ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-full transition"
                >
                  Voter
                </button>
              )}
            {hasVoted && votedFor === player.id && (
              <span className="ml-auto text-green-600 font-bold">Voté</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
