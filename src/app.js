import React, { useState } from 'react';
import { FrequencyRecognizerNode, getAudioContext } from 'frequency-recognizer';

import { AppWrapper, Button, Message } from './components';

export const App = () => {
  const [isTunerActive, setIsTunerActive] = useState(false);
  const [message, setMessage] = useState(false);

  const recognizerListener = e => {
    if (e.frequency > 440) {
      setMessage('higher than A4');
    } else if (e.frequency === 440) {
      setMessage('A4');
    } else if (e.frequency === 0) {
      setMessage('silence');
    } else {
      setMessage('lower than A4');
    }
  };

  const handleToggleTuner = () => {
    const audioContext = getAudioContext();
    const recognizer = window.Aubio;
    const frequencyRecognizerNode = FrequencyRecognizerNode.getInstance(
      audioContext,
      recognizer,
      recognizerListener
    );

    if (!isTunerActive) {
      setIsTunerActive(true);
      frequencyRecognizerNode.init();
    } else {
      setIsTunerActive(false);
      frequencyRecognizerNode.destroy();
      setMessage('');
    }
  };

  return (
    <AppWrapper>
      <Message>{message}</Message>
      <Button isActive={isTunerActive} onClick={handleToggleTuner} />
    </AppWrapper>
  );
};
