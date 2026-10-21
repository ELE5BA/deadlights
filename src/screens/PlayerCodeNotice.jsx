export default function PlayerCodeNotice({ player, onContinue }) {
  return (
    <main className="overlay-screen">
      <section className="setup-card code-notice-card cabinet-card">
        <div className="cabinet-modal-header">
          <h2 className="cabinet-modal-title">WELCOME, {player.nickname.toUpperCase()}</h2>
          <p className="cabinet-modal-sub">RECOVERY CREDENTIALS · KEEP THIS SECRET CODE SAFE</p>
        </div>
        <p className="setup-sub">
          Record this secret recovery code. It allows you to restore your card binder and personal best scores on any arcade session.
        </p>
        <div className="code-display-wrap cabinet-telemetry-well">
          <span className="code-label stat-label">YOUR RECOVERY CODE</span>
          <output className="recovery-code stat-val">{player.recoveryCode}</output>
        </div>
        <button className="primary-button code-continue-btn cabinet-btn-primary" onClick={onContinue}>
          ENTER THE GAUNTLET [PRESS SPACE]
        </button>
      </section>
    </main>
  );
}
