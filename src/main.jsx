import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GameEngineProvider } from "./hooks/useGameEngine";
import { insertCoin } from "playroomkit";

const avatars = [
  '/images/avatars/avatar_1.png',
  '/images/avatars/avatar_2.png',
  '/images/avatars/avatar_3.png',
  '/images/avatars/avatar_4.png',
  '/images/avatars/avatar_5.png',
  '/images/avatars/avatar_6.png',
  '/images/avatars/avatar_7.png',
  '/images/avatars/avatar_8.png',
  '/images/avatars/avatar_9.png',
  '/images/avatars/avatar_10.png',
  '/images/avatars/avatar_11.png',
  '/images/avatars/avatar_12.png',
  '/images/avatars/avatar_13.png',
  '/images/avatars/avatar_14.png',
];

insertCoin({
  // streamMode: true
  avatars
}).then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <GameEngineProvider>
        <App />
      </GameEngineProvider>
    </React.StrictMode>
  );
});
