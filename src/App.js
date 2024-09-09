import React from "react";
import Game from "./Page/Game";
import { useState,useEffect,useRef } from "react";

function App() {
  const audioRef = useRef(null); 
  const [audioStarted, setAudioStarted] = useState(false);

  const startAudio = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed: ", error);
      });
      setAudioStarted(true);  // Prevent trying to play the audio again
    }
  };

  useEffect(() => {
    document.addEventListener('click', startAudio);
    return () => {
      document.removeEventListener('click', startAudio);
    };
  }, [audioStarted]);
  return (
    <div className="App">
      <audio ref={audioRef} src="/GameAudio.mp3" loop >
        Your browser does not support the audio element.
      </audio>
      <Game/>
    </div>
  );
}

export default App;
