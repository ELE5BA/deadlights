import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/apiClient.js';

export default function LeaderboardScreen({ player, onBack, onPlay }) {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState('');

  const refresh = () =>
    getLeaderboard()
      .then((data) => setEntries(data.entries))
      .catch(() => setError('Leaderboard is currently unreachable.'));

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="overlay-screen">
      <section className="setup-card leaderboard-card">
        <header className="leaderboard-header">
          <div>
            <p className="eyebrow">HALL OF RECORDS · ASIA/MANILA</p>
            <h2>ARCADE LEADERBOARD</h2>
          </div>
          <button className="text-button" onClick={onBack}>
            RETURN
          </button>
        </header>

        {error && <p className="form-error">{error}</p>}

        {!entries ? (
          <p className="loading-note">RETRIEVING RUN ARCHIVES…</p>
        ) : entries.length === 0 ? (
          <p className="empty-note">No runs archived yet — claim the inaugural record.</p>
        ) : (
          <ol className="leaderboard-list">
            {entries.map((entry) => {
              const isActive = entry.nickname === player?.nickname;
              return (
                <li
                  className={`leaderboard-entry ${isActive ? 'active-score' : ''}`}
                  key={`${entry.rank}-${entry.nickname}`}
                >
                  <div className="entry-left">
                    <span className={`rank-tag rank-${entry.rank <= 3 ? entry.rank : 'standard'}`}>
                      #{entry.rank}
                    </span>
                    <span className="entry-name">{entry.nickname}</span>
                    {isActive && <span className="you-tag">YOU</span>}
                  </div>
                  <div className="entry-right">
                    <span className="entry-score">{entry.score.toLocaleString()} PTS</span>
                    <span className="entry-duration">{entry.survivalSeconds.toFixed(1)}s</span>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        <button className="primary-button leaderboard-play-btn" onClick={onPlay}>
          ENTER THE GAUNTLET
        </button>
      </section>
    </main>
  );
}
