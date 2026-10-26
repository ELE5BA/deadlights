import { useState } from 'react';

export default function PlayerSetupScreen({ onCreate, onContinue, onCancel }) {
  const [fullName, setFullName] = useState('');
  const [section, setSection] = useState('');
  const [nickname, setNickname] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [returning, setReturning] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleSectionChange(e) {
    let val = e.target.value;
    setSection(val);
  }

  function handleSectionBlur() {
    if (section.trim() && !section.trim().startsWith('#')) {
      setSection(`#${section.trim()}`);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    if (returning) {
      if (!nickname.trim() && !fullName.trim()) {
        setError('Please enter your registered Name or Call-sign.');
        return;
      }
      if (!recoveryCode.trim()) {
        setError('Please enter your secret recovery code.');
        return;
      }
      setSaving(true);
      try {
        await onContinue(nickname.trim() || fullName.trim(), recoveryCode.trim());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setSaving(false);
      }
      return;
    }

    // Creating new player
    if (!fullName.trim()) {
      setError('Please enter your Name in [Last Name, First Name] format.');
      return;
    }

    if (!section.trim()) {
      setError('Please enter your Section [#Section].');
      return;
    }

    const formattedSection = section.trim().startsWith('#')
      ? section.trim()
      : `#${section.trim()}`;

    setSaving(true);
    try {
      await onCreate({
        fullName: fullName.trim(),
        section: formattedSection,
        nickname: nickname.trim(),
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="overlay-screen">
      <form className="setup-card cabinet-card" onSubmit={submit} style={{ maxWidth: '480px' }}>
        <div className="cabinet-modal-header">
          <span className="cabinet-modal-sub" style={{ letterSpacing: '0.14em', color: '#38bdf8', fontWeight: 700 }}>
            GRIMDEX · PARTICIPANT ROSTER
          </span>
          <h2 className="cabinet-modal-title">
            {returning ? 'RESTORE ARCHIVE' : 'PARTICIPANT REGISTRATION'}
          </h2>
          <p className="cabinet-modal-sub">
            {returning
              ? 'RECOVERY CREDENTIALS · RETRIEVE BINDER'
              : 'ROSTER REGISTRATION · RECORDED IN DASHBOARD'}
          </p>
        </div>

        <p className="setup-sub">
          {returning
            ? 'Input your registered Name / Call-sign and secret recovery code to retrieve your collection.'
            : 'Your Name and Section will be recorded in the Admin Dashboard participant registry and arcade leaderboard.'}
        </p>

        {!returning ? (
          <>
            {/* Field 1: Name [Last Name, First Name] */}
            <div className="input-group">
              <label htmlFor="fullName" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>PLAYER NAME [Last Name, First Name]</span>
                <span style={{ color: '#ef4444', fontSize: '0.78rem' }}>*REQUIRED</span>
              </label>
              <input
                id="fullName"
                value={fullName}
                maxLength="48"
                autoFocus
                required
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dela Cruz, Juan or Smith, John"
                autoComplete="name"
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                Format: <strong>[Last Name, First Name]</strong> for official records
              </span>
            </div>

            {/* Field 2: Section [#Section] */}
            <div className="input-group">
              <label htmlFor="section" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>CLASS / GROUP SECTION [#Section]</span>
                <span style={{ color: '#ef4444', fontSize: '0.78rem' }}>*REQUIRED</span>
              </label>
              <input
                id="section"
                value={section}
                maxLength="32"
                required
                onChange={handleSectionChange}
                onBlur={handleSectionBlur}
                placeholder="e.g. #Diamond or #Section-1"
                autoComplete="off"
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                Format: <strong>[#Section]</strong> (e.g. #Section 1, #CS-101, #Diamond)
              </span>
            </div>

            {/* Optional Field 3: Arcade Call-Sign */}
            <div className="input-group">
              <label htmlFor="nickname" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>ARCADE CALL-SIGN</span>
                <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>OPTIONAL</span>
              </label>
              <input
                id="nickname"
                value={nickname}
                maxLength="16"
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Leave blank to auto-generate from your name"
                autoComplete="off"
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                Short arcade HUD handle (2–16 alphanumeric characters)
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="input-group">
              <label htmlFor="nickname">CALL-SIGN OR FULL NAME</label>
              <input
                id="nickname"
                value={nickname}
                maxLength="32"
                autoFocus
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. ROOKIE or Dela Cruz, Juan"
                autoComplete="off"
              />
            </div>

            <div className="input-group">
              <label htmlFor="recoveryCode">SECRET RECOVERY CODE</label>
              <input
                id="recoveryCode"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                placeholder="e.g. DL-XXXX-XXXX"
                autoComplete="off"
              />
            </div>
          </>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button setup-submit-btn cabinet-btn-primary" disabled={saving}>
          {saving ? 'AUTHENTICATING…' : returning ? 'RESTORE ARCHIVE' : 'REGISTER & COMMENCE [SPACE]'}
        </button>

        <div className="setup-actions">
          <button
            className="text-button cabinet-btn-secondary"
            type="button"
            onClick={() => {
              setReturning(!returning);
              setError('');
            }}
          >
            {returning ? 'REGISTER NEW PARTICIPANT' : 'RESTORE WITH RECOVERY CODE'}
          </button>
          <button className="text-button cabinet-btn-secondary" type="button" onClick={onCancel}>
            RETURN TO TITLE
          </button>
        </div>
      </form>
    </main>
  );
}
