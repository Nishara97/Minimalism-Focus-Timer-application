/**
 * Web Audio API synthesizer for crisp, self-contained notification sounds.
 * Fully compliant with browser sandbox limits; doesn't load external static files.
 */

// We create a lazily-initialized AudioContext to adhere to browser user-gesture requirements.
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended (common in browsers until user interactions occur)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a warm, atmospheric Zen chime using FM-like additive synthesis.
 */
export function playZenChime(volumePercent = 80) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const destination = ctx.destination;
  const volume = (volumePercent / 100) * 0.4; // Cap absolute gain to avoid distortion

  // Primary strike oscillator (high bell tone)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  
  // Harmonic overtone (pure, resonant)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();

  // Sub-fundamental (for warm body sound)
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();

  // Connect components
  osc1.connect(gain1);
  osc2.connect(gain2);
  osc3.connect(gain3);

  gain1.connect(destination);
  gain2.connect(destination);
  gain3.connect(destination);

  const now = ctx.currentTime;

  // Frequencies corresponding to peaceful bell overtones
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(523.25, now); // C5
  osc1.frequency.exponentialRampToValueAtTime(523.25 * 1.5, now + 1.5); // Warm shift

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(783.99, now); // G5 (Perfect 5th)

  osc3.type = 'triangle';
  osc3.frequency.setValueAtTime(261.63, now); // C4 (Warm root)

  // Envelopes
  // Strike (osc1)
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(volume * 0.7, now + 0.05); // Attack
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.8); // Decay

  // Overtone (osc2)
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(volume * 0.3, now + 0.08); // Slower attack
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2); // Faster decay

  // Warmth (osc3)
  gain3.gain.setValueAtTime(0, now);
  gain3.gain.linearRampToValueAtTime(volume * 0.4, now + 0.1); 
  gain3.gain.exponentialRampToValueAtTime(0.0001, now + 2.2); // Long, warm ringing tail

  // Play
  osc1.start(now);
  osc2.start(now);
  osc3.start(now);

  // Stop to release audio resources
  osc1.stop(now + 2.5);
  osc2.stop(now + 2.5);
  osc3.stop(now + 2.5);
}

/**
 * Plays an upbeat digital alarm beep sequence.
 */
export function playDigitalBeep(volumePercent = 80) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const destination = ctx.destination;
  const volume = (volumePercent / 100) * 0.25; // Lower gain for square wave harshness

  const playSingleBeep = (startTime: number, duration: number, frequency: number) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gainNode.gain.setValueAtTime(volume, startTime + duration - 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  };

  const now = ctx.currentTime;
  // Dynamic double beep
  playSingleBeep(now, 0.12, 880); // A5
  playSingleBeep(now + 0.18, 0.12, 880);
  playSingleBeep(now + 0.36, 0.24, 1109.73); // C#6 (Major third higher, uplifting resolution)
}
