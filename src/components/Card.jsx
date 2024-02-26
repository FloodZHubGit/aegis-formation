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
useTexture.preload("cards/blue_0.png");
useTexture.preload("cards/blue_1.png");
useTexture.preload("cards/blue_2.png");
useTexture.preload("cards/blue_3.png");
useTexture.preload("cards/blue_4.png");
useTexture.preload("cards/blue_5.png");
useTexture.preload("cards/blue_6.png");
useTexture.preload("cards/blue_7.png");
useTexture.preload("cards/blue_8.png");
useTexture.preload("cards/blue_9.png");
useTexture.preload("cards/blue_picker.png");
useTexture.preload("cards/blue_reverse.png");
useTexture.preload("cards/blue_skip.png");
useTexture.preload("cards/green_0.png");
useTexture.preload("cards/green_1.png");
useTexture.preload("cards/green_2.png");
useTexture.preload("cards/green_3.png");
useTexture.preload("cards/green_4.png");
useTexture.preload("cards/green_5.png");
useTexture.preload("cards/green_6.png");
useTexture.preload("cards/green_7.png");
useTexture.preload("cards/green_8.png");
useTexture.preload("cards/green_9.png");
useTexture.preload("cards/green_picker.png");
useTexture.preload("cards/green_reverse.png");
useTexture.preload("cards/green_skip.png");
useTexture.preload("cards/red_0.png");
useTexture.preload("cards/red_1.png");
useTexture.preload("cards/red_2.png");
useTexture.preload("cards/red_3.png");
useTexture.preload("cards/red_4.png");
useTexture.preload("cards/red_5.png");
useTexture.preload("cards/red_6.png");
useTexture.preload("cards/red_7.png");
useTexture.preload("cards/red_8.png");
useTexture.preload("cards/red_9.png");
useTexture.preload("cards/red_picker.png");
useTexture.preload("cards/red_reverse.png");
useTexture.preload("cards/red_skip.png");
useTexture.preload("cards/yellow_0.png");
useTexture.preload("cards/yellow_1.png");
useTexture.preload("cards/yellow_2.png");
useTexture.preload("cards/yellow_3.png");
useTexture.preload("cards/yellow_4.png");
useTexture.preload("cards/yellow_5.png");
useTexture.preload("cards/yellow_6.png");
useTexture.preload("cards/yellow_7.png");
useTexture.preload("cards/yellow_8.png");
useTexture.preload("cards/yellow_9.png");
useTexture.preload("cards/yellow_picker.png");
useTexture.preload("cards/yellow_reverse.png");
useTexture.preload("cards/yellow_skip.png");
useTexture.preload("cards/wild_color_changer.png");
useTexture.preload("cards/wild_pick_four.png");
