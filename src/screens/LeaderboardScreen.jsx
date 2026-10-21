import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/apiClient.js';
import { playButtonClickSfx } from '../game/soundEffects.js';

function TrophyEmblemSvg() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <path d="M6 3h12v4c0 3.314-2.686 6-6 6s-6-2.686-6-6V3z" fill="#facc15" stroke="#120b1d" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M6 5H3c0 2.5 1.5 4.5 4 4.8" stroke="#120b1d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 5h3c0 2.5-1.5 4.5-4 4.8" stroke="#120b1d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 13v4m-4 4h8" stroke="#120b1d" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="7" r="1.5" fill="#ffffff" />
    </svg>
  );
}

function PodiumMedalBadge({ rank }) {
  if (rank === 1) {
    return (
      <div className="medal-emblem-wrap medal-gold" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="34" height="34" fill="none">
          <circle cx="16" cy="16" r="14" fill="url(#goldMedalGrad)" stroke="#120b1d" strokeWidth="2.5" />
          <path d="M7 21h18l-2.5-9-4 4-2.5-6-2.5 6-4-4L7 21z" fill="#fef08a" stroke="#120b1d" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="16" cy="10" r="1.5" fill="#ef4444" stroke="#120b1d" strokeWidth="1" />
          <circle cx="9.5" cy="13" r="1.2" fill="#ef4444" stroke="#120b1d" strokeWidth="0.8" />
          <circle cx="22.5" cy="13" r="1.2" fill="#ef4444" stroke="#120b1d" strokeWidth="0.8" />
          <defs>
            <radialGradient id="goldMedalGrad" cx="30%" cy="25%" r="70%">
              <stop stopColor="#fef08a" />
              <stop offset="0.6" stopColor="#eab308" />
              <stop offset="1" stopColor="#a16207" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="medal-emblem-wrap medal-silver" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
          <circle cx="16" cy="16" r="14" fill="url(#silverMedalGrad)" stroke="#120b1d" strokeWidth="2.5" />
          <path d="M8 21h16l-2-8-3.5 3.5-2.5-5.5-2.5 5.5L10 13l-2 8z" fill="#ffffff" stroke="#120b1d" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="16" cy="11" r="1.5" fill="#38bdf8" stroke="#120b1d" strokeWidth="1" />
          <defs>
            <radialGradient id="silverMedalGrad" cx="30%" cy="25%" r="70%">
              <stop stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#cbd5e1" />
              <stop offset="1" stopColor="#64748b" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  }
  return (
    <div className="medal-emblem-wrap medal-bronze" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
        <circle cx="16" cy="16" r="14" fill="url(#bronzeMedalGrad)" stroke="#120b1d" strokeWidth="2.5" />
        <path d="M8 21h16l-2-8-3.5 3.5-2.5-5.5-2.5 5.5L10 13l-2 8z" fill="#fed7aa" stroke="#120b1d" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="16" cy="11" r="1.5" fill="#10b981" stroke="#120b1d" strokeWidth="1" />
        <defs>
          <radialGradient id="bronzeMedalGrad" cx="30%" cy="25%" r="70%">
            <stop stopColor="#fed7aa" />
            <stop offset="0.6" stopColor="#f97316" />
            <stop offset="1" stopColor="#9a3412" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function LeaderboardScreen({ player, onBack, onPlay }) {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = () => {
    setIsRefreshing(true);
    setError('');
    getLeaderboard()
      .then((data) => {
        setEntries(data.entries || []);
      })
      .catch(() => setError('Leaderboard is currently unreachable.'))
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const top3 = entries ? entries.slice(0, 3) : [];
  const challengers = entries ? entries.slice(3) : [];

  return (
    <main className="overlay-screen leaderboard-overlay">
      <section className="arcade-hall-cabinet" aria-label="Arcade Leaderboard Hall of Champions">
        {/* Top Header Marquee */}
        <header className="leaderboard-hall-header">
          <div className="hall-header-left">
            <div className="hall-emblem-wrap">
              <TrophyEmblemSvg />
            </div>
            <div>
              <span className="hall-marquee-badge">HALL OF CHAMPIONS · TOP 10 RUNNERS</span>
              <h2 className="hall-title">ARCADE LEADERBOARD</h2>
            </div>
          </div>
          <div className="hall-header-actions">
            <button
              className="hall-refresh-btn"
              onClick={() => {
                playButtonClickSfx();
                refresh();
              }}
              title="Refresh Leaderboard"
              disabled={isRefreshing}
            >
              ↻ {isRefreshing ? 'SYNCING…' : 'REFRESH'}
            </button>
            <button
              className="hall-return-btn"
              onClick={() => {
                playButtonClickSfx();
                onBack();
              }}
            >
              ✕ RETURN
            </button>
          </div>
        </header>

        {error && <p className="form-error">{error}</p>}

        {!entries ? (
          <div className="hall-loading-box">
            <span className="hall-loading-spinner" />
            <p className="loading-note">RETRIEVING RUN ARCHIVES…</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="hall-empty-box">
            <p className="empty-note">No runs archived yet — claim the inaugural record.</p>
          </div>
        ) : (
          <div className="hall-content-scroll">
            {/* Top 3 Podium Cards */}
            {top3.length > 0 && (
              <section className="leaderboard-podium-row" aria-label="Top 3 Champions Podium">
                {top3.map((entry) => {
                  const isActive = entry.nickname === player?.nickname;
                  const rankClass = `podium-rank-${entry.rank}`;
                  const rankTitles = { 1: 'GRAND CHAMPION', 2: 'RUNNER UP', 3: 'CONTENDER' };
                  return (
                    <article
                      key={`${entry.rank}-${entry.nickname}`}
                      className={`podium-card ${rankClass} ${isActive ? 'podium-card-active' : ''}`}
                    >
                      <div className="podium-ribbon-tag">
                        <PodiumMedalBadge rank={entry.rank} />
                        <span className="podium-rank-label">#{entry.rank} {rankTitles[entry.rank]}</span>
                      </div>

                      <div className="podium-nickname-wrap">
                        <strong className="podium-nickname">{entry.nickname.toUpperCase()}</strong>
                        {isActive && <span className="podium-you-badge">YOU</span>}
                      </div>

                      <div className="podium-score-plaque">
                        <span className="score-plaque-caption">SCORE RECORD</span>
                        <div className="score-digits-wrap">
                          <span className="podium-score-digits">{entry.score.toLocaleString()}</span>
                          <span className="podium-score-unit">PTS</span>
                        </div>
                      </div>

                      <div className="podium-survival-pill">
                        <svg className="pill-stopwatch-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
                          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                        <span>{entry.survivalSeconds.toFixed(1)}s SURVIVED</span>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}

            {/* Challenger Ledger Rows (#4 to #10) */}
            {challengers.length > 0 && (
              <section className="challenger-ledger-wrap" aria-label="Challenger Ledger Ranks 4 to 10">
                <div className="challenger-ledger-head">
                  <span className="col-rank-name">RANK & RUNNER</span>
                  <span className="col-time-pts">SURVIVAL · SCORE</span>
                </div>
                <ol className="challenger-ledger-list">
                  {challengers.map((entry) => {
                    const isActive = entry.nickname === player?.nickname;
                    return (
                      <li
                        key={`${entry.rank}-${entry.nickname}`}
                        className={`challenger-row ${isActive ? 'challenger-row-active' : ''}`}
                      >
                        <div className="challenger-left">
                          <span className="challenger-keycap">#{entry.rank}</span>
                          <span className="challenger-name">{entry.nickname}</span>
                          {isActive && <span className="challenger-you-tag">YOU</span>}
                        </div>
                        <div className="challenger-right">
                          <span className="challenger-time-pill">
                            <svg className="pill-stopwatch-icon" viewBox="0 0 24 24" width="11" height="11" fill="none" aria-hidden="true">
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
                              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                            </svg>
                            {entry.survivalSeconds.toFixed(1)}s
                          </span>
                          <span className="challenger-score-pill">
                            <strong className="score-num">{entry.score.toLocaleString()}</strong>
                            <span className="score-pts">PTS</span>
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}
          </div>
        )}

        <footer className="hall-cabinet-footer">
          <button
            className="hall-play-btn"
            onClick={() => {
              playButtonClickSfx();
              onPlay();
            }}
          >
            ▶ ENTER THE GAUNTLET
          </button>
        </footer>
      </section>
    </main>
  );
}
