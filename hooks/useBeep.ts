
import { useState, useCallback } from 'react';

export const useBeep = (freq = 523.25, duration = 150, vol = 80) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const unlockAudio = useCallback(() => {
    if (audioContext) return audioContext;
    
    try {
      const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(newAudioContext);
      return newAudioContext;
    } catch (error) {
        console.error("Web Audio API is not supported in this browser.", error);
        return null;
    }
  }, [audioContext]);

  const play = useCallback(() => {
    let context = audioContext;
    if (!context) {
        context = unlockAudio();
    }
    if (!context) return;

    if (context.state === 'suspended') {
      context.resume();
    }
    
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    
    oscillator.connect(gain);
    oscillator.frequency.value = freq;
    oscillator.type = "sine";
    
    gain.connect(context.destination);
    gain.gain.value = vol * 0.01;
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration * 0.001);

  }, [audioContext, unlockAudio, freq, duration, vol]);
  
  return { play, unlockAudio };
};
