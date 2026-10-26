import { useState } from 'react';

export default function PlayerSetupScreen({ onCreate, onContinue, onCancel }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [section, setSection] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [returning, setReturning] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');

    if (returning) {
      if (!identifier.trim()) {
        setError('Please enter your Call-Sign, Full Name, or First and Last Name.');
        return;
      }
      if (!recoveryCode.trim()) {
        setError('Please enter your secret recovery code.');
        return;
      }
      setSaving(true);
      try {
        await onContinue(identifier.trim(), recoveryCode.trim());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setSaving(false);
      }
      return;
    }

    // Creating new player
    if (!firstName.trim()) {
      setError('Please enter your First Name.');
      return;
    }

    if (!lastName.trim()) {
      setError('Please enter your Last Name.');
      return;
    }

    if (!section.trim()) {
      setError('Please enter your Section (e.g. 4ISB, 3ISA, 4ISA).');
      return;
    }

    const cleanSection = section.trim().replace(/^#+/, '').toUpperCase();

    setSaving(true);
    try {
      await onCreate({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        section: cleanSection,
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="overlay-screen">
      <form
        className="setup-card cabinet-card setup-card--neat"
        onSubmit={submit}
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '1.4rem 1.6rem',
          margin: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div className="cabinet-modal-header" style={{ width: '100%', marginBottom: '0.35rem' }}>
          <span className="cabinet-modal-sub" style={{ letterSpacing: '0.14em', color: '#d4a349', fontWeight: 800, fontSize: '0.72rem' }}>
            PARTICIPANT ROSTER
          </span>
          <h2 className="cabinet-modal-title" style={{ fontSize: '1.5rem', margin: '3px 0 4px 0' }}>
            {returning ? 'RESTORE ARCHIVE' : 'PARTICIPANT REGISTRATION'}
          </h2>
          <p className="cabinet-modal-sub" style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
            {returning
              ? 'ENTER CALL-SIGN OR FULL NAME & RECOVERY CODE'
              : 'ENTER NAME & SECTION · SPECIALIZED CALL-SIGN AUTO-GENERATED'}
          </p>
        </div>

        {!returning ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* Field 1 & 2: First Name and Last Name side-by-side in 2-column grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', width: '100%' }}>
              <div className="setup-field-group">
                <label
                  htmlFor="firstName"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#d4a349',
                    letterSpacing: '0.08em',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span>FIRST NAME</span>
                  <span style={{ color: '#ef4444', fontSize: '0.65rem', fontWeight: 900 }}>*REQ</span>
                </label>
                <input
                  id="firstName"
                  value={firstName}
                  maxLength="32"
                  autoFocus
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Juan"
                  autoComplete="given-name"
                  className="setup-neat-input"
                />
              </div>

              <div className="setup-field-group">
                <label
                  htmlFor="lastName"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#d4a349',
                    letterSpacing: '0.08em',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span>LAST NAME</span>
                  <span style={{ color: '#ef4444', fontSize: '0.65rem', fontWeight: 900 }}>*REQ</span>
                </label>
                <input
                  id="lastName"
                  value={lastName}
                  maxLength="32"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dela Cruz"
                  autoComplete="family-name"
                  className="setup-neat-input"
                />
              </div>
            </div>

            {/* Field 3: Section */}
            <div className="setup-field-group" style={{ width: '100%' }}>
              <label
                htmlFor="section"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#d4a349',
                  letterSpacing: '0.08em',
                  marginBottom: '0.25rem',
                }}
              >
                <span>SECTION</span>
                <span style={{ color: '#ef4444', fontSize: '0.65rem', fontWeight: 900 }}>*REQ</span>
              </label>
              <input
                id="section"
                value={section}
                maxLength="16"
                required
                onChange={(e) => setSection(e.target.value)}
                placeholder="4ISB"
                autoComplete="off"
                className="setup-neat-input"
              />
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div className="setup-field-group" style={{ width: '100%' }}>
              <label
                htmlFor="identifier"
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#d4a349',
                  letterSpacing: '0.08em',
                  marginBottom: '0.25rem',
                }}
              >
                CALL-SIGN OR FULL NAME
              </label>
              <input
                id="identifier"
                value={identifier}
                maxLength="48"
                autoFocus
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. JUAN_DEL4ISB or Dela Cruz, Juan"
                autoComplete="off"
                className="setup-neat-input"
              />
            </div>

            <div className="setup-field-group" style={{ width: '100%' }}>
              <label
                htmlFor="recoveryCode"
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#d4a349',
                  letterSpacing: '0.08em',
                  marginBottom: '0.25rem',
                }}
              >
                SECRET RECOVERY CODE
              </label>
              <input
                id="recoveryCode"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                placeholder="e.g. DL-XXXX-XXXX"
                autoComplete="off"
                className="setup-neat-input"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="form-error" role="alert" style={{ width: '100%', margin: '0.4rem 0 0', boxSizing: 'border-box' }}>
            {error}
          </p>
        )}

        <button
          className="primary-button setup-submit-btn cabinet-btn-primary"
          disabled={saving}
          style={{ width: '100%', marginTop: '0.85rem', padding: '0.85rem', fontSize: '0.92rem' }}
        >
          {saving ? 'AUTHENTICATING…' : returning ? 'RESTORE ARCHIVE' : 'REGISTER & COMMENCE [ENTER]'}
        </button>

        <div className="setup-actions" style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.65rem', justifyContent: 'center' }}>
          <button
            className="text-button cabinet-btn-secondary"
            type="button"
            onClick={() => {
              setReturning(!returning);
              setError('');
            }}
            style={{ fontSize: '0.76rem', padding: '0.45rem 0.85rem' }}
          >
            {returning ? 'NEW REGISTRATION' : 'RETURNING PLAYER?'}
          </button>
          <button
            className="text-button cabinet-btn-secondary"
            type="button"
            onClick={onCancel}
            style={{ fontSize: '0.76rem', padding: '0.45rem 0.85rem' }}
          >
            RETURN TO TITLE
          </button>
        </div>
      </form>
    </main>
  );
}
