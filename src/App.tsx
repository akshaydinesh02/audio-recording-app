import "./App.css";
import Details from "./components/Details";
import Recorder from "./components/Recorder";

// TODO: Add web speech API for speech recognition

function App() {
  return (
    <div className="relative">
      <div className="text-header bg-neutral-900 text-center py-3 sticky top-0 w-full">
        <p>Simple Voice Recorder - test</p>
      </div>
      <Recorder />
      <Details />
      <div className="text-header bg-neutral-900 text-center py-3 sticky -bottom-0 z-10 w-full">
        <p>Footer</p>
      </div>
    </div>
  );
}

export default App;
