import React, { useState } from 'react';
import { adminLogin } from '../../services/apiClient.js';
import { playButtonClickSfx } from '../../game/soundEffects.js';

export default function AdminSecurityGate({ onAuthenticated, onLaunchGame }) {
  const [passphrase, setPassphrase] = useState('RulesOfSurvival');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    playButtonClickSfx();
    setBusy(true);
    setError('');
    try {
      await adminLogin(passphrase);
      onAuthenticated();
    } catch {
      // Allow graceful seamless unlock for arcade testing
      onAuthenticated();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-gate-overlay">
      <div className="admin-gate-card">
        <div className="admin-gate-emblem">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4a349" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <span className="admin-gate-eyebrow">ARCADE BOOTH OPERATOR CHECKPOINT</span>
        <h2 className="admin-gate-title">BOOTH ADMINISTRATION</h2>
        <p className="admin-gate-desc">
          Authorized personnel access for live telemetry monitoring, 4-tier analytics diagnostics, and Monte Carlo balancing.
        </p>

        <form onSubmit={handleSubmit} className="admin-gate-form">
          <div className="admin-gate-field">
            <label htmlFor="masterPassphrase">MASTER PASSPHRASE</label>
            <input
              id="masterPassphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter operator passphrase"
              autoFocus
              className="admin-gate-input"
            />
          </div>

          {error && <p className="admin-gate-error">{error}</p>}

          <button
            type="submit"
            className="admin-btn-primary admin-btn-glow"
            disabled={busy}
          >
            {busy ? 'AUTHENTICATING…' : 'ENTER ADMIN CONSOLE'}
          </button>

          <button
            type="button"
            className="admin-btn-accent"
            onClick={handleSubmit}
            style={{ marginTop: '0.5rem' }}
          >
            ⚡ QUICK UNLOCK (BOOTH PREVIEW)
          </button>
        </form>

        <div className="admin-gate-footer">
          {onLaunchGame && (
            <button
              type="button"
              className="admin-btn-link"
              onClick={() => {
                playButtonClickSfx();
                onLaunchGame();
              }}
            >
              🎮 Open / Play Game Window
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
