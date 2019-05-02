const noteStrings = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];
const noteDiv = document.getElementById("app");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
let analyser = null;
let mediaStreamSource = null;
let pitchDetector = null;

const getNote = frequency => {
  const note = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(note) + 69;
};

const frequencyFromNoteNumber = note => 440 * Math.pow(2, (note - 69) / 12);

const getCents = (frequency, note) =>
  Math.floor(
    (1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2)
  );

const audioProcessCallback = event => {
  const frequency = pitchDetector.do(event.inputBuffer.getChannelData(0));
  if (frequency) {
    console.log("frequency: ", frequency);
    const note = getNote(frequency);
    const cents = getCents(frequency, note);
    noteDiv.innerHTML = noteStrings[note % 12];
  }
};

const initTuner = () => {
  audioContext.resume().then(() => {
    Aubio().then(aubio => {
      pitchDetector = new aubio.Pitch(
        "default",
        2048,
        1,
        audioContext.sampleRate
      );

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          mediaStreamSource = audioContext.createMediaStreamSource(stream);

          analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          mediaStreamSource.connect(analyser);

          analyser.connect(scriptProcessor);

          scriptProcessor.connect(audioContext.destination);

          scriptProcessor.addEventListener(
            "audioprocess",
            audioProcessCallback
          );
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
};

const stopTuner = () => {
  if (
    mediaStreamSource &&
    mediaStreamSource.mediaStream &&
    mediaStreamSource.mediaStream.stop
  ) {
    mediaStreamSource.mediaStream.stop();
  }
  scriptProcessor.removeEventListener("audioprocess", audioProcessCallback);
  mediaStreamSource = null;
  analyser = null;
  pitchDetector = null;
  noteDiv.innerHTML = "--";
};

document.getElementById("start").addEventListener("click", initTuner);
document.getElementById("stop").addEventListener("click", stopTuner);
