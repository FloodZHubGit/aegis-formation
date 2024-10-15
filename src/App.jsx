import {
  isHost,
  isStreamScreen,
  myPlayer,
  useMultiplayerState,
} from "playroomkit";
import { useState } from "react";

function App() {
  const [chatMessages, setChatMessages] = useMultiplayerState(
    "chatMessages",
    []
  );
  const [newMessage, setNewMessage] = useState("");
  const me = myPlayer();
  console.log(me);

  const handleSendMessage = () => {
    const messageWithName = `${me.state.profile.name}: ${newMessage}`;
    setChatMessages([...chatMessages, messageWithName]);
    setNewMessage("");
  };

  const handleDeleteMessages = () => {
    setChatMessages([]);
  };

  if (isStreamScreen()) {
    return (
      <div>
        <h1>{isHost() ? "Host Stream Screen" : "Guest Stream Screen"}</h1>
        <ul>
          {chatMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <button onClick={handleDeleteMessages}>Delete Messages</button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Game Screen</h1>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    );
  }
}

export default App;
