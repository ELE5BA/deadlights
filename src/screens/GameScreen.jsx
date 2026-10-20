import { useCallback, useEffect, useRef, useState } from 'react';
import { GAME_CONFIG } from '../../shared/gameConfig.js';
import GameCanvas from '../game/GameCanvas.jsx';
import PokedexCardArt from '../components/PokedexCardArt.jsx';
import { finishSession, startSession } from '../services/apiClient.js';

function playCardPickupChime(isFullCard) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const freqs = isFullCard
      ? [523.25, 659.25, 783.99, 1046.50, 1318.51]
      : [523.25, 659.25, 783.99, 1046.50];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isFullCard ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + (isFullCard ? 0.32 : 0.20));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + (isFullCard ? 0.35 : 0.22));
    });
  } catch {
    // Ignore audio blockage
  }
}

function playPennywiseJumpscareStinger() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // 1. Sub-bass dive impact
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 1.2);
    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.25);

    // 2. Dissonant horror cluster
    [720, 784, 880, 932].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq + idx * 6, now);
      osc.frequency.linearRampToValueAtTime(freq * 0.45, now + 1.15);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    });

    // 3. Deadlights static burst
    const bufferSize = Math.floor(ctx.sampleRate * 0.45);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.24, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  } catch {
    // Ignore audio blockage
  }
}

/**
 * Custom Bespoke Inline SVG Soul-Lantern Heart
 */
function SoulLanternHeart({ active, isCritical }) {
  if (!active) {
    return (
      <svg
        className="soul-heart soul-heart--depleted"
        viewBox="0 0 24 24"
        width="26"
        height="26"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2L4 7v10l8 5 8-5V7L12 2z"
          stroke="#4a3e30"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="#0a0810"
        />
        <path d="M7 9l4 4-2 3 5 2" stroke="#6b5e52" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M16 8l-3 4 2 2" stroke="#6b5e52" strokeWidth="1.0" strokeLinecap="round" />
        <circle cx="12" cy="14" r="1.5" fill="#2b231c" />
      </svg>
    );
  }

  return (
    <svg
      className={`soul-heart soul-heart--active ${isCritical ? 'soul-heart--pulse' : ''}`}
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2L4 7v10l8 5 8-5V7L12 2z"
        stroke="#d4a349"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="#26060c"
      />
      <path
        d="M12 5.5c-3 3-4 6-1 9 1 1 3 2 4 0 2-2 1-4-1-6-1-1-1.5-2-2-3z"
        fill="url(#soulFlameGrad)"
      />
      <circle cx="12.5" cy="13.5" r="2" fill="#fff5d6" />
      <defs>
        <linearGradient id="soulFlameGrad" x1="12" y1="5.5" x2="12" y2="16.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff4d6d" />
          <stop offset="0.6" stopColor="#b81d2c" />
          <stop offset="1" stopColor="#f3c86b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Custom Bespoke Faceted SVG Rift Shard
 */
function FacetedRiftShardSvg() {
  return (
    <svg className="rift-shard-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M12 2L5 9l7 13 7-13-7-7z" fill="url(#shardGradGame)" stroke="#3ce3e8" strokeWidth="1.2" />
      <path d="M12 2v20M5 9h14M12 9l-4 7m4-7l4 7" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="0.8" />
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

export default function GameScreen({ player, onFinished }) {
  const engineRef = useRef(null);
  const stageProgressRef = useRef(null);

  const [engineState, setEngineState] = useState({
    lane: 1,
    jumping: false,
    paused: false,
    health: 2,
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
        playCardPickupChime(true);
      }
      if (next.cardPickup) {
        playCardPickupChime(next.cardPickup.isFullCard);
      }
      if (next.jumpscareActive) {
        setJumpscareActive(true);
        playPennywiseJumpscareStinger();
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
    const interval = window.setInterval(() => setCountdown((value) => value - 1), 1000);
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
    setLossModal(null);
    setCompletedCardModal(null);
    setJumpscareActive(false);
    const nextToken = crypto.randomUUID();
    setRunToken(nextToken);
  }, []);

  const dismissCardModal = useCallback(() => {
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

  const endRun = () => engineRef.current?.finish('player_exit');
  const toggleEffects = () => setReducedEffects((current) => {
    const next = !current;
    localStorage.setItem('deadlights.reducedEffects', String(next));
    return next;
  });

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
      />

      {/* ── PERIPHERAL CORNER-ANCHORED IN-GAME HUD ── */}
      {/* Top-Left Plate: Vitality Lanterns & Shard Pouch */}
      <aside className="hud-corner-plate hud-plate-left" aria-label="Player Vitality and Shards">
        <div className="hud-hearts" title={`Soul Vitality: ${currentHp} of ${maxHp} Hearts`}>
          {Array.from({ length: maxHp }).map((_, i) => (
            <SoulLanternHeart
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
      </aside>

      {/* Top-Center Compact Marquee & Fanned Card Hand */}
      <section className="hud-center-marquee" aria-label="Stage Progress and Cards Hand">
        <div className="marquee-ribbon">
          <span className="marquee-stage-badge">STAGE {engineState.stageNumber}</span>
          <span className="marquee-stage-name">{engineState.stageName}</span>
          <span className="marquee-timer">{stageSecondsRemaining}s</span>
        </div>

        {/* 60FPS GPU Transform Progress Bar */}
        <div className="marquee-progress-track">
          <div ref={stageProgressRef} className="marquee-progress-bar" />
        </div>

        {/* 5 Physical Mini-Card Slots in Poker-Hand Fan */}
        <div className="hud-fanned-cards" title="Gather all 5 cards across 60 seconds">
          {[1, 2, 3, 4, 5].map((slot) => {
            const isGot = slot <= cardsGot;
            // Angle spread: -8deg to +8deg
            const angles = [-8, -4, 0, 4, 8];
            const angle = angles[slot - 1];
            return (
              <div
                key={slot}
                className={`fanned-card-slot ${isGot ? 'card-collected' : 'card-pending'}`}
                style={{
                  '--card-fan-rot': `${angle}deg`,
                  '--card-fan-y': `${Math.abs(angle) * 0.8}px`,
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

      {/* Top-Right Plate: Score Odometer & Pause Keycap */}
      <aside className="hud-corner-plate hud-plate-right" aria-label="Score and Controls">
        <div className="hud-odometer-box">
          <span className="score-eyebrow">SCORE</span>
          <span className="odometer-digits">{paddedScore}</span>
        </div>
        <button
          className="hud-pause-keycap"
          onClick={() => (engineState.paused ? engineRef.current?.resume() : engineRef.current?.pause())}
          title="Pause Game [ESC]"
        >
          <span className="keycap-label">{engineState.paused ? 'RESUME' : 'PAUSE'}</span>
          <kbd className="keycap-hint">ESC</kbd>
        </button>
      </aside>

      {/* Stage Clear Celebration Banner */}
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
          <button className="primary-button" onClick={() => engineRef.current?.resume()}>
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
