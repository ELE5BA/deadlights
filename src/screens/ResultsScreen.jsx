import { useEffect } from 'react';
import ForensicRunAutopsy from '../components/ForensicRunAutopsy.jsx';

const STAGE_SEALS = [
  { stage: 1, roman: 'I', name: 'Bulba-Moss', color: '#10b981' },
  { stage: 2, roman: 'II', name: 'Pika-Lantern', color: '#f59e0b' },
  { stage: 3, roman: 'III', name: 'Zap-Venomoth', color: '#38bdf8' },
  { stage: 4, roman: 'IV', name: 'Gengar-Wisp', color: '#c084fc' },
  { stage: 5, roman: 'V', name: 'Corvi-Gear', color: '#94a3b8' },
  { stage: 6, roman: 'VI', name: 'Gyarados-Fin', color: '#06b6d4' },
];

export default function ResultsScreen({ result, onPlayAgain, onTitle, onLeaderboard }) {
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
      <section className="setup-card results-card cartoon-results-card cabinet-card">
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
              ? 'STAGE CARD MISSED · CLAIMED BY THE GRIMLIGHT'
              : 'GAUNTLET TERMINATED · CLAIMED BY THE GRIMLIGHT'}
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
                title={`Stage ${s.stage} (${s.name}): ${cleared ? 'Purified' : 'Locked'}`}
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

        {/* Informative Codex Restoration Note */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.74rem',
            color: isFlawless ? '#34d399' : '#d4a349',
            fontWeight: 800,
            letterSpacing: '0.05em',
            margin: '-0.3rem 0 0.5rem 0',
            textTransform: 'uppercase',
          }}
        >
          {isFlawless
            ? '★ ALL 6 POKÉDEX CARDS SECURED · CARNIVAL PURIFIED ★'
            : `${stagesCleared} OF 6 CODEX CARDS PURIFIED · SURVIVE TO STAGE 6 TO FILL ALL CARDS`}
        </div>

        {/* 4. CLEAN 3×2 TELEMETRY GRID */}
        <div className="results-telemetry-grid cabinet-telemetry-well">
          <div className="telemetry-tile">
            <span className="telemetry-val stat-val">{stagesCleared} / 6</span>
            <span className="telemetry-lbl stat-label">CARDS COMPLETED</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val stat-val">+{result.fragmentsEarned ?? 0}</span>
            <span className="telemetry-lbl stat-label">FRAGMENTS GATHERED</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val stat-val">{result.survivalSeconds.toFixed(1)}s</span>
            <span className="telemetry-lbl stat-label">TIME SURVIVED</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val stat-val">+{result.shardsEarned}</span>
            <span className="telemetry-lbl stat-label">SHARDS EARNED</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val stat-val">{result.wallet?.shardsBalance ?? 0}</span>
            <span className="telemetry-lbl stat-label">WALLET SHARDS</span>
          </div>
          <div className="telemetry-tile">
            <span className="telemetry-val stat-val">{(result.bestScore ?? result.score).toLocaleString()}</span>
            <span className="telemetry-lbl stat-label">PERSONAL BEST</span>
          </div>
        </div>

        {/* Survival Relics Performance Ribbon */}
        <div
          className="results-relics-strip cabinet-telemetry-well"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '10px 16px',
            margin: '0.6rem 0',
            background: 'rgba(10, 7, 18, 0.85)',
            border: '1px solid rgba(212, 163, 73, 0.3)',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>🛡️</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="stat-label" style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
                AEGIS FORCEFIELD
              </span>
              <span className="stat-val" style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 800 }}>
                {(result.telemetry?.powerupStats?.shieldsCollected ?? result.summary?.telemetry?.powerupStats?.shieldsCollected ?? 0)} Deployed{' '}
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  ({(result.telemetry?.powerupStats?.shieldsBroken ?? result.summary?.telemetry?.powerupStats?.shieldsBroken ?? 0)} Absorbed)
                </span>
              </span>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(212, 163, 73, 0.2)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>❤️</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="stat-label" style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
                SOUL HEARTS
              </span>
              <span className="stat-val" style={{ fontSize: '0.95rem', color: '#f43f5e', fontWeight: 800 }}>
                {(result.telemetry?.powerupStats?.heartsCollected ?? result.summary?.telemetry?.powerupStats?.heartsCollected ?? 0)} Recovered{' '}
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  (+{(result.telemetry?.powerupStats?.heartHpRestored ?? result.summary?.telemetry?.powerupStats?.heartHpRestored ?? 0)} HP)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 4-Tier Forensic Run Autopsy */}
        <ForensicRunAutopsy
          telemetry={result.telemetry || result.summary?.telemetry}
          currentStage={stagesCleared + 1}
          currentScore={result.score}
        />

        <div className="save-status">
          <span className="status-dot" /> RECORD PERSISTED TO LOCAL ARCHIVE
        </div>

        <button className="primary-button results-primary-btn cabinet-btn-primary" onClick={onPlayAgain}>
          PLAY AGAIN [PRESS R]
        </button>

        <nav className="results-nav-row">
          <button className="text-button cabinet-btn-secondary" onClick={onLeaderboard}>
            LEADERBOARD
          </button>
          <span className="nav-divider">·</span>
          <button className="text-button cabinet-btn-secondary" onClick={onTitle}>
            RETURN TO TITLE
          </button>
        </nav>
      </section>
    </main>
  );
}
