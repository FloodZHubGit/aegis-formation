import { isHost, isStreamScreen } from "playroomkit";
import { StreamScreen } from "./components/StreamScreen";
import { HostScreen } from "./components/HostScreen";
import { ViewerScreen } from "./components/ViewerScreen";

function App() {
  if (isStreamScreen()) {
    return <StreamScreen />;
  }
  if (isHost()) {
    return <HostScreen />;
  } else {
    return <ViewerScreen />;
  }
}

export default App;
