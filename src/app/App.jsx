import { useEffect, useState } from 'react';
import { continuePlayer, createPlayer, getHealth } from '../services/apiClient.js';
import AttractScreen from '../screens/AttractScreen.jsx';
import PlayerSetupScreen from '../screens/PlayerSetupScreen.jsx';
import PlayerCodeNotice from '../screens/PlayerCodeNotice.jsx';
import GameScreen from '../screens/GameScreen.jsx';
import ResultsScreen from '../screens/ResultsScreen.jsx';
import CollectionScreen from '../screens/CollectionScreen.jsx';
import LeaderboardScreen from '../screens/LeaderboardScreen.jsx';
import AdminLoginScreen from '../screens/AdminLoginScreen.jsx';
import AnalyticsDashboardScreen from '../screens/AnalyticsDashboardScreen.jsx';

import PokeBalloonEmblem from '../components/PokeBalloonEmblem.jsx';

export default function App() {
  const [health, setHealth] = useState({ state: 'checking' });
  const [screen, setScreen] = useState('attract');
  const [player, setPlayer] = useState(() => { try { return JSON.parse(localStorage.getItem('deadlights.activePlayer')); } catch { return null; } });
  const [result, setResult] = useState(null);

  useEffect(() => {
    getHealth()
      .then((data) => setHealth({ state: 'ready', data }))
      .catch(() => setHealth({ state: 'unavailable' }));
  }, []);

  function setActivePlayer(nextPlayer) { const resolved = typeof nextPlayer === 'function' ? nextPlayer(player) : nextPlayer; setPlayer(resolved); localStorage.setItem('deadlights.activePlayer', JSON.stringify(resolved)); }
  if (screen === 'setup') return <PlayerSetupScreen onCancel={() => setScreen('attract')} onCreate={async (nickname) => { const created = await createPlayer(nickname); setActivePlayer(created); setScreen('code'); }} onContinue={async (nickname, recoveryCode) => { setActivePlayer(await continuePlayer(nickname, recoveryCode)); setScreen('attract'); }} />;
  if (screen === 'code') return <PlayerCodeNotice player={player} onContinue={() => setScreen('game')} />;
  if (screen === 'game') return <GameScreen player={player} onFinished={(savedResult) => { setResult(savedResult); setActivePlayer((current) => ({ ...current, wallet: savedResult.wallet, bestScore: savedResult.bestScore })); setScreen('results'); }} />;
  if (screen === 'results') return <ResultsScreen result={result} onPlayAgain={() => setScreen('game')} onTitle={() => setScreen('attract')} onCollection={() => setScreen('collection')} onLeaderboard={() => setScreen('leaderboard')} />;
  if (screen === 'collection') return <CollectionScreen player={player} onBack={() => setScreen('attract')} onPlayerUpdate={setActivePlayer} />;
  if (screen === 'leaderboard') return <LeaderboardScreen player={player} onBack={() => setScreen('attract')} onPlay={() => player ? setScreen('game') : setScreen('setup')} />;
  if (screen === 'admin-login') return <AdminLoginScreen onBack={() => setScreen('attract')} onSignedIn={() => setScreen('analytics')} />;
  if (screen === 'analytics') return <AnalyticsDashboardScreen onExit={() => setScreen('attract')} />;
  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="title">
        <PokeBalloonEmblem />
        <span className="cartoon-pill-badge">CURSED CARNIVAL POKÉDEX</span>
        <h1 id="title" className="brand-title">HEXEDEX</h1>
        <p className="summary">
          Survive the haunted fairgrounds. Assemble all 5 stage cards within 60 seconds to unlock each entity in the Lost Pokédex before the Deadlights claim you.
        </p>
        <button
          className="primary-button hero-start-btn"
          onClick={() => (player ? setScreen('game') : setScreen('setup'))}
          disabled={health.state !== 'ready'}
        >
          {player ? `COMMENCE RUN AS ${player.nickname.toUpperCase()}` : 'ENTER THE GAUNTLET'}
        </button>

        <nav className="home-links">
          <button className="text-button" onClick={() => setScreen('leaderboard')}>
            LEADERBOARD
          </button>
          {player && (
            <>
              <span className="home-link-divider">·</span>
              <button className="text-button" onClick={() => setScreen('collection')}>
                CARD BINDER ({player.wallet?.shardsBalance ?? 0} SHARDS)
              </button>
              <span className="home-link-divider">·</span>
              <button
                className="text-button"
                onClick={() => {
                  localStorage.removeItem('deadlights.activePlayer');
                  setPlayer(null);
                }}
              >
                SWITCH PROFILE
              </button>
            </>
          )}
          <span className="home-link-divider">·</span>
          <button className="text-button" onClick={() => setScreen('admin-login')}>
            ADMIN
          </button>
        </nav>
      </section>
    </main>
  );
}
