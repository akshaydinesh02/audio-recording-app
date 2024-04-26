import { useRef, useState } from "react";
import "./App.css";

const getMediaStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
  // }
};

function App() {
  const [recorderUrl, setRecorderUrl] = useState("");
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[] | null>([]);

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
  };

  return (
    <div className="flex gap-4 justify-center items-center">
      <audio src={recorderUrl} controls />
      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>
      {/* <button>Pause</button>
      <button>Download</button> */}
    </div>
  );
}

export default App;
