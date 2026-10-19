import { useState } from 'react';

export default function PlayerSetupScreen({ onCreate, onContinue, onCancel }) {
  const [nickname, setNickname] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [returning, setReturning] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (returning) {
        await onContinue(nickname, recoveryCode);
      } else {
        await onCreate(nickname);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="overlay-screen">
      <form className="setup-card" onSubmit={submit}>
        <p className="eyebrow">PROFILE REGISTRATION</p>
        <h2>{returning ? 'Restore Arcade Profile' : 'Enter Player Call-Sign'}</h2>
        <p className="setup-sub">
          {returning
            ? 'Input your registered call-sign and secret recovery code to retrieve your collection.'
            : 'Your call-sign will be recorded in the local leaderboard and card binder.'}
        </p>

        <div className="input-group">
          <label htmlFor="nickname">PLAYER CALL-SIGN</label>
          <input
            id="nickname"
            value={nickname}
            maxLength="16"
            autoFocus
            onChange={(event) => setNickname(event.target.value)}
            placeholder="2–16 characters (e.g. ROOKIE)"
            autoComplete="off"
          />
        </div>

        {returning && (
          <div className="input-group">
            <label htmlFor="recoveryCode">SECRET RECOVERY CODE</label>
            <input
              id="recoveryCode"
              value={recoveryCode}
              onChange={(event) => setRecoveryCode(event.target.value)}
              placeholder="e.g. DL-XXXX-XXXX"
              autoComplete="off"
            />
          </div>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button setup-submit-btn" disabled={saving}>
          {saving ? 'AUTHENTICATING…' : returning ? 'RESTORE ARCHIVE' : 'ENTER GAUNTLET'}
        </button>

        <div className="setup-actions">
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setReturning(!returning);
              setError('');
            }}
          >
            {returning ? 'CREATE NEW CALL-SIGN' : 'RESTORE WITH RECOVERY CODE'}
          </button>
          <button className="text-button" type="button" onClick={onCancel}>
            RETURN TO TITLE
          </button>
        </div>
      </form>
    </main>
  );
}
