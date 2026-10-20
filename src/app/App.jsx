import { useEffect, useState } from 'react';
import { continuePlayer, createPlayer, getHealth } from '../services/apiClient.js';
import PlayerSetupScreen from '../screens/PlayerSetupScreen.jsx';
import PlayerCodeNotice from '../screens/PlayerCodeNotice.jsx';
import GameScreen from '../screens/GameScreen.jsx';
import ResultsScreen from '../screens/ResultsScreen.jsx';
import CollectionScreen from '../screens/CollectionScreen.jsx';
import LeaderboardScreen from '../screens/LeaderboardScreen.jsx';
import AdminLoginScreen from '../screens/AdminLoginScreen.jsx';
import AnalyticsDashboardScreen from '../screens/AnalyticsDashboardScreen.jsx';
import PokeBalloonEmblem from '../components/PokeBalloonEmblem.jsx';
import HomeBackgroundCanvas from '../components/HomeBackgroundCanvas.jsx';
import { RUNNER_ROSTER } from '../game/entities/PlayerCharacter.js';
import {
  isMuted,
  toggleMute,
  subscribeMuteChange,
  playButtonClickSfx,
} from '../game/soundEffects.js';

function RunnerMiniAvatar({ runnerId }) {
  switch (runnerId) {
    case 'pika-georgie':
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" className="runner-mini-svg">
          <path d="M12 18 L6 4 L14 10 Z" fill="#ffd000" stroke="#120b1d" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M6 4 L9 6 L7 10 Z" fill="#120b1d" />
          <path d="M36 18 L42 4 L34 10 Z" fill="#ffd000" stroke="#120b1d" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M42 4 L39 6 L41 10 Z" fill="#120b1d" />
          <circle cx="24" cy="26" r="14" fill="#ffd000" stroke="#120b1d" strokeWidth="2.5" />
          <circle cx="24" cy="28" r="9" fill="#fde047" />
          <circle cx="17" cy="30" r="2.4" fill="#ef4444" />
          <circle cx="31" cy="30" r="2.4" fill="#ef4444" />
          <circle cx="20" cy="26" r="1.5" fill="#120b1d" />
          <circle cx="28" cy="26" r="1.5" fill="#120b1d" />
          <path d="M22 31 Q24 33 26 31" fill="none" stroke="#120b1d" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'mimikyu-kid':
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" className="runner-mini-svg">
          <path d="M14 20 L10 6 L18 12 Z" fill="#eab308" stroke="#120b1d" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M10 6 L12 8 L10 11 Z" fill="#120b1d" />
          <path d="M32 18 L38 12 L44 14 L36 22 Z" fill="#eab308" stroke="#120b1d" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M44 14 L40 13 L42 16 Z" fill="#120b1d" />
          <circle cx="24" cy="26" r="14" fill="#eab308" stroke="#120b1d" strokeWidth="2.5" />
          <path d="M18 22 Q20 20 22 23" fill="none" stroke="#120b1d" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 23 Q28 20 30 22" fill="none" stroke="#120b1d" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 30 L21 32 L24 30 L27 32 L30 30" fill="none" stroke="#120b1d" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="21" cy="35" r="1.5" fill="#c084fc" />
          <circle cx="27" cy="35" r="1.5" fill="#c084fc" />
        </svg>
      );
    case 'gengar-hood':
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" className="runner-mini-svg">
          <path d="M12 18 L8 7 L17 14 Z" fill="#7e22ce" stroke="#120b1d" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M36 18 L40 7 L31 14 Z" fill="#7e22ce" stroke="#120b1d" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="24" cy="26" r="14" fill="#7e22ce" stroke="#120b1d" strokeWidth="2.5" />
          <path d="M16 23 L22 25 L18 27 Z" fill="#dc2626" stroke="#120b1d" strokeWidth="1.2" />
          <path d="M32 23 L26 25 L30 27 Z" fill="#dc2626" stroke="#120b1d" strokeWidth="1.2" />
          <path d="M17 30 Q24 36 31 30 Z" fill="#f8fafc" stroke="#120b1d" strokeWidth="1.8" />
          <path d="M20 30 L20 33 M24 30 L24 34 M28 30 L28 33" stroke="#120b1d" strokeWidth="1.2" />
        </svg>
      );
    case 'litwick-runner':
    default:
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" className="runner-mini-svg">
          <path d="M24 2 Q28 8 26 12 Q24 15 22 12 Q20 8 24 2 Z" fill="#38bdf8" stroke="#120b1d" strokeWidth="1.8" />
          <circle cx="24" cy="10" r="2.2" fill="#a855f7" />
          <circle cx="24" cy="26" r="14" fill="#f8fafc" stroke="#120b1d" strokeWidth="2.5" />
          <path d="M16 22 Q17 28 18 24 Q19 32 21 26" fill="none" stroke="#e2e8f0" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="19" cy="26" rx="2.5" ry="1.8" fill="#eab308" stroke="#120b1d" strokeWidth="1.2" />
          <ellipse cx="29" cy="26" rx="2.5" ry="1.8" fill="#eab308" stroke="#120b1d" strokeWidth="1.2" />
          <circle cx="19" cy="26" r="1" fill="#7e22ce" />
          <circle cx="29" cy="26" r="1" fill="#7e22ce" />
          <circle cx="24" cy="31" r="1.2" fill="#120b1d" />
        </svg>
      );
  }
}

export default function App() {
  const [health, setHealth] = useState({ state: 'checking' });
  const [screen, setScreen] = useState('attract');
  const [player, setPlayer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('deadlights.activePlayer'));
    } catch {
      return null;
    }
  });
  const [selectedRunner, setSelectedRunner] = useState(() => {
    return localStorage.getItem('deadlights.selectedRunner') || 'pika-georgie';
  });
  const [soundMuted, setSoundMuted] = useState(() => isMuted());
  const [result, setResult] = useState(null);

  useEffect(() => {
    getHealth()
      .then((data) => setHealth({ state: 'ready', data }))
      .catch(() => setHealth({ state: 'unavailable' }));
  }, []);

  useEffect(() => {
    return subscribeMuteChange(setSoundMuted);
  }, []);

  function setActivePlayer(nextPlayer) {
    const resolved = typeof nextPlayer === 'function' ? nextPlayer(player) : nextPlayer;
    setPlayer(resolved);
    localStorage.setItem('deadlights.activePlayer', JSON.stringify(resolved));
  }

  function handleSelectRunner(runnerId) {
    playButtonClickSfx();
    setSelectedRunner(runnerId);
    localStorage.setItem('deadlights.selectedRunner', runnerId);
  }

  // Active Game Screen has its own dedicated 3D canvas (Home background canvas is unmounted)
  if (screen === 'game') {
    return (
      <GameScreen
        player={player}
        runnerId={selectedRunner}
        onFinished={(savedResult) => {
          setResult(savedResult);
          setActivePlayer((current) => ({
            ...current,
            wallet: savedResult.wallet,
            bestScore: savedResult.bestScore,
          }));
          setScreen('results');
        }}
      />
    );
  }

  return (
    <div className="app-root-wrapper">
      {/* 3D Live Scrolling Background Carnival Track (active across all menu & binder screens) */}
      <HomeBackgroundCanvas runnerId={selectedRunner} />

      {screen === 'setup' && (
        <PlayerSetupScreen
          onCancel={() => setScreen('attract')}
          onCreate={async (nickname) => {
            const created = await createPlayer(nickname);
            setActivePlayer(created);
            setScreen('code');
          }}
          onContinue={async (nickname, recoveryCode) => {
            setActivePlayer(await continuePlayer(nickname, recoveryCode));
            setScreen('attract');
          }}
        />
      )}

      {screen === 'code' && (
        <PlayerCodeNotice player={player} onContinue={() => setScreen('game')} />
      )}

      {screen === 'results' && (
        <ResultsScreen
          result={result}
          onPlayAgain={() => setScreen('game')}
          onTitle={() => setScreen('attract')}
          onCollection={() => setScreen('collection')}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}

      {screen === 'collection' && (
        <CollectionScreen
          player={player}
          onBack={() => setScreen('attract')}
          onPlayerUpdate={setActivePlayer}
        />
      )}

      {screen === 'leaderboard' && (
        <LeaderboardScreen
          player={player}
          onBack={() => setScreen('attract')}
          onPlay={() => (player ? setScreen('game') : setScreen('setup'))}
        />
      )}

      {screen === 'admin-login' && (
        <AdminLoginScreen onBack={() => setScreen('attract')} onSignedIn={() => setScreen('analytics')} />
      )}

      {screen === 'analytics' && (
        <AnalyticsDashboardScreen onExit={() => setScreen('attract')} />
      )}

      {screen === 'attract' && (
        <main className="app-shell arcade-title-shell">
          {/* Top Audio Toggle Button */}
          <button
            className="hud-sound-toggle-btn title-sound-btn"
            onClick={() => {
              playButtonClickSfx();
              toggleMute();
            }}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>

          <section className="hero-panel arcade-title-panel" aria-labelledby="title">
            <PokeBalloonEmblem />
            <span className="cartoon-pill-badge">CURSED CARNIVAL POKÉDEX</span>
            <h1 id="title" className="brand-title floating-title">HEXEDEX</h1>
            <p className="summary">
              Survive the haunted fairgrounds. Assemble all 5 stage cards within 60 seconds to unlock each entity in the Lost Pokédex before the Deadlights claim you.
            </p>

            {/* Interactive Runner Selector Strip */}
            <section className="runner-selector-strip" aria-label="Select Playable Runner">
              <span className="runner-selector-label">SELECT RUNNER</span>
              <div className="runner-cards-row">
                {RUNNER_ROSTER.map((runner) => {
                  const isSelected = runner.id === selectedRunner;
                  return (
                    <button
                      key={runner.id}
                      type="button"
                      className={`runner-card-btn ${isSelected ? 'runner-card-selected' : ''}`}
                      onClick={() => handleSelectRunner(runner.id)}
                      style={{
                        '--runner-theme': runner.color,
                        '--runner-accent': runner.accent,
                      }}
                      title={`${runner.name}: ${runner.desc}`}
                    >
                      {isSelected && <span className="active-runner-badge">ACTIVE</span>}
                      <div className="runner-avatar-frame">
                        <RunnerMiniAvatar runnerId={runner.id} />
                      </div>
                      <strong className="runner-card-name">{runner.name}</strong>
                      <span className="runner-card-title">{runner.title}</span>
                      <span className="runner-card-badge">{runner.badge}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <button
              className="primary-button hero-start-btn"
              onClick={() => {
                playButtonClickSfx();
                player ? setScreen('game') : setScreen('setup');
              }}
              disabled={health.state !== 'ready'}
            >
              {player ? `COMMENCE RUN AS ${player.nickname.toUpperCase()}` : 'ENTER THE GAUNTLET'}
            </button>

            <nav className="home-links">
              <button
                className="text-button"
                onClick={() => {
                  playButtonClickSfx();
                  setScreen('leaderboard');
                }}
              >
                LEADERBOARD
              </button>
              {player && (
                <>
                  <span className="home-link-divider">·</span>
                  <button
                    className="text-button"
                    onClick={() => {
                      playButtonClickSfx();
                      setScreen('collection');
                    }}
                  >
                    POKÉDEX BINDER ({player.wallet?.shardsBalance ?? 0} SHARDS)
                  </button>
                  <span className="home-link-divider">·</span>
                  <button
                    className="text-button"
                    onClick={() => {
                      playButtonClickSfx();
                      localStorage.removeItem('deadlights.activePlayer');
                      setPlayer(null);
                    }}
                  >
                    SWITCH PROFILE
                  </button>
                </>
              )}
              <span className="home-link-divider">·</span>
              <button
                className="text-button"
                onClick={() => {
                  playButtonClickSfx();
                  setScreen('admin-login');
                }}
              >
                ADMIN
              </button>
            </nav>
          </section>
        </main>
      )}
    </div>
  );
}
