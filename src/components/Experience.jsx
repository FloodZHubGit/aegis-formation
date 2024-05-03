import { useState, useEffect } from "react";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import { Card } from "./Card";
import { myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";
import { Interactive } from "@react-three/xr";

export const Experience = () => {
  const me = myPlayer();
  const { players, lastPlayedCard, drawCard, playCard, playerTurn } =
    useGameEngine();
  const myIndex = players.findIndex((player) => player.id === me.id);
  const cards = me.getState("cards") || [];

  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (hasPlayed) {
      const timer = setTimeout(() => {
        setHasPlayed(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasPlayed]);

  return (
    <>
      <Interactive
        onSelect={() => {
          if (playerTurn === myIndex && !hasPlayed) {
            drawCard(myIndex);
            setHasPlayed(true);
          }
        }}
      >
        <mesh position={[0, -1, -2]} scale={0.1}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Interactive>

      <group rotation={[0, Math.PI, 0]} scale={0.1} position={[0, 0, -2]}>
        <Center>
          {cards.map((card, index) => (
            <Interactive
              key={index}
              onSelect={() => {
                if (playerTurn === myIndex && !hasPlayed) {
                  playCard(myIndex, index);
                  setHasPlayed(true);
                }
              }}
            >
              <Card
                type={`${card.type}_${card.value}`}
                position={[(index - cards.length / 2) * 2, 0, 0]}
              />
            </Interactive>
          ))}
        </Center>
      </group>

      {lastPlayedCard && (
        <Card
          type={`${lastPlayedCard.type}_${lastPlayedCard.value}`}
          position={[0, 1, -2]}
          rotation={[0, Math.PI, 0]}
          scale={0.1}
        />
      )}

      <Environment preset="sunset" />
    </>
  );
};
