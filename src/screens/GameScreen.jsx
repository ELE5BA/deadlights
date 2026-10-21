import { useCallback, useEffect, useRef, useState } from 'react';
import { GAME_CONFIG } from '../../shared/gameConfig.js';
import GameCanvas from '../game/GameCanvas.jsx';
import PokedexCardArt from '../components/PokedexCardArt.jsx';
import { finishSession, startSession } from '../services/apiClient.js';
import {
  isMuted,
  toggleMute,
  subscribeMuteChange,
  playCountdownSfx,
  playButtonClickSfx,
} from '../game/soundEffects.js';
import { POKEMON_CARD_ROSTER } from '../game/GameEngine.js';

/**
 * Miniature cartoon sprite for the 6 stage-specific Pokémon
 */
function StagePokemonMiniSprite({ stageNumber }) {
  const stg = ((stageNumber - 1) % 6) + 1;
  switch (stg) {
    case 1: // Bulba-Moss
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="mini-stage-sprite">
          <path d="M12 3 C16 3 20 8 18 16 C16 20 8 20 6 16 C4 8 8 3 12 3 Z" fill="#10b981" stroke="#120b1d" strokeWidth="1.6" />
          <path d="M12 4 Q15 9 12 14 Q9 9 12 4 Z" fill="#34d399" />
          <circle cx="9" cy="13" r="1.5" fill="#120b1d" />
          <circle cx="15" cy="13" r="1.5" fill="#120b1d" />
        </svg>
      );
    case 2: // Pika-Lantern
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="mini-stage-sprite">
          <path d="M7 8 L3 2 L8 5 Z" fill="#f59e0b" stroke="#120b1d" strokeWidth="1.4" />
          <path d="M17 8 L21 2 L16 5 Z" fill="#f59e0b" stroke="#120b1d" strokeWidth="1.4" />
          <circle cx="12" cy="13" r="7" fill="#fbbf24" stroke="#120b1d" strokeWidth="1.6" />
          <circle cx="8" cy="14" r="1.6" fill="#ef4444" />
          <circle cx="16" cy="14" r="1.6" fill="#ef4444" />
          <circle cx="10" cy="12" r="1.2" fill="#120b1d" />
          <circle cx="14" cy="12" r="1.2" fill="#120b1d" />
        </svg>
      );
    case 3: // Zap-Venomoth
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="mini-stage-sprite">
          <path d="M12 12 C6 6 3 9 5 15 C7 19 11 15 12 12 Z" fill="#38bdf8" stroke="#120b1d" strokeWidth="1.4" />
          <path d="M12 12 C18 6 21 9 19 15 C17 19 13 15 12 12 Z" fill="#38bdf8" stroke="#120b1d" strokeWidth="1.4" />
          <ellipse cx="12" cy="13" rx="2.5" ry="5" fill="#0284c7" stroke="#120b1d" strokeWidth="1.4" />
          <circle cx="10" cy="11" r="1.2" fill="#fef08a" />
          <circle cx="14" cy="11" r="1.2" fill="#fef08a" />
        </svg>
      );
    case 4: // Gengar-Wisp
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="mini-stage-sprite">
          <path d="M6 9 L4 3 L9 6 Z" fill="#7e22ce" stroke="#120b1d" strokeWidth="1.4" />
          <path d="M18 9 L20 3 L15 6 Z" fill="#7e22ce" stroke="#120b1d" strokeWidth="1.4" />
          <circle cx="12" cy="13" r="7" fill="#c084fc" stroke="#120b1d" strokeWidth="1.6" />
          <path d="M8 11 L11 12 L9 13 Z" fill="#dc2626" />
          <path d="M16 11 L13 12 L15 13 Z" fill="#dc2626" />
          <path d="M9 15 Q12 18 15 15 Z" fill="#ffffff" stroke="#120b1d" strokeWidth="1.0" />
        </svg>
      );
    case 5: // Corvi-Gear
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="mini-stage-sprite">
          <circle cx="12" cy="12" r="7" fill="#64748b" stroke="#120b1d" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3.2" fill="#f59e0b" stroke="#120b1d" strokeWidth="1.2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#120b1d" strokeWidth="1.8" />
          <path d="M9 10 L15 7 L12 14 Z" fill="#94a3b8" />
        </svg>
      );
    case 6: // Gyarados-Fin
    default:
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="mini-stage-sprite">
          <path d="M12 2 L15 9 L20 8 L16 13 L19 19 L12 15 L5 19 L8 13 L4 8 L9 9 Z" fill="#06b6d4" stroke="#120b1d" strokeWidth="1.6" />
          <circle cx="10" cy="12" r="1.3" fill="#dc2626" />
          <circle cx="14" cy="12" r="1.3" fill="#dc2626" />
          <path d="M10 14 Q12 16 14 14" stroke="#ffffff" strokeWidth="1.2" />
        </svg>
      );
  }
}

/**
 * Custom Bespoke Cartoon-Outlined Poké-Heart SVG
 * Shaped like a heart-styled Pokéball with comic ink outlines, pulsing at 1 HP.
 */
function PokeHeartSvg({ active, isCritical }) {
  if (!active) {
    return (
      <svg
        className="poke-heart poke-heart--depleted"
        viewBox="0 0 28 28"
        width="28"
        height="28"
        aria-hidden="true"
      >
        <path
          d="M14 24 C14 24 3 17 3 9 C3 5 6 2 10 2 C12 2 13.5 3 14 4.5 C14.5 3 16 2 18 2 C22 2 25 5 25 9 C25 17 14 24 14 24 Z"
          fill="#27272a"
          stroke="#120b1d"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M3 10.5 H25" stroke="#120b1d" strokeWidth="2.0" />
        <circle cx="14" cy="10.5" r="3.2" fill="#3f3f46" stroke="#120b1d" strokeWidth="2.0" />
      </svg>
    );
  }

  return (
    <svg
      className={`poke-heart poke-heart--active ${isCritical ? 'poke-heart--pulse' : ''}`}
      viewBox="0 0 28 28"
      width="28"
      height="28"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="topHeartHalf">
          <rect x="0" y="0" width="28" height="10.5" />
        </clipPath>
      </defs>
      {/* Base white heart with thick ink outline */}
      <path
        d="M14 24 C14 24 3 17 3 9 C3 5 6 2 10 2 C12 2 13.5 3 14 4.5 C14.5 3 16 2 18 2 C22 2 25 5 25 9 C25 17 14 24 14 24 Z"
        fill="#f8fafc"
        stroke="#120b1d"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Top red hemisphere */}
      <path
        d="M14 24 C14 24 3 17 3 9 C3 5 6 2 10 2 C12 2 13.5 3 14 4.5 C14.5 3 16 2 18 2 C22 2 25 5 25 9 C25 17 14 24 14 24 Z"
        fill="#ef4444"
        clipPath="url(#topHeartHalf)"
      />
      {/* Dividing belt */}
      <path d="M3 10.5 H25" stroke="#120b1d" strokeWidth="2.6" />
      {/* Center Pokéball button */}
      <circle cx="14" cy="10.5" r="3.5" fill="#f8fafc" stroke="#120b1d" strokeWidth="2.2" />
      <circle cx="14" cy="10.5" r="1.3" fill="#120b1d" />
    </svg>
  );
}

/**
 * Custom Bespoke Faceted SVG Rift Shard
 */
function FacetedRiftShardSvg() {
  return (
    <svg className="rift-shard-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M12 2L5 9l7 13 7-13-7-7z" fill="url(#shardGradGame)" stroke="#120b1d" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M12 2v20M5 9h14M12 9l-4 7m4-7l4 7" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.0" />
      <defs>
        <linearGradient id="shardGradGame" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="0.5" stopColor="#0891b2" />
          <stop offset="1" stopColor="#0c4a6e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const PENNYWISE_LINES = [
  'WE ALL FLOAT DOWN HERE... EVEN YOUR POKÉMON!',
  "GOTTA CATCH 'EM ALL? I'LL CATCH YOU FIRST!",
  'TAKE A POKÉ-BALLOON, RUNNER... IT FLOATS!',
  "YOUR POKÉDEX CAN'T SAVE YOU FROM THE DEADLIGHTS!",
  "HEE-HEE! MISS ONE CARD AND YOU'RE MINE!",
];

export const PENNYWISE_DEMISE_LINES = [
  "WHAT?! ALL SIX POKÉDEX CARDS?! MY BALLOONS ARE POPPING!",
  "NOOO! THE HEXEDEX SEAL IS SHATTERING MY DEADLIGHTS!",
  "THE ABYSS IS PULLING ME UNDER... I'M FADING INTO DARKNESSSS!",
];

function formatDialogue(text) {
  const keywords = [
    'FLOAT', 'POKÉMON', 'CATCH', 'POKÉ-BALLOON', 'POKÉDEX', 'DEADLIGHTS', 'MINE!',
    'CARDS?!', 'BALLOONS', 'POPPING!', 'HEXEDEX', 'SEAL', 'SHATTERING', 'ABYSS', 'DARKNESSSS!'
  ];
  const parts = text.split(/(\b[A-ZÉ\-'!?]+\b)/g);
  return parts.map((part, idx) => {
    const clean = part.replace(/[!,?]/g, '');
    const isSpecial = keywords.some((k) => k.includes(clean) && clean.length > 3);
    return isSpecial ? (
      <strong key={idx} className="bubble-accent">
        {part}
      </strong>
    ) : (
      part
    );
  });
}

export default function GameScreen({ player, onFinished, runnerId }) {
  const engineRef = useRef(null);
  const stageProgressRef = useRef(null);
  const speechBubbleRef = useRef(null);

  const [engineState, setEngineState] = useState({
    lane: 1,
    jumping: false,
    paused: false,
    health: 5,
    maxHealth: 5,
    shards: 0,
    score: 0,
    elapsedSeconds: 0,
    stageNumber: 1,
    totalStages: 6,
    stageName: 'The Twilight Mist',
    stageElapsedSeconds: 0,
    stageDurationSeconds: 60,
    stagesCleared: 0,
    stageCardsCollected: 0,
    cardsRequiredPerStage: 5,
    fragmentsCollected: 0,
    victorySequenceActive: false,
  });

  const [soundMuted, setSoundMuted] = useState(() => isMuted());
  const [completedCardModal, setCompletedCardModal] = useState(null);
  const [lossModal, setLossModal] = useState(null);
  const [jumpscareActive, setJumpscareActive] = useState(false);
  const [sessionState, setSessionState] = useState('starting');
  const [countdown, setCountdown] = useState(3);
  const [session, setSession] = useState(null);
  const [pendingSummary, setPendingSummary] = useState(null);
  const [reducedEffects, setReducedEffects] = useState(() => localStorage.getItem('deadlights.reducedEffects') === 'true');
  const [runToken, setRunToken] = useState(() => crypto.randomUUID());
  const [dialogueIndex, setDialogueIndex] = useState(() => Math.floor(Math.random() * PENNYWISE_LINES.length));
  const [dialoguePhase, setDialoguePhase] = useState('visible');
  const [flyingCardAnim, setFlyingCardAnim] = useState(null);
  const [recentDockSlot, setRecentDockSlot] = useState(null);
  const [savedRunResult, setSavedRunResult] = useState(null);

  // Demise Cutscene Phase Tracking (0.0s to 5.2s)
  const [demiseCutscene, setDemiseCutscene] = useState({
    lineIndex: 0,
    visible: true,
    isGrandChampion: false,
  });
  const demiseCutsceneRef = useRef(demiseCutscene);
  demiseCutsceneRef.current = demiseCutscene;

  const dialoguePhaseRef = useRef(dialoguePhase);
  dialoguePhaseRef.current = dialoguePhase;
  const speechPosRef = useRef({ x: 60, y: 25 });

  useEffect(() => {
    return subscribeMuteChange(setSoundMuted);
  }, []);

  // Randomized Pennywise cartoon dialogue with smooth pop-in, pop-out, and periodic silence gaps
  useEffect(() => {
    if (sessionState !== 'playing' || engineState.paused || jumpscareActive || completedCardModal || lossModal || engineState.victorySequenceActive) {
      setDialoguePhase('hidden');
      return undefined;
    }

    let timer = null;

    if (dialoguePhase === 'visible') {
      // Stay visible for 3.8s before smooth exit animation
      timer = window.setTimeout(() => {
        setDialoguePhase('exiting');
      }, 3800);
    } else if (dialoguePhase === 'exiting') {
      // Exit animation runs for 350ms, then becomes hidden
      timer = window.setTimeout(() => {
        setDialoguePhase('hidden');
      }, 350);
    } else if (dialoguePhase === 'hidden') {
      // Periodic silence interval (disappeared for 2.6s - 3.4s) before popping in with a random new line
      const silenceMs = 2600 + Math.floor(Math.random() * 800);
      timer = window.setTimeout(() => {
        setDialogueIndex((prev) => {
          const pool = [0, 1, 2, 3, 4].filter((i) => i !== prev);
          return pool[Math.floor(Math.random() * pool.length)];
        });
        setDialoguePhase('visible');
      }, silenceMs);
    }

    return () => window.clearTimeout(timer);
  }, [sessionState, engineState.paused, jumpscareActive, completedCardModal, lossModal, dialoguePhase, engineState.victorySequenceActive]);

  // 60FPS DOM Progress Bar & 3D Pursuer Speech Bubble tracking
  const onEngine = useCallback((engine) => {
    engineRef.current = engine;
    engine.onFrameTick = ({ stageProgressRatio, pursuerSpeechPos, victoryElapsedMs }) => {
      if (stageProgressRef.current) {
        stageProgressRef.current.style.transform = `scaleX(${stageProgressRatio})`;
      }
      if (pursuerSpeechPos && dialoguePhaseRef.current === 'visible') {
        const clampedX = Math.max(10, Math.min(84, pursuerSpeechPos.xPercent));
        const clampedY = Math.max(8, Math.min(76, pursuerSpeechPos.yPercent));
        speechPosRef.current.x += (clampedX - speechPosRef.current.x) * 0.25;
        speechPosRef.current.y += (clampedY - speechPosRef.current.y) * 0.25;
        if (speechBubbleRef.current) {
          speechBubbleRef.current.style.left = `${speechPosRef.current.x.toFixed(2)}%`;
          speechBubbleRef.current.style.top = `${speechPosRef.current.y.toFixed(2)}%`;
        }
      }
      if (typeof victoryElapsedMs === 'number') {
        const curr = demiseCutsceneRef.current;
        let nextLine = 0;
        if (victoryElapsedMs >= 2800) {
          nextLine = 2;
        } else if (victoryElapsedMs >= 1400) {
          nextLine = 1;
        }
        const nextVisible = victoryElapsedMs < 4100;
        const nextChampion = victoryElapsedMs >= 4000;

        if (
          nextLine !== curr.lineIndex ||
          nextVisible !== curr.visible ||
          nextChampion !== curr.isGrandChampion
        ) {
          setDemiseCutscene({
            lineIndex: nextLine,
            visible: nextVisible,
            isGrandChampion: nextChampion,
          });
        }
      }
    };
  }, []);

  const onStateChange = useCallback((next) => {
    setEngineState((current) => {
      if (next.cardPickup) {
        const slot = next.stageCardsCollected;
        setFlyingCardAnim({
          id: Date.now(),
          slot,
          cardName: next.cardPickup.cardName,
          cardColor: next.cardPickup.cardColor,
        });
        setRecentDockSlot(slot);
        setTimeout(() => setRecentDockSlot(null), 850);
        setTimeout(() => setFlyingCardAnim(null), 850);
      }
      if (next.stageCompletedCard) {
        setCompletedCardModal(next.stageCompletedCard);
        engineRef.current?.pause();
      }
      if (next.jumpscareActive) {
        setJumpscareActive(true);
      }
      return { ...current, ...next };
    });
  }, []);

  const playerId = player?.playerId;

  const startNewRun = useCallback((token) => {
    if (!playerId) return;
    setSessionState('starting');
    setLossModal(null);
    setCompletedCardModal(null);
    setJumpscareActive(false);
    setSavedRunResult(null);
    startSession(playerId, token, GAME_CONFIG.version)
      .then((data) => {
        setSession(data);
        setSessionState('countdown');
      })
      .catch(() => setSessionState('error'));
  }, [playerId]);

  useEffect(() => {
    if (!playerId) return;
    startNewRun(runToken);
  }, [runToken, playerId, startNewRun]);

  useEffect(() => {
    if (sessionState !== 'countdown') return undefined;
    setCountdown(3);
    playCountdownSfx(3);
    const interval = window.setInterval(() => {
      setCountdown((value) => {
        const nextVal = value - 1;
        playCountdownSfx(nextVal);
        return nextVal;
      });
    }, 1000);
    const startTimer = window.setTimeout(() => {
      window.clearInterval(interval);
      setSessionState('playing');
      engineRef.current?.start();
    }, 3000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(startTimer);
    };
  }, [sessionState]);

  const submitSummary = useCallback(async (summary) => {
    if (!session) return;
    setSessionState('saving');
    try {
      const result = await finishSession(session.sessionId, { runToken, ...summary });
      onFinished(result);
    } catch {
      setSessionState('save_error');
    }
  }, [session, runToken, onFinished]);

  const persistRunQuietly = useCallback(async (summary) => {
    if (!session) return null;
    try {
      const result = await finishSession(session.sessionId, { runToken, ...summary });
      setSavedRunResult(result);
      return result;
    } catch {
      setSessionState('save_error');
      return null;
    }
  }, [session, runToken]);

  const onRunEnd = useCallback((summary) => {
    setPendingSummary(summary);
    setJumpscareActive(false);

    const isLoss = ['card_missed', 'hit_points_zero', 'time_limit'].includes(summary.endReason);
    if (isLoss) {
      setLossModal({
        reason: summary.endReason,
        stage: engineState.stageNumber,
        collected: engineState.stageCardsCollected,
        required: engineState.cardsRequiredPerStage,
        summary,
      });
      persistRunQuietly(summary);
    } else {
      submitSummary(summary);
    }
  }, [engineState.stageNumber, engineState.stageCardsCollected, engineState.cardsRequiredPerStage, persistRunQuietly, submitSummary]);

  const restartRun = useCallback(() => {
    playButtonClickSfx();
    setLossModal(null);
    setCompletedCardModal(null);
    setJumpscareActive(false);
    const nextToken = crypto.randomUUID();
    setRunToken(nextToken);
  }, []);

  const dismissCardModal = useCallback(() => {
    playButtonClickSfx();
    const stageNum = completedCardModal?.stageNumber || 1;
    setCompletedCardModal(null);
    if (stageNum >= (GAME_CONFIG.stageCount || 6)) {
      engineRef.current?.triggerVictorySequence();
    } else {
      engineRef.current?.resume();
    }
  }, [completedCardModal]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lossModal && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        restartRun();
      } else if (completedCardModal && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault();
        dismissCardModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lossModal, completedCardModal, restartRun, dismissCardModal]);

  const endRun = () => {
    playButtonClickSfx();
    engineRef.current?.finish('player_exit');
  };

  const toggleEffects = () => {
    playButtonClickSfx();
    setReducedEffects((current) => {
      const next = !current;
      localStorage.setItem('deadlights.reducedEffects', String(next));
      return next;
    });
  };

  // Interactive 3D Perspective Tilt for Card Modal
  function handleModalCardMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty('--card-rx', `${-y * 22}deg`);
    e.currentTarget.style.setProperty('--card-ry', `${x * 22}deg`);
    e.currentTarget.style.setProperty('--glare-x', `${(x + 0.5) * 100}%`);
    e.currentTarget.style.setProperty('--glare-y', `${(y + 0.5) * 100}%`);
  }

  function handleModalCardMouseLeave(e) {
    e.currentTarget.style.setProperty('--card-rx', '0deg');
    e.currentTarget.style.setProperty('--card-ry', '0deg');
    e.currentTarget.style.setProperty('--glare-x', '50%');
    e.currentTarget.style.setProperty('--glare-y', '50%');
  }

  const stageSecondsRemaining = Math.max(0, Math.ceil((engineState.stageDurationSeconds || 60) - (engineState.stageElapsedSeconds || 0)));
  const maxHp = engineState.maxHealth || 3;
  const currentHp = Math.max(0, Math.min(maxHp, engineState.health));
  const isHeartCritical = currentHp === 1;
  const cardsReq = engineState.cardsRequiredPerStage || 5;
  const cardsGot = Math.min(cardsReq, engineState.stageCardsCollected || 0);

  // Auto-fade bottom tutorial after 6s in Stage 1
  const isTutorialFaded = sessionState === 'playing' && (engineState.stageNumber > 1 || engineState.stageElapsedSeconds > 6);

  // 6-digit padded score odometer
  const paddedScore = String(engineState.score || 0).padStart(6, '0');

  // Strict UI layer mutual exclusion so HUD/dialogs never bleed through each other
  const hasActiveModalOrCutscene = Boolean(
    completedCardModal ||
    lossModal ||
    jumpscareActive ||
    engineState.victorySequenceActive ||
    engineState.paused ||
    sessionState === 'countdown'
  );

  return (
    <main className="game-screen">
      <GameCanvas
        onEngine={onEngine}
        onStateChange={onStateChange}
        onRunEnd={onRunEnd}
        reducedEffects={reducedEffects}
        runnerId={runnerId}
      />

      {/* ── UNOBSTRUCTED PERIPHERAL HUD (PENNYWISE 100% UNBLOCKED IN TOP SKY) ── */}

      {/* 1. TOP-LEFT CARTOON PLATE (Hidden during victory sequence & jumpscare) */}
      {!engineState.victorySequenceActive && !jumpscareActive && (
        <aside className="hud-corner-plate hud-plate-left" aria-label="Stage Progress and Vitality">
          {/* Top Row: Stage Badge, Name, Timer, and 60FPS Bar */}
          <div className="hud-stage-row">
            <span className="hud-stage-badge">STAGE {engineState.stageNumber}/6</span>
            <span className="hud-stage-title">{engineState.stageName}</span>
            <span className="hud-timer-tabular">{stageSecondsRemaining}s</span>
          </div>
          <div className="hud-progress-track">
            <div ref={stageProgressRef} className="hud-progress-fill" />
          </div>

          {/* Bottom Row: 3 Poké-Heart SVGs & Rift Shard Counter */}
          <div className="hud-vitality-row">
            <div className="hud-hearts" title={`Soul Vitality: ${currentHp} of ${maxHp} Hearts`}>
              {Array.from({ length: maxHp }).map((_, i) => (
                <PokeHeartSvg
                  key={i}
                  active={i < currentHp}
                  isCritical={isHeartCritical && i === 0}
                />
              ))}
            </div>
            <div className="hud-pouch-divider" />
            <div className="hud-shards" title="Collected Rift Shards">
              <FacetedRiftShardSvg />
              <span className="shard-val">{engineState.shards}</span>
            </div>
          </div>
        </aside>
      )}

      {/* 2. TOP-RIGHT CARTOON PLATE (Hidden during victory sequence & jumpscare) */}
      {!engineState.victorySequenceActive && !jumpscareActive && (
        <aside className="hud-corner-plate hud-plate-right" aria-label="Score and Audio Controls">
          <div className="hud-odometer-box">
            <span className="score-eyebrow">SCORE</span>
            <span className="odometer-digits">{paddedScore}</span>
          </div>

          <button
            className="hud-sound-toggle-btn"
            onClick={() => {
              playButtonClickSfx();
              toggleMute();
            }}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>

          <button
            className="hud-pause-keycap"
            onClick={() => {
              playButtonClickSfx();
              engineState.paused ? engineRef.current?.resume() : engineRef.current?.pause();
            }}
            title="Pause Game [ESC]"
          >
            <span className="keycap-label">{engineState.paused ? 'RESUME' : 'PAUSE'}</span>
            <kbd className="keycap-hint">ESC</kbd>
          </button>
        </aside>
      )}

      {/* 3. PENNYWISE DYNAMIC 3D-TRACKED CARTOON SPEECH BUBBLE */}
      {/* 3a. Normal Gameplay Chase Speech Bubble (Persistent element, never remounted during exit) */}
      {sessionState === 'playing' && !hasActiveModalOrCutscene && (
        <aside
          ref={speechBubbleRef}
          className={`pennywise-speech-bubble ${
            dialoguePhase === 'visible'
              ? 'bubble-visible'
              : dialoguePhase === 'exiting'
              ? 'bubble-exiting'
              : 'bubble-hidden'
          }`}
          aria-live="polite"
        >
          <div className="speech-bubble-tail" />
          <p className="speech-bubble-text">
            {formatDialogue(PENNYWISE_LINES[dialogueIndex])}
          </p>
        </aside>
      )}

      {/* 3b. Pennywise Demise Speech Bubble (0.0s to 4.1s in Cutscene) */}
      {engineState.victorySequenceActive && demiseCutscene.visible && !lossModal && !completedCardModal && (
        <aside
          ref={speechBubbleRef}
          className="pennywise-speech-bubble pennywise-speech-bubble--demise"
          key={`demise-${demiseCutscene.lineIndex}`}
          aria-live="assertive"
        >
          {/* Jagged Panic Crack SVG Overlays */}
          <svg className="bubble-demise-cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,0 L18,12 L10,24 L22,30" stroke="#dc2626" strokeWidth="2.5" fill="none" />
            <path d="M100,0 L82,14 L90,26 L78,32" stroke="#dc2626" strokeWidth="2.5" fill="none" />
            <path d="M0,100 L16,84 L8,74 L20,68" stroke="#dc2626" strokeWidth="2.5" fill="none" />
            <path d="M100,100 L84,82 L92,72 L80,66" stroke="#dc2626" strokeWidth="2.5" fill="none" />
          </svg>
          <div className="speech-bubble-tail speech-bubble-tail--demise" />
          <p className="speech-bubble-text demise-bubble-text">
            {formatDialogue(PENNYWISE_DEMISE_LINES[demiseCutscene.lineIndex] || PENNYWISE_DEMISE_LINES[0])}
          </p>
        </aside>
      )}

      {/* 4. SUBTLE PERIPHERAL CARD-ARC & COMPACT TOAST PILL (Never covers the center track!) */}
      {flyingCardAnim && !hasActiveModalOrCutscene && (
        <>
          <div
            className={`peripheral-card-arc slot-target-${flyingCardAnim.slot}`}
            key={flyingCardAnim.id}
            style={{ '--card-pickup-color': flyingCardAnim.cardColor || '#f59e0b' }}
          >
            <div className="mini-arc-card">
              <span className="mini-arc-slot">{flyingCardAnim.slot}</span>
            </div>
          </div>
          <div
            className="hud-card-toast-pill"
            style={{ '--toast-accent': flyingCardAnim.cardColor || '#f59e0b' }}
          >
            +1 {flyingCardAnim.cardName.toUpperCase()} FRAGMENT [{flyingCardAnim.slot}/5]
          </div>
        </>
      )}

      {/* 5. STAGE-SPECIFIC POKÉMON BOTTOM 5-CARD DOCK */}
      {!hasActiveModalOrCutscene && (() => {
        const stageTargetCard = POKEMON_CARD_ROSTER[(engineState.stageNumber - 1) % POKEMON_CARD_ROSTER.length];
        return (
          <section
            className="hud-bottom-card-dock"
            aria-label={`5 Stage ${engineState.stageNumber} Pokédex Cards: ${stageTargetCard.name}`}
            style={{
              '--stage-card-color': stageTargetCard.color,
              '--stage-card-accent': stageTargetCard.accentColor,
            }}
          >
            <div className="hud-dock-fanned-cards" title="Gather all 5 cards across 60 seconds">
              {[1, 2, 3, 4, 5].map((slot) => {
                const isGot = slot <= cardsGot;
                const angles = [-8, -4, 0, 4, 8];
                const angle = angles[slot - 1];
                return (
                  <div
                    key={slot}
                    className={`fanned-card-slot ${isGot ? 'card-collected' : 'card-pending'} ${
                      recentDockSlot === slot ? 'slot-bounce-glow' : ''
                    }`}
                    style={{
                      '--card-fan-rot': `${angle}deg`,
                      '--card-fan-y': `${Math.abs(angle) * 0.7}px`,
                    }}
                    title={`Stage Card ${slot}/5: ${isGot ? 'Secured' : 'Missing'}`}
                  >
                    <div className="card-flipper">
                      {/* Uncollected: Stage-tinted custom cartoon Pokéball back-plate */}
                      <div className="card-front card-pokeball-back">
                        <div className="mini-pokeball-icon">
                          <div className="pokeball-top-half" />
                          <div className="pokeball-center-band" />
                          <div className="pokeball-button" />
                        </div>
                        <span className="fanned-card-index">{slot}</span>
                      </div>

                      {/* Collected: Miniature cartoon sprite of that stage's Pokémon + elemental bar + gold border */}
                      <div className="card-back card-pokemon-mini-face">
                        <div className="mini-card-elem-bar">
                          <span className="mini-stage-num">S{engineState.stageNumber}</span>
                          <span className="mini-card-hp">{stageTargetCard.hp}</span>
                        </div>
                        <div className="mini-card-art-box">
                          <StagePokemonMiniSprite stageNumber={engineState.stageNumber} />
                        </div>
                        <span className="mini-card-mon-name">{stageTargetCard.name.split('-')[0]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Compact Stage Target Label Pill tucked at the base of the dock */}
            <div className="dock-stage-target-pill">
              STAGE {engineState.stageNumber} CARD: {stageTargetCard.name.toUpperCase()} ({cardsGot}/5)
            </div>
          </section>
        );
      })()}

      {/* ── CARTOON VICTORY CELEBRATION OVERLAY (100% UNOBSTRUCTED CENTER VIEWPORT) ── */}
      {engineState.victorySequenceActive && (
        <div className="victory-celebration-overlay" aria-live="polite">
          {/* Confetti raining along the left and right screen edges only */}
          <div className="victory-confetti-container" aria-hidden="true">
            {Array.from({ length: 36 }).map((_, i) => {
              const isLeft = i % 2 === 0;
              const xPercent = isLeft ? 1.5 + ((i * 4.9) % 16) : 82.5 + ((i * 4.9) % 16);
              return (
                <span
                  key={i}
                  className={`victory-confetti confetti-p-${i % 4}`}
                  style={{
                    '--confetti-x': `${xPercent}%`,
                    '--confetti-delay': `${(i * 0.12) % 1.6}s`,
                    '--confetti-duration': `${2.4 + (i % 3) * 0.4}s`,
                  }}
                />
              );
            })}
          </div>

          {/* Top Marquee Trophy Banner (Transitions at 4.0s) */}
          <header className={`victory-top-marquee ${demiseCutscene.isGrandChampion ? 'victory-top-marquee--champion' : ''}`}>
            <div className="victory-marquee-pill">
              <span className="victory-marquee-sparkle" aria-hidden="true">★</span>
              <span className="victory-marquee-text">
                {demiseCutscene.isGrandChampion
                  ? '🏆 GRAND CHAMPION · THE CURSED CARNIVAL IS PURIFIED! 🏆'
                  : '★ HEXEDEX SEAL ACTIVATED · BANISHING PENNYWISE ★'}
              </span>
              <span className="victory-marquee-sparkle" aria-hidden="true">★</span>
            </div>
          </header>

          {/* Bottom Celebration Bar with the 6 Glowing Pokémon Card Icons */}
          <footer className="victory-bottom-cards-bar">
            <div className="victory-cards-row">
              {POKEMON_CARD_ROSTER.slice(0, 6).map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="victory-mini-card-icon"
                  style={{
                    '--card-theme-color': card.color,
                    '--card-accent-color': card.accentColor,
                    '--card-anim-delay': `${idx * 0.08}s`,
                  }}
                  title={`Stage ${idx + 1}: ${card.name} (${card.type})`}
                >
                  <div className="mini-card-badge">S{idx + 1}</div>
                  <div className="mini-card-art">
                    <StagePokemonMiniSprite stageNumber={idx + 1} />
                  </div>
                  <div className="mini-card-footer">
                    <span className="mini-card-name-short">{card.name.split('-')[0]}</span>
                    <span className="mini-card-symbol">{card.symbol}</span>
                  </div>
                  <div className="mini-card-glow-aura" />
                </div>
              ))}
            </div>
            <div className="victory-cards-bar-subtitle">
              ALL 6 POKÉDEX CARDS CONVERGED · HEXEDEX SEAL ACTIVE
            </div>
          </footer>
        </div>
      )}

      {/* ── HANDCRAFTED COLLECTIBLE CARD MODAL (STAGE CLEAR) ── */}
      {completedCardModal && (
        <div className="pokemon-card-modal-backdrop" role="dialog" aria-modal="true">
          <div className="pokemon-card-modal cabinet-card">
            <header className="card-modal-header cabinet-modal-header">
              <h2 className="modal-title cabinet-modal-title">POKÉDEX CARD COMPLETE</h2>
              <p className="modal-sub cabinet-modal-sub">STAGE {completedCardModal.stageNumber} PURIFIED · 5 CARDS ASSEMBLED</p>
            </header>

            {/* Handcrafted Physical Collectible Card with 3D Tilt */}
            <article
              className="pokemon-tcg-card"
              onMouseMove={handleModalCardMouseMove}
              onMouseLeave={handleModalCardMouseLeave}
              style={{
                '--card-theme-color': completedCardModal.color,
                '--card-accent-color': completedCardModal.accentColor || '#38bdf8',
              }}
            >
              <div className="card-foil-sheen" />

              <div className="tcg-header">
                <div className="tcg-header-left">
                  <span className="tcg-stage-badge">STAGE {completedCardModal.stageNumber} · NO. {completedCardModal.id}</span>
                  <h3 className="tcg-card-name">{completedCardModal.name}</h3>
                </div>
                <div className="tcg-header-right">
                  <span className="tcg-hp-label">HP</span>
                  <span className="tcg-hp-val">{completedCardModal.hp || 120}</span>
                  <span className="tcg-type-icon">{completedCardModal.symbol}</span>
                </div>
              </div>

              <div className="tcg-art-frame">
                <PokedexCardArt
                  artKey={completedCardModal.artKey || completedCardModal.id}
                  isOwned={true}
                  creatureName={completedCardModal.name}
                />
                <div className="tcg-art-caption">
                  <span>{completedCardModal.type} · NO. {completedCardModal.id}</span>
                </div>
              </div>

              <div className="tcg-attacks">
                {(completedCardModal.attacks || []).map((atk, idx) => (
                  <div key={idx} className="tcg-attack-row">
                    <div className="tcg-attack-head">
                      <span className="tcg-energy-cost">{completedCardModal.symbol}</span>
                      <span className="tcg-attack-name">{atk.name}</span>
                      <span className="tcg-attack-damage">{atk.damage}</span>
                    </div>
                    <p className="tcg-attack-desc">{atk.desc}</p>
                  </div>
                ))}
              </div>

              <div className="tcg-lore-box">
                <p>"{completedCardModal.lore}"</p>
              </div>

              <footer className="tcg-footer">
                <span>Illus. {completedCardModal.illustrator || 'HEXEDEX ARCHIVES'}</span>
                <span className="tcg-rarity">{completedCardModal.rarity || 'Holo Rare'}</span>
                <span>#{completedCardModal.id} / 008</span>
              </footer>
            </article>

            <div className="card-modal-actions">
              <button
                className="primary-button proceed-stage-btn cabinet-btn-primary"
                onClick={dismissCardModal}
                autoFocus
              >
                {completedCardModal.stageNumber < 6
                  ? `CONTINUE TO STAGE ${completedCardModal.stageNumber + 1} [PRESS SPACE]`
                  : 'CONQUERED ALL 6 STAGES · VIEW ARCHIVE [PRESS SPACE]'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PENNYWISE JUMPSCARE HORROR VIGNETTE OVERLAY ── */}
      {jumpscareActive && (
        <div className="jumpscare-vignette-overlay" aria-hidden="true">
          <div className="jumpscare-glitch-border" />
          <div className="jumpscare-deadlights-text">THE DEADLIGHTS CONSUME YOU</div>
        </div>
      )}

      {/* ── LOSS / RETRY MODAL ── */}
      {lossModal && (
        <div className="card-missed-modal-backdrop loss-modal-backdrop" role="alertdialog">
          <div className="card-missed-modal loss-modal cabinet-card">
            <div className="cabinet-modal-header">
              <h2 className="loss-title cabinet-modal-title">
                {lossModal.reason === 'card_missed' && 'STAGE CARD MISSED'}
                {lossModal.reason === 'hit_points_zero' && 'VITALITY DEPLETED'}
                {lossModal.reason === 'time_limit' && 'TIME EXPIRED'}
                {!['card_missed', 'hit_points_zero', 'time_limit'].includes(lossModal.reason) && 'RUN CONCLUDED'}
              </h2>
              <p className="loss-sub cabinet-modal-sub">
                {lossModal.reason === 'card_missed' && 'ALL 5 STAGE CARDS MUST BE GATHERED WITHIN THE 60-SECOND TRIAL TO CONQUER THE STAGE.'}
                {lossModal.reason === 'hit_points_zero' && 'CARNIVAL OBSTACLES DEPLETED YOUR VITALITY BEFORE PURIFYING THE GAUNTLET.'}
                {lossModal.reason === 'time_limit' && 'THE 60-SECOND STAGE TRIAL EXPIRED BEFORE GATHERING ALL REQUIRED CARDS.'}
                {!['card_missed', 'hit_points_zero', 'time_limit'].includes(lossModal.reason) && 'THE CARNIVAL GAUNTLET WAS NOT CONQUERED.'}
              </p>
            </div>
            <div className="loss-stats cabinet-telemetry-well">
              <div className="stat-col">
                <span className="stat-label">STAGE</span>
                <b className="stat-val">{lossModal.stage} / {engineState.totalStages}</b>
              </div>
              <div className="stat-col">
                <span className="stat-label">CARDS</span>
                <b className="stat-val">{lossModal.collected} / {lossModal.required}</b>
              </div>
              <div className="stat-col">
                <span className="stat-label">SCORE</span>
                <b className="stat-val">{engineState.score?.toLocaleString() || engineState.score}</b>
              </div>
            </div>
            <div className="loss-actions">
              <button className="primary-button loss-retry-btn cabinet-btn-primary" onClick={restartRun}>
                TRY AGAIN [PRESS R]
              </button>
              <button
                className="text-button cabinet-btn-secondary"
                onClick={() => {
                  if (savedRunResult) {
                    onFinished(savedRunResult);
                  } else if (lossModal?.summary) {
                    submitSummary(lossModal.summary);
                  }
                }}
              >
                VIEW RUN SUMMARY & ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-fading bottom footnote */}
      {!hasActiveModalOrCutscene && (
        <aside className={`game-help ${isTutorialFaded ? 'game-help--hidden' : ''}`}>
          {sessionState === 'starting' && 'INITIALIZING GAUNTLET RUN…'}
          {sessionState === 'playing' && 'DODGE OBSTACLES · ASSEMBLE ALL 5 CARDS IN 60s · ZERO MISSES ALLOWED'}
          {sessionState === 'saving' && 'SECURELY PERSISTING SESSION…'}
          {sessionState === 'save_error' && (
            <>
              <span>SAVE NOT CONFIRMED</span>
              <button className="text-button" onClick={() => pendingSummary && submitSummary(pendingSummary)}>
                RETRY SAVE
              </button>
            </>
          )}
        </aside>
      )}

      {sessionState === 'countdown' && (
        <div className="countdown-overlay">
          {countdown > 0 ? countdown : 'SURVIVE!'}
        </div>
      )}

      {engineState.paused && !completedCardModal && !engineState.victorySequenceActive && (
        <div className="pause-overlay" role="dialog" aria-modal="true" aria-label="Game Paused">
          <section className="pause-cabinet-card cabinet-card">
            <div className="pause-marquee-header cabinet-modal-header">
              <h2 className="pause-cabinet-title cabinet-modal-title">GAME PAUSED</h2>
              <div className="pause-stage-badge cabinet-modal-sub">
                STAGE {engineState.stageNumber} OF 6 · {engineState.stageName.toUpperCase()}
              </div>
            </div>

            {/* Live Run Status Telemetry Box */}
            <div className="pause-telemetry-grid cabinet-telemetry-well">
              <div className="pause-telemetry-item">
                <span className="pause-telem-label">VITALITY</span>
                <span className="pause-telem-val">{currentHp} / {maxHp} HEARTS</span>
              </div>
              <div className="pause-telemetry-item">
                <span className="pause-telem-label">STAGE CARDS</span>
                <span className="pause-telem-val">{cardsGot} / 5 SECURED</span>
              </div>
              <div className="pause-telemetry-item">
                <span className="pause-telem-label">SCORE</span>
                <span className="pause-telem-val">{paddedScore}</span>
              </div>
            </div>

            {/* Chunky Arcade Control Buttons */}
            <div className="pause-actions-stack">
              <button
                className="pause-btn-resume"
                onClick={() => {
                  playButtonClickSfx();
                  engineRef.current?.resume();
                }}
              >
                <span className="btn-icon">▶</span> RESUME GAUNTLET <kbd className="pause-kbd">ESC</kbd>
              </button>

              <div className="pause-toggles-row">
                <button
                  className="pause-toggle-btn"
                  onClick={() => {
                    playButtonClickSfx();
                    toggleMute();
                  }}
                >
                  🔊 AUDIO: {soundMuted ? 'MUTED' : 'ON'}
                </button>
                <button
                  className="pause-toggle-btn"
                  onClick={toggleEffects}
                >
                  ✨ FX: {reducedEffects ? 'LOW' : 'HIGH'}
                </button>
              </div>

              <button
                className="pause-btn-abandon"
                onClick={endRun}
              >
                ✖ ABANDON RUN & EXIT
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
