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

function formatDialogue(text) {
  const keywords = ['FLOAT', 'POKÉMON', 'CATCH', 'POKÉ-BALLOON', 'POKÉDEX', 'DEADLIGHTS', 'MINE!'];
  const parts = text.split(/(\b[A-ZÉ\-'!]+\b)/g);
  return parts.map((part, idx) => {
    const clean = part.replace(/[!,]/g, '');
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

  const [engineState, setEngineState] = useState({
    lane: 1,
    jumping: false,
    paused: false,
    health: 3,
    maxHealth: 3,
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
  });

  const [soundMuted, setSoundMuted] = useState(() => isMuted());
  const [stageBanner, setStageBanner] = useState(null);
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

  useEffect(() => {
    return subscribeMuteChange(setSoundMuted);
  }, []);

  // Randomized Pennywise cartoon dialogue with smooth pop-in, pop-out, and periodic silence gaps
  useEffect(() => {
    if (sessionState !== 'playing' || engineState.paused || jumpscareActive || completedCardModal || lossModal) {
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
  }, [sessionState, engineState.paused, jumpscareActive, completedCardModal, lossModal, dialoguePhase]);

  // 60FPS DOM Progress Bar Callback hookup
  const onEngine = useCallback((engine) => {
    engineRef.current = engine;
    engine.onFrameTick = ({ stageProgressRatio }) => {
      if (stageProgressRef.current) {
        stageProgressRef.current.style.transform = `scaleX(${stageProgressRatio})`;
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
        setTimeout(() => {
          setRecentDockSlot(slot);
          setTimeout(() => setRecentDockSlot(null), 900);
        }, 550);
        setTimeout(() => setFlyingCardAnim(null), 1050);
      }
      if (next.stageClearedBanner) {
        setStageBanner({
          clearedNum: next.clearedStageNum,
          nextNum: next.nextStageNum,
          nextName: next.nextStageName,
        });
        setTimeout(() => setStageBanner(null), 3500);
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

  const startNewRun = useCallback((token) => {
    setSessionState('starting');
    setLossModal(null);
    setCompletedCardModal(null);
    setJumpscareActive(false);
    startSession(player.playerId, token, GAME_CONFIG.version)
      .then((data) => {
        setSession(data);
        setSessionState('countdown');
      })
      .catch(() => setSessionState('error'));
  }, [player.playerId]);

  useEffect(() => {
    startNewRun(runToken);
  }, [runToken, startNewRun]);

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
      submitSummary(summary);
    } else {
      submitSummary(summary);
    }
  }, [engineState.stageNumber, engineState.stageCardsCollected, engineState.cardsRequiredPerStage, submitSummary]);

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
    setCompletedCardModal(null);
    if (completedCardModal?.stageNumber >= (GAME_CONFIG.stageCount || 6)) {
      engineRef.current?.finish('all_stages_cleared');
    } else {
      engineRef.current?.resume();
    }
  }, [completedCardModal]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lossModal && (e.key === 'r' || e.key === 'R' || e.code === 'Space' || e.key === 'Enter')) {
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

      {/* 1. TOP-LEFT CARTOON PLATE */}
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

      {/* 2. TOP-RIGHT CARTOON PLATE */}
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

      {/* 3. PENNYWISE RANDOMIZED SILENT CARTOON SPEECH BUBBLE (To the side, disappears smoothly every once in awhile) */}
      {sessionState === 'playing' && !engineState.paused && !jumpscareActive && !completedCardModal && !lossModal && dialoguePhase !== 'hidden' && (
        <aside
          className={`pennywise-speech-bubble ${dialoguePhase === 'exiting' ? 'bubble-exiting' : 'bubble-entering'}`}
          key={`${dialogueIndex}-${dialoguePhase === 'exiting' ? 'exit' : 'enter'}`}
          aria-live="polite"
        >
          <div className="speech-bubble-tail" />
          <p className="speech-bubble-text">
            {formatDialogue(PENNYWISE_LINES[dialogueIndex])}
          </p>
        </aside>
      )}

      {/* 4. 2D CARTOON FLYING CARD-TO-DOCK ANIMATION */}
      {flyingCardAnim && (
        <div
          className={`flying-card-overlay fly-to-slot-${flyingCardAnim.slot}`}
          key={flyingCardAnim.id}
          style={{ '--card-pickup-color': flyingCardAnim.cardColor || '#f59e0b' }}
        >
          <div className="flying-card-pop-banner">POKÉ-CARD FRAGMENT!</div>
          <div className="flying-card-mini">
            <div className="mini-card-sparkle">✦</div>
            <div className="mini-card-name">{flyingCardAnim.cardName}</div>
          </div>
        </div>
      )}

      {/* 5. BOTTOM-CENTER FANNED 5-CARD DOCK */}
      <section className="hud-bottom-card-dock" aria-label="5 Stage Pokédex Cards">
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
                  <div className="card-front">
                    <span className="fanned-card-index">{slot}</span>
                    <span className="fanned-card-mark">✦</span>
                  </div>
                  <div className="card-back">
                    <span className="fanned-back-pattern">◈</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage Clear Celebration Banner (Positioned well below Pennywise at bottom: 5.5rem) */}
      {stageBanner && (
        <div className="stage-clear-banner">
          <p className="banner-eyebrow">STAGE {stageBanner.clearedNum} PURIFIED</p>
          <h2 className="banner-title">5/5 CARDS SECURED · VITALITY RESTORED</h2>
          <p className="banner-sub">Entering Stage {stageBanner.nextNum}: <strong>{stageBanner.nextName}</strong></p>
        </div>
      )}

      {/* ── HANDCRAFTED COLLECTIBLE CARD MODAL (STAGE CLEAR) ── */}
      {completedCardModal && (
        <div className="pokemon-card-modal-backdrop" role="dialog" aria-modal="true">
          <div className="pokemon-card-modal">
            <header className="card-modal-header">
              <span className="modal-stage-tag">STAGE {completedCardModal.stageNumber} PURIFIED</span>
              <h2 className="modal-title">POKÉDEX CARD COMPLETE</h2>
              <p className="modal-sub">Trial concluded within 60 seconds with all 5 cards assembled</p>
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
                <span>Illus. {completedCardModal.illustrator || 'ELE5BA Studio'}</span>
                <span className="tcg-rarity">{completedCardModal.rarity || 'Holo Rare'}</span>
                <span>#{completedCardModal.id} / 006</span>
              </footer>
            </article>

            <div className="card-modal-actions">
              <button
                className="primary-button proceed-stage-btn"
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
          <div className="card-missed-modal loss-modal">
            <span className="loss-badge">RUN CONCLUDED</span>
            <h2 className="loss-title">
              {lossModal.reason === 'card_missed' && 'STAGE CARD MISSED'}
              {lossModal.reason === 'hit_points_zero' && 'VITALITY DEPLETED'}
              {lossModal.reason === 'time_limit' && 'TIME EXPIRED'}
              {!['card_missed', 'hit_points_zero', 'time_limit'].includes(lossModal.reason) && 'RUN CONCLUDED'}
            </h2>
            <p className="loss-sub">
              {lossModal.reason === 'card_missed' && 'All 5 stage cards must be gathered within the 60-second trial to complete the Pokédex card and advance.'}
              {lossModal.reason === 'hit_points_zero' && 'Obstacles depleted your health before completing the gauntlet.'}
              {lossModal.reason === 'time_limit' && 'The 60-second trial ran out before purifying the stage.'}
              {!['card_missed', 'hit_points_zero', 'time_limit'].includes(lossModal.reason) && 'The carnival gauntlet was not conquered.'}
            </p>
            <div className="loss-stats">
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
              <button className="primary-button loss-retry-btn" onClick={restartRun} autoFocus>
                TRY AGAIN [PRESS R]
              </button>
              <button className="text-button" onClick={() => submitSummary(lossModal.summary)}>
                VIEW RUN SUMMARY & ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-fading bottom footnote */}
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

      {sessionState === 'countdown' && (
        <div className="countdown-overlay">
          {countdown > 0 ? countdown : 'SURVIVE!'}
        </div>
      )}

      {engineState.paused && !completedCardModal && (
        <div className="pause-overlay">
          <h2>GAME PAUSED</h2>
          <p className="pause-info">Stage {engineState.stageNumber}: {engineState.stageName}</p>
          <button className="primary-button" onClick={() => {
            playButtonClickSfx();
            engineRef.current?.resume();
          }}>
            RESUME RUN
          </button>
          <button className="text-button" onClick={toggleEffects}>
            {reducedEffects ? 'NORMAL VISUALS' : 'REDUCED EFFECTS'}
          </button>
          <button className="text-button" onClick={endRun}>
            ABANDON RUN
          </button>
        </div>
      )}

      <button className="exit-game" onClick={endRun}>
        ABANDON RUN
      </button>
    </main>
  );
}
