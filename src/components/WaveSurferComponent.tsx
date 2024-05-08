import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { WaveSurferOptions } from "wavesurfer.js/dist/types.js";

interface IWaveSurferComponent {
  audioUrl: string;
  mediaElRef: HTMLMediaElement;
}

const WaveSurferComponent = (props: IWaveSurferComponent) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const { audioUrl, mediaElRef } = props;

  useEffect(() => {
    if (!audioUrl) return;
    const wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#ffffff",
      progressColor: "#383351",
      url: audioUrl,
      dragToSeek: true,
      // duration: 10,
      // mediaControls: true,
      autoCenter: true,
      media: mediaElRef,
      autoScroll: true,
    });

    waveSurferRef.current = wavesurfer;

    waveSurferRef.current.load(audioUrl);

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl]);

  console.log(waveSurferRef.current);
  if (!audioUrl.length) return <></>;

  return <div id="waveform"></div>;
};

export default WaveSurferComponent;
