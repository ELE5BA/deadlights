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

    // 2. Dissonant screeching horror cluster (detuned sawtooth frequencies)
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

    // 3. Blinding Deadlights static noise burst
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

export default function GameScreen({ player, onFinished }) {
  const engineRef = useRef(null);
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

  const onEngine = useCallback((engine) => {
    engineRef.current = engine;
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
      // Transition towards restart game modal after jumpscare completes
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

  // Global keyboard shortcuts: 'R' or 'Space' or 'Enter' to instantly restart upon loss, 'Space' to proceed from card modal
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

  const stageSecondsRemaining = Math.max(0, Math.ceil((engineState.stageDurationSeconds || 60) - (engineState.stageElapsedSeconds || 0)));
  const maxHp = engineState.maxHealth || 3;
  const currentHp = Math.max(0, Math.min(maxHp, engineState.health));
  const cardsReq = engineState.cardsRequiredPerStage || 5;
  const cardsGot = Math.min(cardsReq, engineState.stageCardsCollected || 0);

  return (
    <main className="game-screen">
      <GameCanvas
        onEngine={onEngine}
        onStateChange={onStateChange}
        onRunEnd={onRunEnd}
        reducedEffects={reducedEffects}
      />

      {/* ── UNIFIED BESPOKE ARCADE HUD ── */}
      <header className="game-hud">
        <div className="hud-left">
          <div className="hud-hearts" title={`Vitality: ${currentHp} of ${maxHp} Hearts Remaining`}>
            {Array.from({ length: maxHp }).map((_, i) => (
              <span key={i} className={`hud-heart-pip ${i < currentHp ? 'active' : 'depleted'}`}>
                {i < currentHp ? '♥' : '♡'}
              </span>
            ))}
          </div>
          <div className="hud-shards" title="Collected Rift Shards">
            <span className="shard-glyph">◈</span>
            <span className="shard-val">{engineState.shards}</span>
          </div>
        </div>

        <div className="hud-center">
          <div className="hud-stage-info">
            <span className="hud-stage-badge">STAGE {engineState.stageNumber}</span>
            <span className="hud-stage-name">{engineState.stageName}</span>
            <span className="hud-stage-clock">{stageSecondsRemaining}s</span>
          </div>

          <div className="hud-cards-gauntlet" title="Stage Cards: Collect all 5 across 60s. Zero misses permitted.">
            <div className="hud-card-slots">
              {[1, 2, 3, 4, 5].map((slot) => {
                const isGot = slot <= cardsGot;
                return (
                  <div
                    key={slot}
                    className={`hud-card-slot ${isGot ? 'collected' : 'pending'}`}
                    title={`Card ${slot}/5: ${isGot ? 'Secured' : 'Awaiting'}`}
                  >
                    <span className="slot-index">{slot}</span>
                    <span className="slot-mark">{isGot ? '✓' : ''}</span>
                  </div>
                );
              })}
            </div>
            <span className="hud-card-counter">
              <b>{cardsGot}</b><span className="counter-sep">/</span>5
            </span>
          </div>
        </div>

        <div className="hud-right">
          <div className="hud-score-display">
            <span className="score-label">SCORE</span>
            <span className="score-value">{engineState.score?.toLocaleString() || 0}</span>
          </div>
          <button
            className="hud-pause-btn"
            onClick={() => (engineState.paused ? engineRef.current?.resume() : engineRef.current?.pause())}
          >
            {engineState.paused ? 'RESUME' : 'PAUSE'}
          </button>
        </div>
      </header>

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

            {/* Handcrafted Physical Collectible Card */}
            <article
              className="pokemon-tcg-card"
              style={{
                '--card-theme-color': completedCardModal.color,
                '--card-accent-color': completedCardModal.accentColor || '#38bdf8',
              }}
            >
              <div className="card-foil-sheen" />

              {/* Card Header: Stage badge, Name, HP, Type Symbol */}
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

              {/* Card Illustration Frame with Handcrafted Pixel Art */}
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

              {/* Attacks Section */}
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

              {/* Flavour / Lore bar */}
              <div className="tcg-lore-box">
                <p>"{completedCardModal.lore}"</p>
              </div>

              {/* Card Footer */}
              <footer className="tcg-footer">
                <span>Illus. {completedCardModal.illustrator || 'ELE5BA Studio'}</span>
                <span className="tcg-rarity">{completedCardModal.rarity || 'Holo Rare'}</span>
                <span>#{completedCardModal.id} / 006</span>
              </footer>
            </article>

            {/* Action Button */}
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

      <aside className="game-help">
        {sessionState === 'starting' && 'INITIALIZING GAUNTLET RUN…'}
        {sessionState === 'playing' && 'DODGE OBSTACLES · COLLECT ALL 5 CARDS IN 60s · ZERO MISSES ALLOWED'}
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
