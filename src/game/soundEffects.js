/**
 * Action-Reactive Web Audio Sound Engine for HEXEDEX (DEADLIGHTS 3D)
 * Procedural, zero-dependency, 100% offline synthesizer using the Web Audio API.
 */

let audioCtx = null;
const STORAGE_KEY = 'deadlights.muted';

let muted = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) === 'true' : false;
const listeners = new Set();

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

let bgmTimer = null;
let bgmGainNode = null;
let bgmStep = 0;
let bgmStage = 1;
let bgmActive = false;

export function isMuted() {
  return muted;
}

export function setMuted(val) {
  muted = Boolean(val);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
  }
  if (bgmGainNode && audioCtx) {
    bgmGainNode.gain.setValueAtTime(muted ? 0 : 0.22, audioCtx.currentTime);
  }
  listeners.forEach(cb => {
    try { cb(muted); } catch (e) { /* ignore */ }
  });
  return muted;
}

export function toggleMute() {
  return setMuted(!muted);
}

export function subscribeMuteChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Helper to create a noise buffer
function createNoiseBuffer(ctx, duration = 0.2) {
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/**
 * Play lane switch whoosh pitched by lane (260Hz, 310Hz, 360Hz)
 */
export function playLaneSwitchSfx(laneIndex = 1) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [260, 310, 360];
  const baseFreq = freqs[Math.max(0, Math.min(2, laneIndex))] || 310;

  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(baseFreq * 0.85, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.08);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.frequency.linearRampToValueAtTime(400, now + 0.12);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.13);
}

/**
 * Play snappy arcade jump pitch bend (190Hz -> 540Hz)
 */
export function playJumpSfx() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Layer 1: Triangle base
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(190, now);
  osc1.frequency.exponentialRampToValueAtTime(540, now + 0.16);

  gain1.gain.setValueAtTime(0.22, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.19);

  // Layer 2: Subtle square chiptune overtone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(380, now);
  osc2.frequency.exponentialRampToValueAtTime(1080, now + 0.14);

  gain2.gain.setValueAtTime(0.06, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.16);
}

/**
 * Play crystalline shard pickup chime (B5 -> E6)
 */
export function playShardPickupSfx() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [987.77, 1318.51]; // B5 -> E6

  notes.forEach((freq, idx) => {
    const start = now + idx * 0.045;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.2, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.23);
  });
}

/**
 * Play shimmering golden rare orb arpeggio (D6 -> F#6 -> A6 -> D7)
 */
export function playRareOrbSfx() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [1174.66, 1479.98, 1760.00, 2349.32]; // D6, F#6, A6, D7

  notes.forEach((freq, idx) => {
    const start = now + idx * 0.04;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.22, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.33);
  });
}

/**
 * Play card fragment / full card fanfare
 */
export function playCardFragmentSfx(isFullCard = false) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Authentic chiptune fanfare
  const notes = isFullCard
    ? [523.25, 659.25, 783.99, 987.77, 1046.50] // C5, E5, G5, B5, C6
    : [523.25, 659.25, 783.99, 1046.50];        // C5, E5, G5, C6

  const stepDuration = isFullCard ? 0.08 : 0.06;

  notes.forEach((freq, idx) => {
    const start = now + idx * stepDuration;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.01);
    const hold = idx === notes.length - 1 ? (isFullCard ? 0.35 : 0.22) : (stepDuration * 0.85);
    gain.gain.exponentialRampToValueAtTime(0.001, start + hold);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + hold + 0.02);
  });
}

/**
 * Play low crunch collision impact (120Hz -> 35Hz) + clown motif
 */
export function playCollisionHitSfx() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Impact thump
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.26);

  // Noise crunch
  try {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 0.15);
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'lowpass';
    nFilter.frequency.setValueAtTime(800, now);

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.25, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.16);
  } catch (e) {
    // ignore
  }

  // Descending sinister clown motif (F#3 -> D#3 -> C3)
  const clownNotes = [185.00, 155.56, 130.81];
  clownNotes.forEach((freq, idx) => {
    const start = now + 0.12 + idx * 0.09;
    const cOsc = ctx.createOscillator();
    const cGain = ctx.createGain();
    cOsc.type = 'sine';
    cOsc.frequency.setValueAtTime(freq, start);

    cGain.gain.setValueAtTime(0.001, start);
    cGain.gain.linearRampToValueAtTime(0.14, start + 0.015);
    cGain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

    cOsc.connect(cGain);
    cGain.connect(ctx.destination);
    cOsc.start(start);
    cOsc.stop(start + 0.13);
  });
}

/**
 * Celebratory carnival calliope fanfare chord progression
 */
export function playStageClearSfx() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Bright triumphant fanfare arpeggio chords
  const chords = [
    [523.25, 659.25, 783.99],          // C major
    [587.33, 739.99, 880.00],          // D major
    [659.25, 830.61, 987.77],          // E major
    [783.99, 987.77, 1174.66, 1567.98] // G / C octave triumph
  ];

  chords.forEach((chord, chordIdx) => {
    const chordTime = now + chordIdx * 0.14;
    chord.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, chordTime);

      const dur = chordIdx === chords.length - 1 ? 0.45 : 0.12;
      gain.gain.setValueAtTime(0.001, chordTime);
      gain.gain.linearRampToValueAtTime(0.12, chordTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(chordTime);
      osc.stop(chordTime + dur + 0.02);
    });
  });
}

/**
 * Crisp countdown beeps (3, 2, 1) and SURVIVE! burst
 */
export function playCountdownSfx(count) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (count > 0) {
    // 3, 2, 1 beep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(count === 1 ? 987.77 : 880.00, now);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } else {
    // SURVIVE! triumphant chord
    [523.25, 659.25, 783.99, 1046.50].forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    });
  }
}

/**
 * Sub-bass drop + dissonant Deadlights screech cluster
 */
export function playJumpscareSfx() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Sub-bass heavy drop
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(95, now);
  subOsc.frequency.exponentialRampToValueAtTime(24, now + 0.7);

  subGain.gain.setValueAtTime(0.5, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + 0.85);

  // Tritone dissonant cluster screech
  const screechFreqs = [440, 466.16, 622.25, 880, 932.33];
  screechFreqs.forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 1.15, now + 0.5);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  });
}

/**
 * Tactile UI pop for button clicks and card crafting
 */
export function playButtonClickSfx() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(840, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

// ── 8-BIT CHIPTUNE MUSIC SEQUENCER (6 STAGE-SPECIFIC COMPOSITIONS) ──

export const STAGE_MUSIC_THEMES = [
  // Stage 1 (156 BPM - Twilight Mist): Eerie C Minor Game Boy Pokémon trainer/ghost melody
  {
    stageNumber: 1,
    name: 'Twilight Mist',
    bpm: 156,
    leadTimbre: 'square',
    filterFreq: 2400,
    bassTimbre: 'triangle',
    leadMelody: [
      // Phrase 1 (0-15)
      261.6, 311.1, 392.0, 523.3,  493.9, 392.0, 311.1, 293.7,
      261.6, 311.1, 392.0, 415.3,  392.0, 349.2, 311.1, 293.7,
      // Phrase 2 (16-31)
      261.6, 392.0, 523.3, 622.3,  587.3, 523.3, 493.9, 392.0,
      415.3, 523.3, 493.9, 415.3,  392.0, 370.0, 392.0, 493.9,
      // Phrase 3 (32-47)
      523.3, 392.0, 311.1, 392.0,  415.3, 523.3, 587.3, 622.3,
      587.3, 523.3, 493.9, 523.3,  587.3, 493.9, 392.0, 349.2,
      // Phrase 4 (48-63)
      311.1, 349.2, 370.0, 392.0,  415.3, 392.0, 370.0, 349.2,
      311.1, 293.7, 246.9, 293.7,  261.6, 196.0, 261.6, 0,
    ],
    bassLine: [
      65.4, 130.8, 65.4, 130.8,  77.8, 155.6, 98.0, 196.0,
      65.4, 130.8, 65.4, 130.8,  103.8, 207.6, 98.0, 196.0,
      87.3, 174.6, 87.3, 174.6,  98.0, 196.0, 123.5, 246.9,
      65.4, 130.8, 77.8, 98.0,   103.8, 98.0, 65.4, 130.8,
    ],
  },
  // Stage 2 (162 BPM - Amber Hollow): Syncopated D Dorian / Phrygian lantern-festival melody
  {
    stageNumber: 2,
    name: 'Amber Hollow',
    bpm: 162,
    leadTimbre: 'triangle',
    filterFreq: 3400,
    bassTimbre: 'square',
    leadMelody: [
      // Phrase 1 (0-15)
      293.7, 0, 349.2, 392.0,      440.0, 0, 587.3, 523.3,
      440.0, 392.0, 349.2, 392.0,  440.0, 0, 349.2, 329.6,
      // Phrase 2 (16-31)
      293.7, 349.2, 440.0, 587.3,  523.3, 440.0, 392.0, 349.2,
      311.1, 392.0, 466.2, 440.0,  392.0, 349.2, 329.6, 261.6,
      // Phrase 3 (32-47)
      587.3, 0, 440.0, 0,          349.2, 392.0, 440.0, 523.3,
      587.3, 698.5, 659.3, 587.3,  523.3, 440.0, 392.0, 440.0,
      // Phrase 4 (48-63)
      466.2, 440.0, 392.0, 349.2,  311.1, 349.2, 392.0, 440.0,
      349.2, 293.7, 261.6, 329.6,  293.7, 220.0, 293.7, 0,
    ],
    bassLine: [
      73.4, 110.0, 87.3, 130.8,   98.0, 146.8, 110.0, 164.8,
      73.4, 146.8, 98.0, 130.8,   77.8, 116.5, 110.0, 146.8,
      87.3, 130.8, 98.0, 146.8,   110.0, 164.8, 130.8, 196.0,
      73.4, 110.0, 87.3, 110.0,   98.0, 110.0, 73.4, 146.8,
    ],
  },
  // Stage 3 (168 BPM - Crimson Mire): High-energy E Minor electric gym-battle theme
  {
    stageNumber: 3,
    name: 'Crimson Mire',
    bpm: 168,
    leadTimbre: 'square',
    filterFreq: 3100,
    bassTimbre: 'sawtooth',
    leadMelody: [
      // Phrase 1 (0-15)
      329.6, 392.0, 493.9, 659.3,  622.3, 659.3, 493.9, 392.0,
      329.6, 493.9, 392.0, 370.0,  329.6, 392.0, 440.0, 493.9,
      // Phrase 2 (16-31)
      659.3, 493.9, 392.0, 493.9,  587.3, 523.3, 493.9, 440.0,
      392.0, 440.0, 493.9, 587.3,  523.3, 493.9, 440.0, 370.0,
      // Phrase 3 (32-47)
      392.0, 493.9, 659.3, 784.0,  740.0, 659.3, 622.3, 659.3,
      740.0, 622.3, 493.9, 622.3,  659.3, 493.9, 392.0, 329.6,
      // Phrase 4 (48-63)
      523.3, 493.9, 440.0, 392.0,  370.0, 392.0, 440.0, 493.9,
      392.0, 329.6, 311.1, 370.0,  329.6, 246.9, 329.6, 0,
    ],
    bassLine: [
      82.4, 164.8, 82.4, 164.8,    98.0, 196.0, 110.0, 220.0,
      82.4, 164.8, 82.4, 164.8,    123.5, 246.9, 110.0, 196.0,
      103.8, 207.6, 110.0, 220.0,  123.5, 246.9, 146.8, 293.7,
      82.4, 164.8, 98.0, 123.5,    110.0, 123.5, 82.4, 164.8,
    ],
  },
  // Stage 4 (174 BPM - Glitch Rift): Frantic F# Phrygian Dominant cyber-rift theme
  {
    stageNumber: 4,
    name: 'Glitch Rift',
    bpm: 174,
    leadTimbre: 'sawtooth',
    filterFreq: 2800,
    bassTimbre: 'square',
    leadMelody: [
      // Phrase 1 (0-15)
      370.0, 0, 466.2, 554.4,      740.0, 587.3, 554.4, 466.2,
      392.0, 466.2, 554.4, 493.9,  466.2, 392.0, 370.0, 0,
      // Phrase 2 (16-31)
      370.0, 740.0, 659.3, 554.4,  587.3, 493.9, 554.4, 466.2,
      493.9, 392.0, 466.2, 370.0,  392.0, 329.6, 370.0, 0,
      // Phrase 3 (32-47)
      554.4, 587.3, 554.4, 466.2,  493.9, 554.4, 587.3, 659.3,
      740.0, 587.3, 554.4, 493.9,  466.2, 392.0, 370.0, 392.0,
      // Phrase 4 (48-63)
      466.2, 392.0, 370.0, 329.6,  293.7, 329.6, 370.0, 392.0,
      466.2, 554.4, 493.9, 466.2,  392.0, 370.0, 0, 0,
    ],
    bassLine: [
      92.5, 185.0, 92.5, 0,        98.0, 196.0, 116.5, 233.1,
      92.5, 185.0, 138.6, 0,       98.0, 185.0, 82.4, 164.8,
      116.5, 233.1, 123.5, 246.9,  138.6, 277.2, 146.8, 0,
      92.5, 185.0, 98.0, 116.5,    123.5, 116.5, 92.5, 185.0,
    ],
  },
  // Stage 5 (180 BPM - Abyssal Void): Heavy G Harmonic Minor clockwork tower theme
  {
    stageNumber: 5,
    name: 'Abyssal Void',
    bpm: 180,
    leadTimbre: 'square',
    filterFreq: 3300,
    bassTimbre: 'sawtooth',
    leadMelody: [
      // Phrase 1 (0-15)
      392.0, 466.2, 587.3, 784.0,  740.0, 587.3, 466.2, 440.0,
      392.0, 587.3, 523.3, 466.2,  440.0, 370.0, 392.0, 440.0,
      // Phrase 2 (16-31)
      466.2, 587.3, 784.0, 932.3,  880.0, 784.0, 740.0, 587.3,
      622.3, 784.0, 740.0, 622.3,  587.3, 523.3, 466.2, 440.0,
      // Phrase 3 (32-47)
      587.3, 784.0, 932.3, 1174.7, 1046.5, 932.3, 880.0, 784.0,
      740.0, 880.0, 1174.7, 1046.5, 932.3, 880.0, 784.0, 740.0,
      // Phrase 4 (48-63)
      622.3, 587.3, 523.3, 466.2,  440.0, 466.2, 523.3, 587.3,
      622.3, 523.3, 440.0, 370.0,  392.0, 293.7, 392.0, 0,
    ],
    bassLine: [
      98.0, 196.0, 98.0, 196.0,    116.5, 233.1, 146.8, 293.7,
      98.0, 196.0, 98.0, 196.0,    155.6, 311.1, 146.8, 293.7,
      130.8, 261.6, 130.8, 261.6,  146.8, 293.7, 185.0, 370.0,
      98.0, 196.0, 116.5, 146.8,   155.6, 146.8, 98.0, 196.0,
    ],
  },
  // Stage 6 (188 BPM - Deadlights Core): Blistering A Minor / Tritone apex boss finale
  {
    stageNumber: 6,
    name: 'Grimlight Core',
    bpm: 188,
    leadTimbre: 'sawtooth',
    filterFreq: 3600,
    bassTimbre: 'sawtooth',
    leadMelody: [
      // Phrase 1 (0-15)
      440.0, 523.3, 659.3, 880.0,  830.6, 659.3, 523.3, 493.9,
      440.0, 622.3, 587.3, 523.3,  493.9, 415.3, 440.0, 493.9,
      // Phrase 2 (16-31)
      523.3, 659.3, 880.0, 1046.5, 987.8, 880.0, 830.6, 659.3,
      698.5, 880.0, 830.6, 698.5,  659.3, 622.3, 587.3, 493.9,
      // Phrase 3 (32-47)
      880.0, 659.3, 523.3, 659.3,  622.3, 523.3, 440.0, 523.3,
      587.3, 698.5, 880.0, 830.6,  880.0, 987.8, 1046.5, 987.8,
      // Phrase 4 (48-63)
      1046.5, 987.8, 880.0, 830.6, 698.5, 659.3, 622.3, 587.3,
      523.3, 493.9, 415.3, 493.9,  440.0, 329.6, 440.0, 0,
    ],
    bassLine: [
      110.0, 220.0, 110.0, 220.0,  130.8, 261.6, 164.8, 329.6,
      110.0, 220.0, 155.6, 311.1,  174.6, 349.2, 164.8, 329.6,
      146.8, 293.7, 155.6, 311.1,  164.8, 329.6, 207.7, 415.3,
      110.0, 220.0, 130.8, 164.8,  174.6, 164.8, 110.0, 220.0,
    ],
  },
];

export function startBackgroundMusic(stageNumber = 1) {
  bgmStage = Math.max(1, stageNumber);
  bgmActive = true;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }

  if (!bgmGainNode) {
    bgmGainNode = ctx.createGain();
    bgmGainNode.connect(ctx.destination);
  }
  bgmGainNode.gain.setValueAtTime(muted ? 0 : 0.22, ctx.currentTime);

  const themeIndex = (bgmStage - 1) % STAGE_MUSIC_THEMES.length;
  const currentTheme = STAGE_MUSIC_THEMES[themeIndex];
  const bpm = currentTheme.bpm;
  const stepDurationMs = ((60 / bpm) / 4) * 1000;
  let nextNoteTime = ctx.currentTime + 0.05;

  bgmTimer = setInterval(() => {
    if (!bgmActive) return;
    const now = ctx.currentTime;

    while (nextNoteTime < now + 0.15) {
      const step = bgmStep % 64;
      const stepTime = nextNoteTime;
      const stepDurationSec = stepDurationMs / 1000;

      // 1. Lead Channel (Current Theme synth timbre and filter frequency)
      const leadFreq = currentTheme.leadMelody[step];
      if (leadFreq > 0) {
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        const leadFilter = ctx.createBiquadFilter();

        leadOsc.type = currentTheme.leadTimbre;
        leadOsc.frequency.setValueAtTime(leadFreq, stepTime);

        leadFilter.type = 'lowpass';
        leadFilter.frequency.setValueAtTime(currentTheme.filterFreq, stepTime);

        leadGain.gain.setValueAtTime(currentTheme.leadTimbre === 'sawtooth' ? 0.075 : 0.09, stepTime);
        leadGain.gain.exponentialRampToValueAtTime(0.001, stepTime + stepDurationSec * 0.88);

        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(bgmGainNode);

        leadOsc.start(stepTime);
        leadOsc.stop(stepTime + stepDurationSec * 0.9);
      }

      // 2. Bass Channel (Current Theme bass timbre and notes, 8th notes on even steps)
      if (step % 2 === 0) {
        const bassIndex = (step / 2) % 32;
        const bassFreq = currentTheme.bassLine[bassIndex];
        if (bassFreq > 0) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();

          bassOsc.type = currentTheme.bassTimbre;
          bassOsc.frequency.setValueAtTime(bassFreq, stepTime);

          bassGain.gain.setValueAtTime(currentTheme.bassTimbre === 'sawtooth' ? 0.18 : 0.24, stepTime);
          bassGain.gain.exponentialRampToValueAtTime(0.01, stepTime + stepDurationSec * 1.8);

          bassOsc.connect(bassGain);
          bassGain.connect(bgmGainNode);

          bassOsc.start(stepTime);
          bassOsc.stop(stepTime + stepDurationSec * 1.9);
        }
      }

      // 3. Percussion Channel
      // Hi-Hat on even steps (with syncopation on later stages)
      if (step % 2 === 0 || (currentTheme.stageNumber >= 4 && step % 4 === 3)) {
        const noiseBuf = createNoiseBuffer(ctx, 0.03);
        const hatSource = ctx.createBufferSource();
        hatSource.buffer = noiseBuf;

        const hatFilter = ctx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(7000, stepTime);

        const hatGain = ctx.createGain();
        hatGain.gain.setValueAtTime(0.035, stepTime);
        hatGain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.025);

        hatSource.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(bgmGainNode);

        hatSource.start(stepTime);
        hatSource.stop(stepTime + 0.03);
      }

      // Snappy Snare on beats 2 and 4 (plus boss breaks on stage 6)
      if (step % 8 === 4 || (currentTheme.stageNumber === 6 && step % 16 === 14)) {
        const snareBuf = createNoiseBuffer(ctx, 0.08);
        const snareSource = ctx.createBufferSource();
        snareSource.buffer = snareBuf;

        const snareFilter = ctx.createBiquadFilter();
        snareFilter.type = 'bandpass';
        snareFilter.frequency.setValueAtTime(1400, stepTime);
        snareFilter.Q.setValueAtTime(1.2, stepTime);

        const snareGain = ctx.createGain();
        snareGain.gain.setValueAtTime(0.12, stepTime);
        snareGain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.07);

        snareSource.connect(snareFilter);
        snareFilter.connect(snareGain);
        snareGain.connect(bgmGainNode);

        snareSource.start(stepTime);
        snareSource.stop(stepTime + 0.08);

        // Body pop
        const popOsc = ctx.createOscillator();
        const popGain = ctx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(180, stepTime);
        popOsc.frequency.exponentialRampToValueAtTime(45, stepTime + 0.06);

        popGain.gain.setValueAtTime(0.14, stepTime);
        popGain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.06);

        popOsc.connect(popGain);
        popGain.connect(bgmGainNode);
        popOsc.start(stepTime);
        popOsc.stop(stepTime + 0.07);
      }

      nextNoteTime += stepDurationSec;
      bgmStep += 1;
    }
  }, 25);
}

export function stopBackgroundMusic() {
  bgmActive = false;
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
  if (bgmGainNode && audioCtx) {
    try {
      bgmGainNode.gain.setValueAtTime(bgmGainNode.gain.value, audioCtx.currentTime);
      bgmGainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }
}

/**
 * Synthesizes the 4-phase, 5.2-second Pennywise demise cutscene audio:
 * Phase 1 (0.35s, 0.75s, 1.15s): 3 cartoon balloon pops with sparkle chimes.
 * Phase 2 (1.4s - 2.8s): Laser seal convergence hum & crackling Deadlights overload sweep.
 * Phase 3 (2.8s - 4.1s): Deep descending abyssal vortex implosion whoosh (320Hz -> 28Hz).
 * Phase 4 (4.0s - 5.2s): Triumphant 8-bit Pokémon Hall-of-Fame Champion Fanfare chord progression!
 */
export function playVictoryCelebrationSfx() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // -------------------------------------------------------------
  // Phase 1: 3 Cartoon Balloon Pops & Sparkle Chimes
  // -------------------------------------------------------------
  const balloonPops = [
    { delay: 0.35, popFreq: 640, chimes: [1318.51, 1975.53] }, // E6, B6
    { delay: 0.75, popFreq: 720, chimes: [1567.98, 2349.32] }, // G6, D7
    { delay: 1.15, popFreq: 820, chimes: [2093.00, 3135.96] }, // C7, G7
  ];

  balloonPops.forEach(({ delay, popFreq, chimes }) => {
    const popStart = now + delay;

    // Snappy balloon pop pitch-drop oscillator
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sawtooth';
    popOsc.frequency.setValueAtTime(popFreq, popStart);
    popOsc.frequency.exponentialRampToValueAtTime(55, popStart + 0.055);

    popGain.gain.setValueAtTime(0.26, popStart);
    popGain.gain.exponentialRampToValueAtTime(0.001, popStart + 0.06);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(popStart);
    popOsc.stop(popStart + 0.065);

    // Noise pop click
    try {
      const noiseBuf = createNoiseBuffer(ctx, 0.04);
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuf;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1400, popStart);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, popStart);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, popStart + 0.04);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseNode.start(popStart);
      noiseNode.stop(popStart + 0.045);
    } catch {
      // Audio buffer creation fallback
    }

    // Sparkle chimes
    chimes.forEach((freq, idx) => {
      const chimeStart = popStart + idx * 0.02;
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, chimeStart);

      chimeGain.gain.setValueAtTime(0.001, chimeStart);
      chimeGain.gain.linearRampToValueAtTime(0.14, chimeStart + 0.015);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, chimeStart + 0.24);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(chimeStart);
      chimeOsc.stop(chimeStart + 0.25);
    });
  });

  // -------------------------------------------------------------
  // Phase 2: Laser Seal Convergence Hum & Deadlights Overload (1.4s - 2.8s)
  // -------------------------------------------------------------
  const laserStart = now + 1.4;
  const laserDur = 1.4; // 1.4s to 2.8s

  // Sweeping laser convergence carrier
  const laserOsc = ctx.createOscillator();
  const laserFilter = ctx.createBiquadFilter();
  const laserGain = ctx.createGain();

  laserOsc.type = 'sawtooth';
  laserOsc.frequency.setValueAtTime(220, laserStart);
  laserOsc.frequency.exponentialRampToValueAtTime(880, laserStart + laserDur);

  laserFilter.type = 'bandpass';
  laserFilter.Q.setValueAtTime(5.0, laserStart);
  laserFilter.frequency.setValueAtTime(450, laserStart);
  laserFilter.frequency.exponentialRampToValueAtTime(2600, laserStart + laserDur);

  laserGain.gain.setValueAtTime(0.001, laserStart);
  laserGain.gain.linearRampToValueAtTime(0.24, laserStart + 0.2);
  laserGain.gain.setValueAtTime(0.22, laserStart + laserDur * 0.8);
  laserGain.gain.exponentialRampToValueAtTime(0.001, laserStart + laserDur);

  laserOsc.connect(laserFilter);
  laserFilter.connect(laserGain);
  laserGain.connect(ctx.destination);
  laserOsc.start(laserStart);
  laserOsc.stop(laserStart + laserDur + 0.05);

  // Deadlights crackling overload sweep
  const crackleOsc = ctx.createOscillator();
  const crackleGain = ctx.createGain();
  crackleOsc.type = 'square';
  crackleOsc.frequency.setValueAtTime(330, laserStart);
  crackleOsc.frequency.linearRampToValueAtTime(1100, laserStart + laserDur);

  crackleGain.gain.setValueAtTime(0.001, laserStart);
  crackleGain.gain.linearRampToValueAtTime(0.09, laserStart + 0.4);
  crackleGain.gain.exponentialRampToValueAtTime(0.001, laserStart + laserDur);

  crackleOsc.connect(crackleGain);
  crackleGain.connect(ctx.destination);
  crackleOsc.start(laserStart);
  crackleOsc.stop(laserStart + laserDur + 0.05);

  // -------------------------------------------------------------
  // Phase 3: Deep Descending Abyssal Vortex Implosion (2.8s - 4.1s)
  // -------------------------------------------------------------
  const vortexStart = now + 2.8;
  const vortexDur = 1.35; // 2.8s to 4.15s

  const vortexOsc = ctx.createOscillator();
  const vortexFilter = ctx.createBiquadFilter();
  const vortexGain = ctx.createGain();

  vortexOsc.type = 'sawtooth';
  // Plunge 320Hz down to 28Hz
  vortexOsc.frequency.setValueAtTime(320, vortexStart);
  vortexOsc.frequency.exponentialRampToValueAtTime(28, vortexStart + vortexDur);

  vortexFilter.type = 'lowpass';
  vortexFilter.Q.setValueAtTime(4.2, vortexStart);
  vortexFilter.frequency.setValueAtTime(850, vortexStart);
  vortexFilter.frequency.exponentialRampToValueAtTime(45, vortexStart + vortexDur);

  vortexGain.gain.setValueAtTime(0.001, vortexStart);
  vortexGain.gain.linearRampToValueAtTime(0.38, vortexStart + 0.12);
  vortexGain.gain.setValueAtTime(0.32, vortexStart + vortexDur * 0.7);
  vortexGain.gain.exponentialRampToValueAtTime(0.001, vortexStart + vortexDur);

  vortexOsc.connect(vortexFilter);
  vortexFilter.connect(vortexGain);
  vortexGain.connect(ctx.destination);
  vortexOsc.start(vortexStart);
  vortexOsc.stop(vortexStart + vortexDur + 0.05);

  // Abyssal sub-bass suction foundation
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(90, vortexStart);
  subOsc.frequency.exponentialRampToValueAtTime(24, vortexStart + vortexDur);

  subGain.gain.setValueAtTime(0.001, vortexStart);
  subGain.gain.linearRampToValueAtTime(0.34, vortexStart + 0.15);
  subGain.gain.exponentialRampToValueAtTime(0.001, vortexStart + vortexDur);

  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(vortexStart);
  subOsc.stop(vortexStart + vortexDur + 0.05);

  // -------------------------------------------------------------
  // Phase 4: Triumphant 8-bit Pokémon Champion Fanfare (4.0s - 5.2s+)
  // -------------------------------------------------------------
  const fanfareNotes = [
    // Triplet lead-in on C5
    { freq: 523.25, bassFreq: 261.63, delay: 4.00, dur: 0.11 }, // C5
    { freq: 523.25, bassFreq: 261.63, delay: 4.14, dur: 0.11 }, // C5
    { freq: 523.25, bassFreq: 261.63, delay: 4.28, dur: 0.11 }, // C5
    // Sustained C chord
    { freq: 659.25, bassFreq: 261.63, delay: 4.42, dur: 0.26 }, // E5
    // Turnaround chords
    { freq: 622.25, bassFreq: 207.65, delay: 4.70, dur: 0.16 }, // Eb5 / Ab3
    { freq: 698.46, bassFreq: 233.08, delay: 4.88, dur: 0.18 }, // F5 / Bb3
    // Apex Grand Triumph Octave Chord
    { freq: 1046.50, bassFreq: 523.25, delay: 5.08, dur: 0.70 }, // C6 & C5 ring-out
  ];

  fanfareNotes.forEach(({ freq, bassFreq, delay, dur }) => {
    const noteStart = now + delay;

    // Lead voice: square wave
    const leadOsc = ctx.createOscillator();
    const leadGain = ctx.createGain();
    leadOsc.type = 'square';
    leadOsc.frequency.setValueAtTime(freq, noteStart);

    leadGain.gain.setValueAtTime(0.001, noteStart);
    leadGain.gain.linearRampToValueAtTime(0.18, noteStart + 0.015);
    leadGain.gain.setValueAtTime(0.16, noteStart + dur * 0.75);
    leadGain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

    leadOsc.connect(leadGain);
    leadGain.connect(ctx.destination);
    leadOsc.start(noteStart);
    leadOsc.stop(noteStart + dur + 0.02);

    // Bass / harmony voice: triangle wave
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassFreq, noteStart);

    bassGain.gain.setValueAtTime(0.001, noteStart);
    bassGain.gain.linearRampToValueAtTime(0.14, noteStart + 0.015);
    bassGain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start(noteStart);
    bassOsc.stop(noteStart + dur + 0.02);
  });
}

