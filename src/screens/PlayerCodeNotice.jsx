import { useEffect } from 'react';

export default function PlayerCodeNotice({ player, onContinue }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        onContinue();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  const cleanSection = (player?.section || '').replace(/^#+/, '').toUpperCase();

  return (
    <main className="overlay-screen">
      <section
        className="setup-card code-notice-card cabinet-card"
        style={{
          maxWidth: '480px',
          width: '94%',
          padding: '1.4rem 1.6rem',
          margin: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div className="cabinet-modal-header" style={{ width: '100%', marginBottom: '0.2rem' }}>
          <span className="cabinet-modal-sub" style={{ letterSpacing: '0.14em', color: '#10b981', fontWeight: 800, fontSize: '0.72rem' }}>
            REGISTRATION CONFIRMED · CREDENTIALS ISSUED
          </span>
          <h2 className="cabinet-modal-title" style={{ fontSize: '1.45rem', margin: '3px 0 3px 0' }}>
            CALL-SIGN ASSIGNED
          </h2>
          <p className="cabinet-modal-sub" style={{ color: '#cbd5e1', fontSize: '0.76rem' }}>
            RECORDED IN PARTICIPANT REGISTRY & LIVE LEADERBOARD
          </p>
        </div>

        {/* Glowing Golden Arcade Call-Sign Plaque */}
        <div
          className="callsign-plaque"
          style={{
            width: '100%',
            background: 'linear-gradient(145deg, #181226 0%, #0d0a18 100%)',
            border: '2px solid #d4a349',
            boxShadow: '0 0 20px rgba(212, 163, 73, 0.35), inset 0 0 12px rgba(212, 163, 73, 0.12)',
            borderRadius: '10px',
            padding: '12px 16px',
            margin: '8px 0 6px 0',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#d4a349',
              letterSpacing: '0.14em',
              marginBottom: '4px',
            }}
          >
            ASSIGNED ARCADE CALL-SIGN
          </span>
          <strong
            style={{
              display: 'block',
              fontFamily: 'monospace, monospace',
              fontSize: '1.85rem',
              fontWeight: 900,
              color: '#facc15',
              letterSpacing: '0.1em',
              textShadow: '0 0 16px rgba(250, 204, 21, 0.65), 0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {player?.nickname}
          </strong>
        </div>

        {/* Participant Details Well */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            margin: '4px 0 8px 0',
            padding: '10px 14px',
            background: '#090610',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.04em' }}>PARTICIPANT:</span>
            <strong style={{ color: '#f8fafc', letterSpacing: '0.02em' }}>{player?.fullName || player?.nickname}</strong>
          </div>
          {cleanSection && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
              <span style={{ color: '#94a3b8', fontWeight: 700, letterSpacing: '0.04em' }}>SECTION:</span>
              <span
                style={{
                  color: '#38bdf8',
                  fontWeight: 900,
                  padding: '2px 9px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '4px',
                  letterSpacing: '0.06em',
                  fontSize: '0.78rem',
                }}
              >
                {cleanSection}
              </span>
            </div>
          )}
        </div>

        {/* Recovery Code Well */}
        <div className="code-display-wrap cabinet-telemetry-well" style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box' }}>
          <span className="code-label stat-label" style={{ letterSpacing: '0.12em', color: '#fbbf24', fontSize: '0.68rem' }}>
            SECRET RECOVERY CODE
          </span>
          <output className="recovery-code stat-val" style={{ letterSpacing: '0.1em', fontSize: '1.25rem' }}>
            {player?.recoveryCode}
          </output>
        </div>

        <button
          className="primary-button code-continue-btn cabinet-btn-primary"
          onClick={onContinue}
          style={{ width: '100%', marginTop: '10px', padding: '0.85rem', fontSize: '0.92rem' }}
          autoFocus
        >
          COMMENCE GAUNTLET [PRESS SPACE]
        </button>
      </section>
    </main>
  );
}
