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
import InstructionsModal from '../components/InstructionsModal.jsx';
import { RUNNER_ROSTER } from '../game/entities/PlayerCharacter.js';
import RunnerPortraitCanvas from '../components/RunnerPortraitCanvas.jsx';
import {
  isMuted,
  toggleMute,
  subscribeMuteChange,
  playButtonClickSfx,
} from '../game/soundEffects.js';

function DashboardIcon({ className = 'home-dash-icon' }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: '5px' }}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 16v-4" />
      <path d="M12 16v-7" />
      <path d="M17 16v-2" />
    </svg>
  );
}

function AudioSpeakerIcon({ muted }) {
  if (muted) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" fillOpacity="0.3" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" fillOpacity="0.3" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

const RUNNER_TRAITS = {
  'pika-georgie': 'SPARK DASH',
  'mimikyu-kid': 'DECOY VEIL',
  'gengar-hood': 'SHADOW STEP',
  'litwick-runner': 'SOUL FLAME',
};

export default function App() {
  const isStandaloneAdmin = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).has('admin') ||
    window.location.pathname.startsWith('/admin')
  );

  if (isStandaloneAdmin) {
    return (
      <AnalyticsDashboardScreen
        onExit={() => {
          if (window.opener && !window.opener.closed) {
            window.close();
          } else {
            window.location.href = window.location.pathname.replace(/\/admin.*$/, '') || '/';
          }
        }}
      />
    );
  }

  const [health, setHealth] = useState({ state: 'checking' });
  const [screen, setScreen] = useState('attract');
  const [adminToast, setAdminToast] = useState(null);
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
  const [attractStage, setAttractStage] = useState({ stage: 1, name: 'The Twilight Mist' });
  const [showInstructions, setShowInstructions] = useState(false);

  const handleOpenAdminWindow = () => {
    playButtonClickSfx();
    const adminUrl = `${window.location.origin}${window.location.pathname}?admin=true`;
    const win = window.open(
      adminUrl,
      'GrimdexAdminDashboard',
      'width=1440,height=920,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
    );
    if (win) {
      win.focus();
      setAdminToast({
        type: 'opened',
        message: 'Admin console opened in a separate window. You can play the game and monitor live telemetry simultaneously!',
      });
      setTimeout(() => setAdminToast(null), 8000);
    } else {
      setAdminToast({
        type: 'blocked',
        message: 'Popup window was blocked by your browser. Click here to open Admin Console in a new tab.',
        url: adminUrl,
      });
    }
  };

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
      <HomeBackgroundCanvas runnerId={selectedRunner} onStageChange={setAttractStage} />

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
            <AudioSpeakerIcon muted={soundMuted} />
          </button>

          <section className="hero-panel arcade-title-panel" aria-labelledby="title">
            <PokeBalloonEmblem />
            <span className="cartoon-pill-badge">CURSED CARNIVAL CODEX</span>
            <h1 id="title" className="brand-title floating-title">GRIMDEX</h1>
            <p className="summary">
              Survive the haunted fairgrounds. Assemble all 5 stage cards within 60 seconds to unlock each entity in the Lost Codex before the Grimlight consumes you.
            </p>

            {/* Interactive Runner Selector Strip */}
            <section className="runner-selector-strip" aria-label="Select Playable Runner">
              <span className="runner-selector-label">SELECT RUNNER</span>
              <div className="runner-cards-row">
                {RUNNER_ROSTER.map((runner) => {
                  const isSelected = runner.id === selectedRunner;
                  const trait = RUNNER_TRAITS[runner.id] || runner.badge;
                  return (
                    <button
                      key={runner.id}
                      type="button"
                      className={`runner-card-btn ${isSelected ? 'runner-card-selected' : ''}`}
                      onClick={() => handleSelectRunner(runner.id)}
                      style={{
                        '--runner-theme': runner.color,
                        '--runner-accent': runner.accentColor || runner.accent || '#f59e0b',
                      }}
                      title={`${runner.name}: ${runner.desc}`}
                    >
                      {isSelected ? (
                        <span className="active-runner-badge">★ P1 SELECTED ★</span>
                      ) : (
                        <span className="inactive-runner-tag">P1 SELECT</span>
                      )}
                      <div className="runner-avatar-frame">
                        <div className="runner-avatar-sunburst" />
                        <RunnerPortraitCanvas runnerId={runner.id} />
                      </div>
                      <strong className="runner-card-name">{runner.name}</strong>
                      <span className="runner-card-title">{runner.title}</span>
                      <span className="runner-arcade-trait-pill">{trait}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <button
              className="primary-button hero-start-btn"
              onClick={() => {
                playButtonClickSfx();
                if (!player) {
                  setScreen('setup');
                  return;
                }
                const skip = localStorage.getItem('deadlights.skipInstructions') === 'true';
                if (skip) {
                  setScreen('game');
                } else {
                  setShowInstructions(true);
                }
              }}
              disabled={health.state !== 'ready'}
            >
              {player ? `COMMENCE RUN AS ${(player.fullName || player.nickname).toUpperCase()}` : 'ENTER THE GAUNTLET'}
            </button>

            <nav className="home-links">
              <button
                className="text-button"
                onClick={() => {
                  playButtonClickSfx();
                  setShowInstructions(true);
                }}
              >
                HOW TO PLAY
              </button>
              <span className="home-link-divider">·</span>
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
                className="text-button home-admin-link"
                onClick={handleOpenAdminWindow}
                title="Open Booth Administration & Analytics Dashboard in Separate Window"
              >
                <DashboardIcon /> ADMIN CONSOLE
              </button>
            </nav>

            {/* Live Attract Stage Pill */}
            <div className="attract-stage-pill" aria-live="polite">
              <span className="attract-dot" /> ATTRACT PREVIEW · STAGE {attractStage.stage}: {attractStage.name.toUpperCase()}
            </div>
          </section>

          {/* Cross-Window Admin Launch Toast */}
          {adminToast && (
            <div className="admin-launch-toast" role="status">
              <div className="toast-text">
                <strong>BOOTH OPS:</strong> {adminToast.message}
              </div>
              {adminToast.url && (
                <a
                  href={adminToast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="toast-action-btn"
                >
                  OPEN IN NEW TAB
                </a>
              )}
              <button
                className="toast-close-btn"
                onClick={() => setAdminToast(null)}
                aria-label="Dismiss message"
              >
                ✕
              </button>
            </div>
          )}
        </main>
      )}

      {showInstructions && (
        <InstructionsModal
          onStart={() => {
            setShowInstructions(false);
            if (player) {
              setScreen('game');
            } else {
              setScreen('setup');
            }
          }}
          onClose={() => setShowInstructions(false)}
          startButtonText={player ? `COMMENCE RUN AS ${(player.fullName || player.nickname).toUpperCase()}` : 'ENTER THE GAUNTLET'}
        />
      )}
    </div>
  );
}
