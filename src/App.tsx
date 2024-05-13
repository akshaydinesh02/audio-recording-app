import "./App.css";
import Details from "./components/Details";
import Recorder from "./components/Recorder";

// TODO: Add web speech API for speech recognition

function App() {
  return (
    <div>
      <Recorder />
      <Details />
    </div>
  );
}

export default App;
