export default function AttractScreen({ onPlay }) {
  return (
    <main className="attract-screen">
      <section className="attract-content hero-panel">
        <p className="eyebrow">MIDNIGHT CARNIVAL · 60-SECOND ARCADE RUNNER</p>
        <h1>DEADLIGHTS <span>3D</span></h1>
        <p className="subtitle">The Lost Pokédex</p>
        <p className="summary">
          Survive the haunted fairgrounds. Assemble all five stage cards within 60 seconds to unlock each entity in the Lost Pokédex before the Deadlights claim you.
        </p>
        <button className="primary-button attract-play-btn" onClick={onPlay}>
          COMMENCE RUN
        </button>
        <p className="control-note">
          A / D / ARROWS TO STEER &nbsp;·&nbsp; SPACE TO LEAP
        </p>
      </section>
    </main>
  );
}
