export default function PlayerCodeNotice({ player, onContinue }) {
  return (
    <main className="overlay-screen">
      <section className="setup-card code-notice-card">
        <p className="eyebrow">RECOVERY CREDENTIALS</p>
        <h2>Welcome, {player.nickname}</h2>
        <p className="setup-sub">
          Record this secret recovery code. It allows you to restore your card binder and personal best scores on any arcade session.
        </p>
        <div className="code-display-wrap">
          <span className="code-label">YOUR RECOVERY CODE</span>
          <output className="recovery-code">{player.recoveryCode}</output>
        </div>
        <button className="primary-button code-continue-btn" onClick={onContinue}>
          ENTER THE GAUNTLET
        </button>
      </section>
    </main>
  );
}
