export default function PlayerCodeNotice({ player, onContinue }) {
  return (
    <main className="overlay-screen">
      <section className="setup-card code-notice-card cabinet-card" style={{ maxWidth: '480px' }}>
        <div className="cabinet-modal-header">
          <span className="cabinet-modal-sub" style={{ letterSpacing: '0.14em', color: '#10b981', fontWeight: 700 }}>
            REGISTRATION CONFIRMED · RECORD STORED
          </span>
          <h2 className="cabinet-modal-title">
            {player.fullName ? player.fullName.toUpperCase() : player.nickname.toUpperCase()}
          </h2>
          <p className="cabinet-modal-sub">
            {player.section ? `SECTION ${player.section} · ` : ''}CALL-SIGN: {player.nickname.toUpperCase()}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8' }}>RECORDED NAME:</span>
            <strong style={{ color: '#f8fafc' }}>{player.fullName || player.nickname}</strong>
          </div>
          {player.section && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#94a3b8' }}>CLASS SECTION:</span>
              <span style={{ color: '#38bdf8', fontWeight: 700, padding: '2px 8px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '4px' }}>
                {player.section}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8' }}>ARCADE CALL-SIGN:</span>
            <strong style={{ color: '#f59e0b' }}>{player.nickname}</strong>
          </div>
        </div>

        <p className="setup-sub" style={{ fontSize: '0.8rem' }}>
          Record this secret recovery code. It allows you to restore your card binder and personal records on any terminal.
        </p>

        <div className="code-display-wrap cabinet-telemetry-well">
          <span className="code-label stat-label">SECRET RECOVERY CODE</span>
          <output className="recovery-code stat-val">{player.recoveryCode}</output>
        </div>

        <button className="primary-button code-continue-btn cabinet-btn-primary" onClick={onContinue}>
          COMMENCE GAUNTLET [PRESS SPACE]
        </button>
      </section>
    </main>
  );
}
