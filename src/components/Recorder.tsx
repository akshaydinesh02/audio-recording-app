import { useEffect, useRef, useState } from "react";
import { continuousVisualizer, VisualizerFunctions } from "sound-visualizer";
import WaveSurfer from "wavesurfer.js";
import { RecordAudio } from "../Icons/RecordAudio";
import { StopRecording } from "../Icons/StopRecording";
import { Close } from "../Icons/Close";

const getMediaStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
  // }
};

const Recorder = () => {
  const [recording, setRecording] = useState<boolean>(false);

  const [recorderUrl, setRecorderUrl] = useState("");
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[] | null>([]);

  const waveFunctionRef = useRef<VisualizerFunctions | null>(null);
  const recordingCanvasRef = useRef(null);
  const mediaElRef = useRef<HTMLMediaElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

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

  return (
    <div className="w-full h-full p-12 border-b-[2px] border-gray-600 relative">
      <div className="flex justify-center items-center w-full">
        <div className="w-[70%] h-44 rounded-lg  my-auto">
          <canvas
            className={
              !recording ? "hidden" : "" + `w-[30%] h-[80%] py-2 m-auto`
            }
            ref={recordingCanvasRef}
          />
          <div id="waveform" />
        </div>
      </div>

      <div className="flex items-center justify-center">
        {recording ? (
          <button
            onClick={stopRecording}
            disabled={!recording}
            className="rounded-full p-1 hover:border-[1px] hover:border-record-button-bg cursor-pointer"
          >
            <div className="bg-record-button-bg rounded-full p-2">
              <StopRecording />
            </div>
          </button>
        ) : (
          <></>
        )}

        {!recording && !recorderUrl.length ? (
          <button
            onClick={startRecording}
            disabled={recording || recorderUrl.length > 0}
            className="rounded-full p-1 hover:border-[1px] hover:border-record-button-bg cursor-pointer disabled:cursor-not-allowed"
          >
            <div
              className={`bg-record-button-bg rounded-full p-2 ${
                recording || recorderUrl.length > 0
              } ? "bg-gray-500" : ""
              }`}
            >
              <RecordAudio />
            </div>
          </button>
        ) : (
          <></>
        )}

        {!recording && recorderUrl.length > 0 ? (
          <button
            onClick={resetRecording}
            className="bg-transparent rounded-full p-1 border-none absolute top-4 right-4 outline-none"
          >
            <Close />
          </button>
        ) : (
          <></>
        )}
        {/* <button onClick={downloadAudio}>Download</button> */}
      </div>
      <audio ref={mediaElRef} src={recorderUrl} controls />
    </div>
  );
};

export default Recorder;
