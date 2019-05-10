import React, { Component } from "react";
import styled from "styled-components/macro";

import { Meter } from "./features/Meter";
import { getNote, getNoteString, getOctave, getCents } from "./utils";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Frequency = styled.div`
  margin-top: 15px;
  color: #fff;
  font-size: 22px;

  & > span {
    color: #93ccbf;
  }
`;

const NoteWrapper = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: baseline;
  color: #fff;
`;

const Note = styled.div`
  font-size: 96px;
  line-height: 74px;
`;

const Octave = styled.div`
  font-size: 46px;
  line-height: 40px;
`;

const Button = styled.button`
  display: flex;
  justify-content: ${({ isActive }) => (isActive ? "flex-end" : "flex-start")};
  align-items: center;
  width: 100px;
  height: 50px;
  margin-top: 40px;
  border: 0;
  outline: none;
  background-color: ${({ isActive }) => (isActive ? "#93ccbf" : "#fff")};
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
`;

const ButtonContent = styled.div`
  position: relative;
  width: 40px;
  height: 38px;
  background: ${({ isActive }) => (isActive ? "#fff" : "#93ccbf")};
  border-radius: 4px;
`;

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

  componentWillUnmount() {
    this.handleStopTuner();
  }

  getAudioContext = () => new window.AudioContext();

  startTuner = () => {
    const audioContext = this.getAudioContext();

    audioContext.resume().then(() => {
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
    });
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
      this.mediaStreamSource = null;
    });
  };

  render() {
    const { note, octave, cents, frequency, isTunerActive } = this.state;

    return (
      <Wrapper>
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
        >
          <ButtonContent isActive={isTunerActive} />
        </Button>
      </Wrapper>
    );
  }
}
