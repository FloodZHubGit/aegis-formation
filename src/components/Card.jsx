import React, { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

export function Card({ type = "blue_1", ...props }) {
  const { nodes, materials } = useGLTF("/models/uno_card.glb");
  const texture = useTexture(`cards/${type}.png`);
  const back = useTexture(`cards/card_back.png`);
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane001.geometry}
        material={materials.Back}
      />
      <mesh castShadow receiveShadow geometry={nodes.Plane001_1.geometry}>
        <meshStandardMaterial
          {...materials.Front}
          map={texture}
          color="white"
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane001_2.geometry}
        material={materials.Sides}
      />
    </group>
  );
}

useGLTF.preload("/models/uno_card.glb");
