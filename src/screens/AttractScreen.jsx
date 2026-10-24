import PokeBalloonEmblem from '../components/PokeBalloonEmblem.jsx';

export default function AttractScreen({ onPlay }) {
  return (
    <main className="attract-screen">
      <section className="attract-content hero-panel">
        <PokeBalloonEmblem />
        <span className="cartoon-pill-badge">CURSED CARNIVAL CODEX</span>
        <h1 className="brand-title">GRIMDEX</h1>
        <p className="summary">
          Survive the haunted fairgrounds. Assemble all 5 stage cards within 60 seconds to unlock each entity in the Lost Codex before the Grimlight consumes you.
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
