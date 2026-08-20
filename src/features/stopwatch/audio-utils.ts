/**
 * Web Audio API Audio Cues for Stopwatch & Timers
 * Generates synthetic beeps with zero external audio files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playBeep(frequency: number = 880, durationMs: number = 100, type: OscillatorType = 'sine'): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Ignore audio errors if audio context blocked by browser policy
  }
}

export function playCountdownBeep(isGo: boolean = false): void {
  if (isGo) {
    playBeep(1760, 250, 'triangle'); // High energetic pitch for GO!
  } else {
    playBeep(880, 120, 'sine'); // Standard countdown pip
  }
}

export function playLapChime(): void {
  playBeep(1320, 80, 'sine');
}
