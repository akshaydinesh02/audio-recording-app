import { useEffect, useRef, useState } from "react";
import "./App.css";
import WaveSurferComponent from "./components/WaveSurferComponent";
// import WaveComponent from "./components/WaveComponent";
import { continuousVisualizer, VisualizerFunctions } from "sound-visualizer";

const getMediaStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
  // }
};

// TODO: Add web speech API for speech recognition

function App() {
  const [status, setStatus] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioType, setAudioType] = useState<string | null>(null);
  const [audioProps, setAudioProps] = useState<any | null>(null);

  const [recorderUrl, setRecorderUrl] = useState("");
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[] | null>([]);

  const waveFunctionRef = useRef<VisualizerFunctions | null>(null);
  const recordingCanvasRef = useRef(null);
  // const currentRecordingCanvasRef = useRef(null);
  // const continuousRecordingCanvasRef = useRef(null);

  const startCallback = (e: Event) => {
    console.log("succ start", e);
  };

  const pauseCallback = (e: Event) => {
    console.log("succ pause", e);
  };

  const stopCallback = (e: Blob) => {
    setAudioSrc(window.URL.createObjectURL(e));
    console.log("succ stop", e);
  };

  const onRecordCallback = (e: Event) => {
    console.log("recording", e);
  };

  const errorCallback = (err: Error) => {
    console.log("error", err);
  };

  const startRecording = async () => {
    try {
      const stream = await getMediaStream();
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      // Store audio buffers into media chunks array
      mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          mediaChunks.current?.push(e.data);
        }
      };

      // Store last blob when recording stops
      mediaRecorder.current.onstop = () => {
        if (!mediaChunks.current?.length) return;
        const recordedBlob = new Blob(mediaChunks.current, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(recordedBlob);
        setRecorderUrl(url);
        mediaChunks.current = [];
      };

      mediaRecorder.current.start();

      if (recordingCanvasRef.current) {
        const waveFunction = continuousVisualizer(
          mediaStream.current,
          recordingCanvasRef.current,
          {
            lineWidth: "thin",
            strokeColor: "#4F4A85",
          }
        );
        waveFunctionRef.current = waveFunction;
        waveFunctionRef.current.start();
      }
    } catch (error: unknown) {
      console.error("Error while starting to record", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }

    if (recordingCanvasRef.current && waveFunctionRef.current) {
      waveFunctionRef.current.reset();
    }
  };

  useEffect(() => {
    const audioPropsInternal = {
      audioType,
      status,
      audioSrc,
      timeslice: 1000,
      startCallback,
      pauseCallback,
      stopCallback,
      onRecordCallback,
      errorCallback,
    };

    setAudioProps(audioPropsInternal);
  }, [status, audioSrc, audioType]);

  return (
    <div className="w-full p-24">
      <canvas className="border w-full" ref={recordingCanvasRef} />
      <WaveSurferComponent audioUrl={recorderUrl} />
      <div className="w-[50%] flex gap-4 justify-center items-center">
        {/* <audio src={recorderUrl} controls /> */}
        <button onClick={startRecording}>Start</button>
        <button onClick={stopRecording}>Stop</button>
        {/* <button>Pause</button>
      <button>Download</button> */}
      </div>
    </div>
  );
}

export default App;
