import React, { useState, useEffect } from "react";

import { Meter } from "./features/Meter";
import {
  AppWrapper,
  Frequency,
  NoteWrapper,
  Note,
  Octave,
  Button
} from "./components";

import { getNote, getNoteString, getOctave, getCents } from "./utils";

const Aubio = window.Aubio;

const getAudioContext = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!window.AudioContext) {
    throw new Error("Web Audio API is not supported in this browser");
  }

  return new window.AudioContext();
};

const initialState = {
  note: "A",
  octave: 4,
  cents: 0,
  frequency: 440,
  isTunerActive: false
};

let scriptProcessor = null;

let audioContext = null;

let mediaStreamSource = null;

export const App = () => {
  const [
    { note, octave, cents, frequency, isTunerActive },
    setState
  ] = useState(initialState);

  let pitchDetector = null;

  const initGetUserMedia = () => {
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        const getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
          throw new Error("getUserMedia is not implemented in this browser");
        }

        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
  };

  const audioProcessCallback = e => {
    const frequency = pitchDetector.do(e.inputBuffer.getChannelData(0));

    if (frequency) {
      const note = getNote(frequency);
      const cents = getCents(frequency, note);

      setState(prevState => ({
        ...prevState,
        note: getNoteString(note),
        octave: getOctave(note),
        frequency: frequency.toFixed(1),
        cents
      }));
    }
  };

  const handleStopTuner = () => {
    setState(initialState);

    if (scriptProcessor) {
      scriptProcessor.onaudioprocess = null;
      scriptProcessor = null;
    }

    if (audioContext) {
      audioContext = null;
    }

    if (
      mediaStreamSource &&
      mediaStreamSource.mediaStream &&
      mediaStreamSource.mediaStream.stop
    ) {
      mediaStreamSource.mediaStream.stop();
    }
  };

  useEffect(() => {
    initGetUserMedia();

    return () => {
      handleStopTuner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTuner = () => {
    try {
      audioContext = getAudioContext();

      Aubio().then(aubio => {
        pitchDetector = new aubio.Pitch(
          "default",
          2048,
          1,
          audioContext.sampleRate
        );

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

          mediaStreamSource = audioContext.createMediaStreamSource(stream);

          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          mediaStreamSource.connect(analyser);

          analyser.connect(scriptProcessor);

          scriptProcessor.connect(audioContext.destination);

          scriptProcessor.onaudioprocess = audioProcessCallback;
        });
      });
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleStartTuner = () => {
    setState(prevState => ({
      ...prevState,
      isTunerActive: true
    }));

    startTuner();
  };

  return (
    <AppWrapper>
      <Meter cents={cents} />
      <NoteWrapper>
        <Note>{note}</Note>
        <Octave>{octave}</Octave>
      </NoteWrapper>
      <Frequency>
        <span>{frequency}</span> Hz
      </Frequency>
      <Button
        isActive={isTunerActive}
        onClick={isTunerActive ? handleStopTuner : handleStartTuner}
      />
    </AppWrapper>
  );
};
