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

// ── 8-BIT CHIPTUNE MUSIC SEQUENCER (POKÉMON BATTLE X CARNIVAL) ──────────

// 64-step melody pattern in C Minor / Phrygian Dominant with carnival chromaticism
const LEAD_MELODY_64 = [
  // Phrase 1 (0-15)
  261.6, 311.1, 392.0, 523.3,  493.9, 392.0, 311.1, 293.7,
  261.6, 311.1, 392.0, 415.3,  392.0, 349.2, 311.1, 293.7,
  // Phrase 2 (16-31)
  261.6, 392.0, 523.3, 622.3,  587.3, 523.3, 493.9, 392.0,
  415.3, 523.3, 493.9, 415.3,  392.0, 370.0, 392.0, 493.9,
  // Phrase 3 (32-47)
  523.3, 392.0, 311.1, 392.0,  415.3, 523.3, 587.3, 622.3,
  587.3, 523.3, 493.9, 523.3,  587.3, 493.9, 392.0, 349.2,
  // Phrase 4 (48-63) - Eerie carnival turnaround
  311.1, 349.2, 370.0, 392.0,  415.3, 392.0, 370.0, 349.2,
  311.1, 293.7, 246.9, 293.7,  261.6, 196.0, 261.6, 0,
];

// 32-step bassline (played on 8th notes, steps 0, 2, 4...)
const BASS_LINE_32 = [
  // Bar 1
  65.4, 130.8, 65.4, 130.8,  77.8, 155.6, 98.0, 196.0,
  // Bar 2
  65.4, 130.8, 65.4, 130.8,  103.8, 207.6, 98.0, 196.0,
  // Bar 3
  87.3, 174.6, 87.3, 174.6,  98.0, 196.0, 123.5, 246.9,
  // Bar 4
  65.4, 130.8, 77.8, 98.0,   103.8, 98.0, 65.4, 130.8,
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

  // Speed: 160 BPM base + 4 BPM per stage
  const bpm = 160 + (bgmStage - 1) * 4;
  const stepDurationMs = ((60 / bpm) / 4) * 1000;
  let nextNoteTime = ctx.currentTime + 0.05;

  bgmTimer = setInterval(() => {
    if (!bgmActive) return;
    const now = ctx.currentTime;

    while (nextNoteTime < now + 0.15) {
      const step = bgmStep % 64;
      const stepTime = nextNoteTime;
      const stepDurationSec = stepDurationMs / 1000;

      // 1. Lead Channel (Square Wave)
      const leadFreq = LEAD_MELODY_64[step];
      if (leadFreq > 0) {
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        const leadFilter = ctx.createBiquadFilter();

        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(leadFreq, stepTime);

        leadFilter.type = 'lowpass';
        leadFilter.frequency.setValueAtTime(2600, stepTime);

        leadGain.gain.setValueAtTime(0.09, stepTime);
        leadGain.gain.exponentialRampToValueAtTime(0.001, stepTime + stepDurationSec * 0.88);

        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(bgmGainNode);

        leadOsc.start(stepTime);
        leadOsc.stop(stepTime + stepDurationSec * 0.9);
      }

      // 2. Bass Channel (Triangle Wave, 8th notes on even steps)
      if (step % 2 === 0) {
        const bassIndex = (step / 2) % 32;
        const bassFreq = BASS_LINE_32[bassIndex];
        if (bassFreq > 0) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();

          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(bassFreq, stepTime);

          bassGain.gain.setValueAtTime(0.24, stepTime);
          bassGain.gain.exponentialRampToValueAtTime(0.01, stepTime + stepDurationSec * 1.8);

          bassOsc.connect(bassGain);
          bassGain.connect(bgmGainNode);

          bassOsc.start(stepTime);
          bassOsc.stop(stepTime + stepDurationSec * 1.9);
        }
      }

      // 3. Percussion Channel
      // Hi-Hat on every 8th note (even steps)
      if (step % 2 === 0) {
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

      // Snappy Snare on beats 2 and 4 (steps 4, 12, 20, 28, 36, 44, 52, 60)
      if (step % 8 === 4) {
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
