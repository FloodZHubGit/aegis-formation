import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { ARButton, XR } from "@react-three/xr";

function App() {
  return (
    <>
      <ARButton />
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 30 }}>
        <XR>
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </XR>
      </Canvas>
      <UI />
    </>
  );
}

export default App;
