import { useState } from 'react';
import { adminLogin } from '../services/apiClient.js';

export default function AdminLoginScreen({ onSignedIn, onBack }) {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminLogin(passphrase);
      onSignedIn();
    } catch {
      setError('Invalid authorization passphrase.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="overlay-screen">
      <form className="setup-card cabinet-card" onSubmit={submit}>
        <div className="cabinet-modal-header">
          <h2 className="cabinet-modal-title">BOOTH ADMINISTRATION</h2>
          <p className="cabinet-modal-sub">SECURITY CHECKPOINT · MASTER PASSPHRASE</p>
        </div>
        <p className="setup-sub">
          Authorized personnel access for live analytics, obstacle collision telemetry, and booth performance logs.
        </p>

        <div className="input-group">
          <label htmlFor="adminPassphrase">MASTER PASSPHRASE</label>
          <input
            id="adminPassphrase"
            type="password"
            autoFocus
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            placeholder="Enter passphrase"
          />
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button setup-submit-btn cabinet-btn-primary" disabled={busy}>
          {busy ? 'VERIFYING…' : 'AUTHENTICATE'}
        </button>

        <div className="setup-actions">
          <button type="button" className="text-button cabinet-btn-secondary" onClick={onBack}>
            RETURN TO TITLE
          </button>
        </div>
      </form>
    </main>
  );
}
