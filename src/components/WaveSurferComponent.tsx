import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface IWaveSurferComponent {
  audioUrl: string;
}

const WaveSurferComponent = (props: IWaveSurferComponent) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const { audioUrl } = props;

  useEffect(() => {
    if (!audioUrl) return;
    const wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#4F4A85",
      progressColor: "#383351",
      url: audioUrl,
    });

    waveSurferRef.current = wavesurfer;

    waveSurferRef.current.load(audioUrl);

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl]);

  return (
    <div
      className="w-full h-full"
      style={{ border: "1px solid grey" }}
      id="waveform"
    ></div>
  );
};

export default WaveSurferComponent;
