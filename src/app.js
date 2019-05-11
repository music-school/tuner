import React, { Component } from "react";

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

const initialState = {
  note: "A",
  octave: 4,
  cents: 0,
  frequency: 440,
  isTunerActive: false
};

export class App extends Component {
  state = initialState;

  pitchDetector = null;

  mediaStreamSource = null;

  scriptProcessor = null;

  componentDidMount() {
    this.initGetUserMedia();
  }

  componentWillUnmount() {
    this.handleStopTuner();
  }

  getAudioContext = () => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!window.AudioContext) {
      throw new Error("Web Audio API is not supported in this browser");
    }

    return new window.AudioContext();
  };

  initGetUserMedia = () => {
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

  startTuner = () => {
    try {
      const audioContext = this.getAudioContext();

      Aubio().then(aubio => {
        this.pitchDetector = new aubio.Pitch(
          "default",
          2048,
          1,
          audioContext.sampleRate
        );

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          this.scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

          this.mediaStreamSource = audioContext.createMediaStreamSource(stream);

          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          this.mediaStreamSource.connect(analyser);

          analyser.connect(this.scriptProcessor);

          this.scriptProcessor.connect(audioContext.destination);

          this.scriptProcessor.addEventListener(
            "audioprocess",
            this.audioProcessCallback
          );
        });
      });
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  audioProcessCallback = e => {
    const frequency = this.pitchDetector.do(e.inputBuffer.getChannelData(0));

    if (frequency) {
      const note = getNote(frequency);
      const cents = getCents(frequency, note);

      this.setState({
        note: getNoteString(note),
        octave: getOctave(note),
        frequency: frequency.toFixed(1),
        cents
      });
    }
  };

  handleStartTuner = () => {
    this.setState(
      {
        isTunerActive: true
      },
      () => {
        this.startTuner();
      }
    );
  };

  handleStopTuner = () => {
    this.setState(initialState, () => {
      if (
        this.mediaStreamSource &&
        this.mediaStreamSource.mediaStream &&
        this.mediaStreamSource.mediaStream.stop
      ) {
        this.mediaStreamSource.mediaStream.stop();
      }

      this.scriptProcessor.removeEventListener(
        "audioprocess",
        this.audioProcessCallback
      );
      this.Aubio = null;
      this.mediaStreamSource = null;
    });
  };

  render() {
    const { note, octave, cents, frequency, isTunerActive } = this.state;

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
          onClick={isTunerActive ? this.handleStopTuner : this.handleStartTuner}
        />
      </AppWrapper>
    );
  }
}
