/**
 * High-quality procedural sound effects using Web Audio API
 * No external audio files needed; instantaneous response & low latency.
 */

let audioCtx: AudioContext | null = null;
let isSoundEnabled = true;

export function toggleSound(enable?: boolean): boolean {
  if (typeof enable === 'boolean') {
    isSoundEnabled = enable;
  } else {
    isSoundEnabled = !isSoundEnabled;
  }
  try {
    localStorage.setItem('reliclog_sound_enabled', JSON.stringify(isSoundEnabled));
  } catch {}
  return isSoundEnabled;
}

export function getSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem('reliclog_sound_enabled');
    if (saved !== null) {
      isSoundEnabled = JSON.parse(saved);
    }
  } catch {}
  return isSoundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (!isSoundEnabled) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Quest Complete chime (+XP)
 * Rising melodic triplet with crystalline bell timbre
 */
export function playQuestCompleteSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.001, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.45);
  });
}

/**
 * Level Up fanfare!
 * Grand heroic fanfare with rich chord & sustain
 */
export function playLevelUpSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Heroic progression: G4, C5, E5, G5, B5, C6
  const chords = [
    { time: 0.0, freqs: [392.0, 523.25], dur: 0.18, vol: 0.15 },
    { time: 0.18, freqs: [523.25, 659.25], dur: 0.2, vol: 0.18 },
    { time: 0.38, freqs: [659.25, 783.99], dur: 0.22, vol: 0.2 },
    { time: 0.6, freqs: [523.25, 783.99, 1046.5], dur: 0.8, vol: 0.25 },
  ];

  chords.forEach(({ time, freqs, dur, vol }) => {
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.exponentialRampToValueAtTime(vol, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  });
}

/**
 * Relic Reveal magical shimmer
 * High shimmering harmonic arpeggio
 */
export function playRelicRevealSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const frequencies = [880, 1108.73, 1318.51, 1760, 2217.46]; // A5 major shimmer

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    gain.gain.setValueAtTime(0.001, now + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.65);
  });
}

/**
 * Tactile click
 */
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}
