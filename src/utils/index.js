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

export const getNote = frequency => {
  const note = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(note) + 69;
};

export const getNoteString = note => noteStrings[note % 12];

export const getOctave = note => parseInt(note / 12) - 1;

const getFrequencyFromNoteNumber = note => 440 * Math.pow(2, (note - 69) / 12);

export const getCents = (frequency, note) =>
  Math.floor(
    (1200 * Math.log(frequency / getFrequencyFromNoteNumber(note))) /
      Math.log(2)
  );
