import { useEffect, useRef, useState } from "react";
import "./App.css";
// import WaveSurferComponent from "./components/WaveSurferComponent";
// import WaveComponent from "./components/WaveComponent";
import { continuousVisualizer, VisualizerFunctions } from "sound-visualizer";
import WaveSurfer from "wavesurfer.js";
import Details from "./components/Details";

const getMediaStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
  // }
};

// TODO: Add web speech API for speech recognition

function App() {
  const [recording, setRecording] = useState<boolean>(false);

  const [recorderUrl, setRecorderUrl] = useState("");
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[] | null>([]);

  const waveFunctionRef = useRef<VisualizerFunctions | null>(null);
  const recordingCanvasRef = useRef(null);
  const mediaElRef = useRef<HTMLMediaElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

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
          type: "audio/mpeg",
        });

        const url = URL.createObjectURL(recordedBlob);
        setRecorderUrl(url);
        mediaChunks.current = [];
      };

      mediaRecorder.current.start();
      setRecording(true);

      if (recordingCanvasRef.current) {
        const waveFunction = continuousVisualizer(
          mediaStream.current,
          recordingCanvasRef.current,
          {
            lineWidth: 1,
            strokeColor: "#8c8c8c",
            slices: 150,
          }
        );
        waveFunctionRef.current = waveFunction;
        waveFunctionRef.current.start();
      }
    } catch (error: unknown) {
      console.error("Error while starting to record", error);
      setRecording(false);
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

    setRecording(false);
  };

  const resetRecording = () => {
    stopRecording();
    setRecorderUrl("");

    if (waveSurferRef.current) {
      waveSurferRef.current.empty();
    }
  };

  // const downloadAudio = () => {
  //   const link = document.createElement("a");
  //   link.href = recorderUrl;
  //   link.download = "test-file-name";

  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  useEffect(() => {
    if (!recorderUrl || !mediaElRef.current) return;
    const wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#8c8c8c",
      progressColor: "#30fc03",
      url: recorderUrl,
      dragToSeek: true,
      autoCenter: true,
      media: mediaElRef.current,
      autoScroll: true,
      interact: true,
      normalize: true,
    });

    waveSurferRef.current = wavesurfer;
    waveSurferRef.current.on("timeupdate", () => {
      //
    });

    waveSurferRef.current.load(recorderUrl);

    return () => {
      wavesurfer.destroy();
      waveSurferRef.current?.unAll();
      waveSurferRef.current?.destroy();
    };
  }, [recorderUrl]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-44 rounded-lg bg-gray-900 my-auto">
        <canvas
          className={!recording ? "hidden" : "" + `w-[30%] h-[80%] py-2 m-auto`}
          ref={recordingCanvasRef}
        />
        <div id="waveform" />
      </div>

      <div className="w-[50%] flex gap-4 items-center">
        <button
          onClick={startRecording}
          disabled={recording || recorderUrl.length > 0}
        >
          Start
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop
        </button>
        <button onClick={resetRecording}>Reset</button>
        {/* <button>Pause</button> */}
        {/* <button onClick={downloadAudio}>Download</button> */}
      </div>
      <audio ref={mediaElRef} src={recorderUrl} controls />
      <Details />
    </div>
  );
}

export default App;
