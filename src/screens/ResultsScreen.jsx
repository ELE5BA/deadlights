import { useEffect } from 'react';

export default function ResultsScreen({ result, onPlayAgain, onTitle, onCollection, onLeaderboard }) {
  const stagesCleared = result.stagesCleared ?? 0;
  const isFlawless = stagesCleared === 6;
  const isCardMissed = result.endReason === 'card_missed';

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
      <section className="setup-card results-card ledger-certificate">
        {/* Diegetic Stamped Ink Seal Badge */}
        <div className={`ledger-stamp-badge ${isFlawless ? 'stamp-purified' : 'stamp-claimed'}`}>
          <span className="stamp-inner">
            {isFlawless ? 'PURIFIED' : 'CLAIMED BY DEADLIGHTS'}
          </span>
        </div>

        <header className="results-header">
          <p className="eyebrow">
            {isFlawless
              ? 'OFFICIAL ARCHIVAL TRIAL CERTIFICATE · MAXIMUM PURIFICATION CONCLUDED'
              : isCardMissed
              ? 'ARCHIVAL FIELD LEDGER · STAGE CARD UNMET'
              : 'ARCHIVAL FIELD LEDGER · GAUNTLET TERMINATED'}
          </p>
          <h2 className="results-score">
            {result.score.toLocaleString()} <span className="results-points-label">PTS</span>
          </h2>
        </header>

        {/* Roman Numeral Wax Seals for Stages I–VI */}
        <div className="stage-clear-badge-row ledger-wax-seals" aria-label="Stages Progression">
          {['I', 'II', 'III', 'IV', 'V', 'VI'].map((roman, idx) => {
            const stg = idx + 1;
            const cleared = stg <= stagesCleared;
            return (
              <span
                key={stg}
                className={`stage-badge-pip wax-seal-pip ${cleared ? 'cleared' : 'incomplete'}`}
                title={`Stage ${stg}: ${cleared ? 'Purified' : 'Incomplete'}`}
              >
                <span className="seal-roman">{roman}</span>
                <span className="seal-mark">{cleared ? '✓' : '—'}</span>
              </span>
            );
          })}
        </div>

        <div className="result-grid ledger-grid">
          <div className="result-item ledger-item">
            <span className="result-value">{stagesCleared} / 6</span>
            <span className="result-label">STAGES PURIFIED</span>
          </div>
          <div className="result-item ledger-item">
            <span className="result-value">+{result.fragmentsEarned ?? 0}</span>
            <span className="result-label">CARDS ASSEMBLED</span>
          </div>
          <div className="result-item ledger-item">
            <span className="result-value">{result.survivalSeconds.toFixed(1)}s</span>
            <span className="result-label">TIME SURVIVED</span>
          </div>
          <div className="result-item ledger-item">
            <span className="result-value">+{result.shardsEarned}</span>
            <span className="result-label">SHARDS EXTRACTED</span>
          </div>
          <div className="result-item ledger-item">
            <span className="result-value">{result.wallet?.shardsBalance ?? 0}</span>
            <span className="result-label">SHARD BALANCE</span>
          </div>
          <div className="result-item ledger-item">
            <span className="result-value">{(result.bestScore ?? result.score).toLocaleString()}</span>
            <span className="result-label">PERSONAL BEST</span>
          </div>
        </div>

        {result.unlockedCards?.length > 0 && (
          <div className="new-card-alert">
            NEW POKÉDEX ENTRY ASSEMBLED · READY TO INSPECT IN CARD BINDER
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
