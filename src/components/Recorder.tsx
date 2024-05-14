import { useEffect, useRef, useState } from "react";
import { continuousVisualizer, VisualizerFunctions } from "sound-visualizer";
import WaveSurfer from "wavesurfer.js";
import { RecordAudio } from "../Icons/RecordAudio";
import { StopRecording } from "../Icons/StopRecording";
import { Close } from "../Icons/Close";
import { Download } from "../Icons/Download";
import { Play } from "../Icons/Play";
import { Pause } from "../Icons/Pause";
import RestartModal from "./RestartModal";
// import RestartModal from "./RestartModal";

const getMediaStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
  // }
};

const Recorder = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recorderUrl, setRecorderUrl] = useState<string>("");
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [restartRecordingModalShowing, setRestartRecordingModalShowing] =
    useState<boolean>(false);

  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[] | null>([]);

  const waveFunctionRef = useRef<VisualizerFunctions | null>(null);
  const recordingCanvasRef = useRef(null);
  const mediaElRef = useRef<HTMLMediaElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  const handlePlay = () => {
    if (mediaElRef.current) {
      mediaElRef.current?.play();
      setAudioPlaying(true);
    }
  };

  const handlePause = () => {
    if (mediaElRef.current) {
      mediaElRef.current?.pause();
      setAudioPlaying(false);
    }
  };

  useEffect(() => {
    // WaveSurfer
    if (!recorderUrl || !mediaElRef.current) return;
    const wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#8c8c8c",
      progressColor: "#FF0000",
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
      // console.log("Time update", waveSurferRef.current?.getCurrentTime());
      //
    });

    waveSurferRef.current.on("finish", () => {
      waveSurferRef.current?.seekTo(0);
      setAudioPlaying(false);
    });

    waveSurferRef.current.load(recorderUrl);

    mediaElRef.current.addEventListener("play", handlePlay);
    mediaElRef.current.addEventListener("onpause", handlePause);

    return () => {
      wavesurfer.destroy();
      waveSurferRef.current?.unAll();
      waveSurferRef.current?.destroy();
      mediaElRef.current?.removeEventListener("play", handlePlay);
      mediaElRef.current?.removeEventListener("onpause", handlePause);
    };
  }, [recorderUrl]);

  const startRecording = async () => {
    console.log("Triggering start recording");
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

  // const toggleRecording = async () => {
  //   console.log("Triggering toggleRecording recording");

  //   try {
  //     if (
  //       mediaRecorder.current &&
  //       mediaRecorder.current?.state === "recording" &&
  //       waveFunctionRef.current
  //     ) {
  //       console.log("Inside if");
  //       mediaRecorder.current.pause();
  //       waveFunctionRef.current.stop();
  //       // console.log("");
  //     } else if (
  //       mediaRecorder.current &&
  //       mediaRecorder.current?.state === "paused" &&
  //       waveFunctionRef.current
  //     ) {
  //       console.log("Inside else if");
  //       mediaRecorder.current.resume();
  //       // // waveFunctionRef.current.start();

  //       // if (recordingCanvasRef.current && mediaStream.current) {
  //       //   const waveFunction = continuousVisualizer(
  //       //     mediaStream.current,
  //       //     recordingCanvasRef.current,
  //       //     {
  //       //       lineWidth: 1,
  //       //       strokeColor: "#8c8c8c",
  //       //       slices: 150,
  //       //     }
  //       //   );
  //       //   waveFunctionRef.current = waveFunction;
  //       //   waveFunctionRef.current.start();
  //       // }
  //     }
  //   } catch (error: unknown) {
  //     console.error("Error while trying to pause recorder", error);
  //   }
  // };

  const stopRecording = () => {
    console.log("Triggering stopRecording recording");
    try {
      if (
        mediaRecorder.current &&
        mediaRecorder.current.state === "recording"
      ) {
        mediaRecorder.current.stop();
      }

      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
      }

      if (recordingCanvasRef.current && waveFunctionRef.current) {
        waveFunctionRef.current.reset();
      }

      setRecording(false);
    } catch (error: unknown) {
      console.error("Error while trying to stop recorder", error);
    }
  };

  const resetRecording = () => {
    console.log("Triggering resetRecording recording");
    try {
      stopRecording();
      setRecorderUrl("");

      if (waveSurferRef.current) {
        waveSurferRef.current.empty();
      }
    } catch (error: unknown) {
      console.error("Error while trying to reset recorder", error);
    }
  };

  const downloadAudio = () => {
    console.log("Download audio function");
    // const link = document.createElement("a");
    // link.href = recorderUrl;
    // link.download = "test-file-name";

    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full p-12 border-y-[2px] border-gray-600 bg-neutral-950 relative">
      <p
        className={`absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 font-light text-body ${
          recording
            ? "opacity-0 duration-500 delay-200 transition-opacity ease-in-out"
            : ""
        }`}
      >
        Click on the button to start recording...
      </p>

      <div className="flex justify-center items-center w-full z-10">
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
        {/* Stop recording button */}
        {recording ? (
          <>
            <button
              onClick={stopRecording}
              disabled={!recording}
              className="rounded-full p-1 hover:border-[1px] hover:border-record-button-bg cursor-pointer"
            >
              <div className="bg-record-button-bg rounded-full p-2">
                <StopRecording />
              </div>
            </button>
            {/* <button
              onClick={toggleRecording}
              disabled={!recording}
              className="rounded-full p-1 hover:border-[1px] hover:border-record-button-bg cursor-pointer"
            >
              <div className="bg-record-button-bg rounded-full p-2">
                <Pause />
              </div>
            </button> */}
          </>
        ) : (
          <></>
        )}

        {/* Record button */}
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

        {/* Close/Restart recording button */}
        {!recording && recorderUrl.length > 0 ? (
          <button
            onClick={() => setRestartRecordingModalShowing(true)}
            className="bg-transparent rounded-full p-1 border-none absolute top-4 right-4 outline-none"
          >
            <Close />
          </button>
        ) : (
          <></>
        )}

        {/* Play/Download button */}
        {!recording && recorderUrl.length > 0 ? (
          <div className="flex gap-2">
            {/* Play */}
            <button
              onClick={audioPlaying ? handlePause : handlePlay}
              className="rounded-full p-1 hover:border-[1px] hover:border-record-button-bg cursor-pointer"
            >
              <div
                className={`flex justify-center items-center bg-gray-700 rounded-full p-2 ${
                  recording || recorderUrl.length > 0
                } ? "bg-gray-500" : ""
            }`}
              >
                {audioPlaying ? <Pause /> : <Play />}
              </div>
            </button>
            {/* Download */}
            <button
              onClick={downloadAudio}
              className="rounded-full p-1 hover:border-[1px] hover:border-download-button-bg cursor-pointer"
            >
              <div
                className={`bg-download-button-bg rounded-full p-2 ${
                  recording || recorderUrl.length > 0
                } ? "bg-gray-500" : ""
            }`}
              >
                <Download />
              </div>
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full flex justify-center items-center">
        <audio ref={mediaElRef} src={recorderUrl} />
      </div>
      <RestartModal
        restartRecordingModalShowing={restartRecordingModalShowing}
        setRestartRecordingModalShowing={setRestartRecordingModalShowing}
        clickHandler={resetRecording}
      />
    </div>
  );
};

export default Recorder;
