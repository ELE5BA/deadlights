import { useEffect } from 'react';

const STAGE_SEALS = [
  { stage: 1, roman: 'I', name: 'Bulba-Moss', color: '#10b981' },
  { stage: 2, roman: 'II', name: 'Pika-Lantern', color: '#f59e0b' },
  { stage: 3, roman: 'III', name: 'Zap-Venomoth', color: '#38bdf8' },
  { stage: 4, roman: 'IV', name: 'Gengar-Wisp', color: '#c084fc' },
  { stage: 5, roman: 'V', name: 'Corvi-Gear', color: '#94a3b8' },
  { stage: 6, roman: 'VI', name: 'Gyarados-Fin', color: '#06b6d4' },
];

export default function ResultsScreen({ result, onPlayAgain, onTitle, onCollection, onLeaderboard }) {
  const stagesCleared = result.stagesCleared ?? 0;
  const isFlawless = stagesCleared === 6;
  const isCardMissed = result.endReason === 'card_missed';
  const isPersonalBest = result.score >= (result.bestScore ?? result.score);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onPlayAgain();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayAgain]);

  return (
    <main className="overlay-screen">
      <section className="setup-card results-card cartoon-results-card">
        {/* 1. TOP COMIC STATUS BANNER (Full-width, zero overlap!) */}
        <div className={`results-status-banner ${isFlawless ? 'banner-victory' : 'banner-defeat'}`}>
          <div className="status-banner-icon">
            {isFlawless ? (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#120b1d" strokeWidth="2.2" />
                <path d="M7 12l3.5 3.5 6.5-6.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="#120b1d" strokeWidth="2.2" />
                <circle cx="12" cy="12" r="4" fill="#ffaa00" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#ffffff" strokeWidth="1.8" />
              </svg>
            )}
          </div>
          <span className="status-banner-text">
            {isFlawless
              ? 'VICTORY · ALL 6 STAGES PURIFIED'
              : isCardMissed
              ? 'STAGE CARD MISSED · CLAIMED BY DEADLIGHTS'
              : 'GAUNTLET TERMINATED · CLAIMED BY DEADLIGHTS'}
          </span>
        </div>

        {/* 2. CENTER SCORE SHOWCASE (Sunken velvet trophy plaque) */}
        <div className="results-score-showcase">
          <span className="showcase-eyebrow">FINAL RUN SCORE</span>
          <div className="showcase-score-digits">
            <span className="showcase-num">{result.score.toLocaleString()}</span>
            <span className="showcase-pts">PTS</span>
          </div>
          {isPersonalBest && (
            <div className="new-personal-best-pill">
              <span className="star-sparkle">★</span> NEW PERSONAL BEST!
            </div>
          )}
        </div>

        {/* 3. 6-STAGE CREATURE PURIFICATION STRIP */}
        <div className="results-stage-strip" aria-label="Stage Purification Progress">
          {STAGE_SEALS.map((s) => {
            const cleared = s.stage <= stagesCleared;
            return (
              <div
                key={s.stage}
                className={`stage-shield-pip ${cleared ? 'shield-cleared' : 'shield-incomplete'}`}
                style={{ '--stage-color': s.color }}
                title={`Stage ${s.stage} (${s.name}): ${cleared ? 'Purified' : 'Unreached'}`}
              >
                <div className="shield-header">
                  <span className="shield-roman">{s.roman}</span>
                </div>
                <div className="shield-seal">
                  {cleared ? (
                    <span className="shield-check">✓</span>
                  ) : (
                    <span className="shield-dash">—</span>
                  )}
                </div>
                <span className="shield-name">{s.name.split('-')[0]}</span>
              </div>
            );
          })}
        </div>

        {/* 4. CLEAN 3×2 TELEMETRY GRID */}
        <div className="results-telemetry-grid">
          <div className="telemetry-tile">
            <span className="telemetry-val">{stagesCleared} / 6</span>
            <span className="telemetry-lbl">STAGES PURIFIED</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val">+{result.fragmentsEarned ?? 0}</span>
            <span className="telemetry-lbl">CARDS ASSEMBLED</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val">{result.survivalSeconds.toFixed(1)}s</span>
            <span className="telemetry-lbl">TIME SURVIVED</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val">+{result.shardsEarned}</span>
            <span className="telemetry-lbl">SHARDS EARNED</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val">{result.wallet?.shardsBalance ?? 0}</span>
            <span className="telemetry-lbl">WALLET SHARDS</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val">{(result.bestScore ?? result.score).toLocaleString()}</span>
            <span className="telemetry-lbl">PERSONAL BEST</span>
          </div>
        </div>

        {result.unlockedCards?.length > 0 && (
          <div className="new-card-alert">
            ★ NEW POKÉDEX ENTRY ASSEMBLED · READY TO INSPECT IN CARD BINDER
          </div>
        )}

        <div className="save-status">
          <span className="status-dot" /> RECORD PERSISTED TO LOCAL ARCHIVE
        </div>

        <button className="primary-button results-primary-btn" onClick={onPlayAgain}>
          PLAY AGAIN [PRESS R]
        </button>

        <nav className="results-nav-row">
          <button className="text-button" onClick={onCollection}>
            CARD BINDER
          </button>
          <span className="nav-divider">·</span>
          <button className="text-button" onClick={onLeaderboard}>
            LEADERBOARD
          </button>
          <span className="nav-divider">·</span>
          <button className="text-button" onClick={onTitle}>
            RETURN TO TITLE
          </button>
        </nav>
      </section>
    </main>
  );
}
