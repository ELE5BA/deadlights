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
import RunnerPortraitCanvas from '../components/RunnerPortraitCanvas.jsx';
import {
  isMuted,
  toggleMute,
  subscribeMuteChange,
  playButtonClickSfx,
} from '../game/soundEffects.js';

const RUNNER_TRAITS = {
  'pika-georgie': '⚡ SPARK DASH',
  'mimikyu-kid': '🎭 DECOY VEIL',
  'gengar-hood': '👻 SHADOW STEP',
  'litwick-runner': '🔥 SOUL FLAME',
};

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
  const [attractStage, setAttractStage] = useState({ stage: 1, name: 'The Twilight Mist' });

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

            {/* Live Attract Stage Pill */}
            <div className="attract-stage-pill" aria-live="polite">
              <span className="attract-dot" /> ATTRACT PREVIEW · STAGE {attractStage.stage}: {attractStage.name.toUpperCase()}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
