import { useState, useCallback, useRef } from 'react';

export function useAudio() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);

  // Lazy initialize AudioContext on first user interaction
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended (browser security policies)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playClick = useCallback(() => {
    if (!soundEnabled) return;

    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Clean pop sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio click failed to play:", e);
    }
  }, [soundEnabled]);

  const playDraw = useCallback((onComplete) => {
    if (!soundEnabled) {
      if (onComplete) onComplete();
      return;
    }

    try {
      const ctx = getAudioContext();
      const duration = 0.8; // 800ms for tension roll
      const startTime = ctx.currentTime;

      // Play rolling sound (rapid low pulses)
      const rollOsc = ctx.createOscillator();
      const rollGain = ctx.createGain();

      rollOsc.connect(rollGain);
      rollGain.connect(ctx.destination);

      rollOsc.type = 'triangle';
      rollOsc.frequency.setValueAtTime(80, startTime);
      
      // Simulate drum/ball rolling by modulating frequency & gain
      for (let time = 0; time < duration; time += 0.08) {
        rollOsc.frequency.setValueAtTime(80 + Math.random() * 60, startTime + time);
        rollGain.gain.setValueAtTime(0.08, startTime + time);
        rollGain.gain.exponentialRampToValueAtTime(0.001, startTime + time + 0.06);
      }

      rollOsc.start(startTime);
      rollOsc.stop(startTime + duration);

      // After the roll finishes, play the chime and trigger the callback
      setTimeout(() => {
        try {
          const chimeCtx = getAudioContext();
          const now = chimeCtx.currentTime;

          // Double oscillator chime for harmony (C5 + E5)
          const osc1 = chimeCtx.createOscillator();
          const osc2 = chimeCtx.createOscillator();
          const chimeGain = chimeCtx.createGain();

          osc1.connect(chimeGain);
          osc2.connect(chimeGain);
          chimeGain.connect(chimeCtx.destination);

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(523.25, now); // C5
          osc1.frequency.exponentialRampToValueAtTime(880, now + 0.4);

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(659.25, now); // E5
          osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.4);

          chimeGain.gain.setValueAtTime(0.2, now);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.6);
          osc2.stop(now + 0.6);
        } catch (err) {
          console.warn("Chime failed", err);
        }

        if (onComplete) onComplete();
      }, duration * 1000);

    } catch (e) {
      console.warn("Audio draw failed:", e);
      if (onComplete) onComplete();
    }
  }, [soundEnabled]);

  return {
    soundEnabled,
    setSoundEnabled,
    playClick,
    playDraw
  };
}
