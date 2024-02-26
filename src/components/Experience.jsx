import { Center, Environment, OrbitControls } from "@react-three/drei";
import { Card } from "./Card";
import { myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";

export const Experience = () => {
  const me = myPlayer();
  const { players, lastPlayedCard, drawCard, playCard, playerTurn } =
    useGameEngine();
  const myIndex = players.findIndex((player) => player.id === me.id);
  const cards = me.getState("cards") || [];

  return (
    <>
      <OrbitControls />

      <mesh
        onClick={(event) => {
          event.stopPropagation();
          if (playerTurn === myIndex) {
            drawCard(myIndex);
          }
        }}
        position={[0, -3, 0]}
      >
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      <group rotation={[0, Math.PI, 0]}>
        <Center>
          {cards.map((card, index) => (
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
          ))}
        </Center>
      </group>

      {lastPlayedCard && (
        <Card
          type={`${lastPlayedCard.type}_${lastPlayedCard.value}`}
          position={[0, 3, 0]}
          rotation={[0, Math.PI, 0]}
        />
      )}

      <Environment preset="sunset" />
    </>
  );
};
