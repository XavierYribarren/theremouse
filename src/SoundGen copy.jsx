import React, { useState, useEffect, useRef } from "react";
import Osc1 from "./components/osc1";

export default function SoundGen() {
  const [freq, setFreq] = useState("");
  const [dataPlaying, setDataPlaying] = useState(false);
  const audioContextRef = useRef();
  const oscRef = useRef();
  const gainRef = useRef();
  const lfoRef = useRef();

  let curX, curY;

  const handleMouseMove = (event) => {
    curX = Math.floor(
      ((event.clientX / window.innerWidth) * 100).toFixed(3) * 10
    );
    curY = (((event.clientY / window.innerHeight) * 100) / 10).toFixed(3);
  };
  window.addEventListener("mousemove", handleMouseMove);

  useEffect(() => {
    const audioContext = new AudioContext();
    const osc = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc.type = "sine";
    osc.frequency.value = 220;

    gain1.gain.value = 0.2;

    oscRef.current = osc;
    gainRef.current = gain1;

    osc.connect(gain1).connect(audioContext.destination);
    osc.start();

    const lfo = new OscillatorNode(audioContext, {
      type: "square",
      frequency: 30,
    });
    lfo.connect(gain1);
    lfo.start();

    lfoRef.current = lfo;

    audioContextRef.current = audioContext;
    audioContext.suspend();

    return () => gain1.disconnect(audioContext.destination);
  }, []);

  const toggleOscillator = () => {
    if (dataPlaying) {
      audioContextRef.current.suspend();
    } else {
      audioContextRef.current.resume();
    }
    setDataPlaying((play) => !play);
  };



  const changeFrequency = () => {
    oscRef.current.frequency.value = curX;
    lfoRef.current.frequency.value = curX;

    setFreq(oscRef.current.frequency.value + "+" + curX);

  };

  const changeGain = () => {
    gainRef.current.gain.value = curY / 20;
  };

  return (
    <div
      className="soundgen-main"
      onMouseMove={() => {
        changeFrequency();
        changeGain();
      }}
    >
      <button onClick={toggleOscillator}>PLAY</button>
      <div>{freq}</div>
    </div>
  );
}
