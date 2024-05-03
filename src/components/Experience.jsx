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

  return (
    <>
      <OrbitControls />

      <Interactive
        onSelect={(event) => {
          event.stopPropagation();
          if (playerTurn === myIndex) {
            drawCard(myIndex);
          }
        }}
      >
        <mesh position={[-3, -3, 0]} scale={0.25}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Interactive>

      <group rotation={[0, Math.PI, 0]} scale={0.25} position={[-3, 0, 0]}>
        <Center>
          {cards.map((card, index) => (
            <Interactive>
              <Card
                key={index}
                type={`${card.type}_${card.value}`}
                position={[(index - cards.length / 2) * 2, 0, 0]}
                onClick={(event) => {
                  event.stopPropagation();
                  if (playerTurn === myIndex) {
                    playCard(myIndex, index);
                  }
                }}
              />
            </Interactive>
          ))}
        </Center>
      </group>

      {lastPlayedCard && (
        <Card
          type={`${lastPlayedCard.type}_${lastPlayedCard.value}`}
          position={[-3, 3, 0]}
          rotation={[0, Math.PI, 0]}
          scale={0.25}
        />
      )}

      <Environment preset="sunset" />
    </>
  );
};
