import { useState, useEffect } from 'react';
import { playButtonClickSfx } from '../game/soundEffects.js';

export const STAGE_BRIEFINGS = {
  1: {
    stage: 1,
    name: 'The Twilight Mist',
    subtitle: 'Silent Carnival Grounds',
    speed: '15.0 m/s (Moderate)',
    hazards: [
      { name: 'Crate Blockers', action: 'DODGE LEFT / RIGHT', type: 'ROAD OBSTACLE', tip: 'Fixed crates blocking 1 lane. Shift into an open path.' },
      { name: 'Shadow Waves', action: 'JUMP / SPACE', type: 'GROUND WAVE', tip: 'Low crimson skimmer waves. Leap over them cleanly!' },
    ],
    objective: 'Collect 5 Bulba-Moss Card Fragments to purify the Mist.',
    proTip: 'Leap early when you see the red ground glow of an incoming wave.',
    cardReward: 'Bulba-Moss [Grass/Poison]',
    accentColor: '#38bdf8',
  },
  2: {
    stage: 2,
    name: 'The Amber Hollow',
    subtitle: 'Lingering Lantern Grove',
    speed: '18.0 m/s (+20% Velocity)',
    hazards: [
      { name: 'Swaying Specters', action: 'ANTICIPATE CURVE', type: 'CURVE HAZARD', tip: 'Curving sine-wave ghosts that drift side-to-side. Predict their arc!' },
      { name: 'Crate Blockers', action: 'DODGE', type: 'ROAD OBSTACLE', tip: 'Spawned near curve hazards to test lateral agility.' },
      { name: 'Shadow Waves', action: 'JUMP', type: 'GROUND WAVE', tip: 'Higher-velocity ground skimmers.' },
    ],
    objective: 'Collect 5 Pika-Lantern Fragments to cut through the lantern haze.',
    proTip: 'Stay in the center lane until you see which direction the specter curves.',
    cardReward: 'Pika-Lantern [Electric/Light]',
    accentColor: '#fbbf24',
  },
  3: {
    stage: 3,
    name: 'The Crimson Mire',
    subtitle: 'Watcher in the Red Weeds',
    speed: '21.0 m/s (Fast Tempo)',
    hazards: [
      { name: 'Double Blockades', action: 'FIND THE 1 OPEN LANE', type: 'TWIN BARRIER', tip: 'Twin hazard crates thrown simultaneously, sealing 2 of 3 lanes!' },
      { name: 'Swaying Specters', action: 'ANTICIPATE SWAY', type: 'CURVE HAZARD', tip: 'Faster oscillation frequency.' },
      { name: 'Shadow Waves', action: 'JUMP', type: 'GROUND WAVE', tip: 'Fast ground waves.' },
    ],
    objective: 'Collect 5 Static Moth Fragments to dispel the crimson swamp.',
    proTip: 'Look ahead for the single safe lane ring; dive into it immediately.',
    cardReward: 'Static Moth [Electric/Flying]',
    accentColor: '#f43f5e',
  },
  4: {
    stage: 4,
    name: 'The Glitch Rift',
    subtitle: 'Fractured Reality Field',
    speed: '24.5 m/s (High Speed)',
    hazards: [
      { name: 'Glitch Spacetime Shifts', action: 'QUICK REFLEXES', type: 'WARP HAZARD', tip: 'Hazard warning windows shrink and spawn frequency rises.' },
      { name: 'Double Blockades', action: 'RAPID LANE DIVE', type: 'TWIN BARRIER', tip: 'Aggressive twin-lane barricades.' },
      { name: 'Swaying Specters', action: 'DODGE CURVES', type: 'CURVE HAZARD', tip: 'Wide-angle curveballs.' },
    ],
    objective: 'Collect 5 Velvet Wisp Fragments to stabilize reality.',
    proTip: 'Return to center lane after each dodge so you are only 1 step from either side.',
    cardReward: 'Velvet Wisp [Ghost/Psychic]',
    accentColor: '#c084fc',
  },
  5: {
    stage: 5,
    name: 'The Abyssal Void',
    subtitle: 'The Darkness Closes In',
    speed: '28.5 m/s (Terminal Velocity)',
    hazards: [
      { name: 'Multi-Hazard Barrages', action: 'CHAIN EVASIONS', type: 'COMBO HAZARD', tip: 'Waves, specters, and double crates deployed in rapid succession.' },
      { name: 'Pennywise Stalking Close', action: 'NO ERRORS', type: 'PROXIMITY THREAT', tip: 'Pennywise hovers closer; zero leeway for sluggish reactions.' },
    ],
    objective: 'Collect 5 Clockwork Crow Fragments to break the void seal.',
    proTip: 'Chain your jump and lane-shift in one fluid movement without hesitating.',
    cardReward: 'Clockwork Crow [Steel/Dark]',
    accentColor: '#38bdf8',
  },
  6: {
    stage: 6,
    name: 'The Grimlight Core',
    subtitle: 'Apex Jester Confrontation',
    speed: '33.0 m/s (Apex Overdrive)',
    hazards: [
      { name: 'Apex Pennywise Barrage', action: 'MAXIMUM SURVIVAL', type: 'APEX GAUNTLET', tip: 'Full-track gauntlet barrage at maximum velocity.' },
      { name: 'Double Blockades', action: 'SPLIT-SECOND DODGE', type: 'TWIN BARRIER', tip: 'Rapid barrage of twin blocks.' },
    ],
    objective: 'Collect all 5 Final Fragments to trigger the 6-Card Hexedex banishment cutscene!',
    proTip: 'Focus strictly on oncoming telegraph rings. Catch the 5th card to claim victory!',
    cardReward: 'Grinfin [Apex Water/Dark]',
    accentColor: '#ff2a70',
  },
};

export default function InstructionsModal({
  onStart,
  onClose,
  startButtonText = 'ENTER THE GAUNTLET [ENTER]',
  initialTab = 'howtoplay',
  initialStage = 1,
  isStageTransition = false,
}) {
  const [activeTab, setActiveTab] = useState(initialTab === 'cards' ? 'howtoplay' : initialTab);
  const [selectedStage, setSelectedStage] = useState(initialStage);
  const [dontShowAgain, setDontShowAgain] = useState(
    () => localStorage.getItem('deadlights.skipInstructions') === 'true'
  );

  useEffect(() => {
    setActiveTab(initialTab === 'cards' ? 'howtoplay' : initialTab);
    setSelectedStage(initialStage);
  }, [initialTab, initialStage]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && onClose) {
        onClose();
      } else if (e.key === 'Enter') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleStart();
        }
      } else if (e.key === ' ') {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleStart();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onStart]);

  function handleToggleDontShow(checked) {
    setDontShowAgain(checked);
    if (checked) {
      localStorage.setItem('deadlights.skipInstructions', 'true');
    } else {
      localStorage.removeItem('deadlights.skipInstructions');
    }
  }

  function handleStart() {
    playButtonClickSfx();
    if (onStart) onStart();
  }

  const stage = STAGE_BRIEFINGS[selectedStage] || STAGE_BRIEFINGS[1];

  return (
    <div
      className="instructions-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(5, 4, 10, 0.90)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div
        className="cabinet-card instructions-modal-dialog"
        style={{
          maxWidth: '940px',
          width: '94%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1000000,
          background: '#140f22',
          border: '2px solid #d4a349',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.95), 0 0 36px rgba(212, 163, 73, 0.28)',
          borderRadius: '16px',
          padding: '26px 30px 22px 30px',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cabinet-modal-header" style={{ position: 'relative', marginBottom: '18px', paddingLeft: '24px', paddingRight: '24px' }}>
          <span className="cabinet-modal-sub" style={{ color: '#d4a349', letterSpacing: '0.14em', fontWeight: 800, fontSize: '0.82rem', marginBottom: '4px' }}>
            {isStageTransition ? 'CARNIVAL GAUNTLET SURVIVAL MANUAL · STAGE TRANSITION' : 'CARNIVAL GAUNTLET SURVIVAL MANUAL'}
          </span>
          <h2 className="cabinet-modal-title" style={{ fontSize: '1.85rem', letterSpacing: '0.04em', lineHeight: 1.15, margin: '0 0 6px 0' }}>
            {isStageTransition ? `STAGE ${selectedStage} INTEL BRIEFING` : 'OPERATIONAL BRIEFING & STAGE INTEL'}
          </h2>
          <p className="cabinet-modal-sub" style={{ color: '#cbd5e1', fontSize: '0.84rem', letterSpacing: '0.06em', margin: 0 }}>
            {isStageTransition
              ? `REVIEW WHAT TO EXPECT IN STAGE ${selectedStage} · PRESS ENTER TO COMMENCE`
              : 'MASTER EVASIVE CONTROLS · HARVEST POWER-UPS · ZERO MISSES ALLOWED'}
          </p>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#fff',
                borderRadius: '8px',
                width: '34px',
                height: '34px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                transition: 'all 0.2s ease',
              }}
              title="Close manual"
            >
              ✕
            </button>
          )}
        </div>

        {/* 2-Tab Switcher: Controls & Power-Ups / Stage Intel (Stages 1-6) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '18px',
            paddingBottom: '14px',
            borderBottom: '1px solid rgba(212, 163, 73, 0.25)',
          }}
        >
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'howtoplay' ? 'is-active-tab' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveTab('howtoplay');
            }}
            style={{
              padding: '11px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              background: activeTab === 'howtoplay' ? 'rgba(212, 163, 73, 0.25)' : '#090610',
              border: activeTab === 'howtoplay' ? '2px solid #d4a349' : '1px solid rgba(255, 255, 255, 0.1)',
              color: activeTab === 'howtoplay' ? '#facc15' : '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            CONTROLS & POWER-UPS
          </button>
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'stages' ? 'is-active-tab' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveTab('stages');
            }}
            style={{
              padding: '11px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              background: activeTab === 'stages' ? 'rgba(212, 163, 73, 0.25)' : '#090610',
              border: activeTab === 'stages' ? '2px solid #d4a349' : '1px solid rgba(255, 255, 255, 0.1)',
              color: activeTab === 'stages' ? '#facc15' : '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            STAGE INTEL (STAGES 1–6)
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ overflowY: 'auto', padding: '4px 6px 16px 2px', flex: 1 }}>
          {/* TAB 1: CONTROLS & POWER-UPS */}
          {activeTab === 'howtoplay' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 3 Core Controls Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {/* Control 1: Lane Shift */}
                <div style={{ background: '#090610', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span className="keycap">A</span>
                      <span className="keycap">D</span>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 3px' }}>or</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span className="keycap">←</span>
                      <span className="keycap">→</span>
                    </div>
                  </div>
                  <strong style={{ display: 'block', color: '#38bdf8', fontSize: '0.94rem', letterSpacing: '0.03em', margin: 0 }}>
                    SHIFT TRACK LANES
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    Glide between Left, Center, and Right lanes to dodge crates, projectiles, and incoming traps.
                  </p>
                </div>

                {/* Control 2: Jump */}
                <div style={{ background: '#090610', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="keycap" style={{ minWidth: '64px', textAlign: 'center' }}>SPACE</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 3px' }}>or</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span className="keycap">W</span>
                      <span className="keycap">↑</span>
                    </div>
                  </div>
                  <strong style={{ display: 'block', color: '#fbbf24', fontSize: '0.94rem', letterSpacing: '0.03em', margin: 0 }}>
                    HIGH LEAP OVER HAZARDS
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    Vault over low-skimmer <strong>Shadow Waves</strong> and ground debris. Clear Y ≥ 0.42 height.
                  </p>
                </div>

                {/* Control 3: Pause */}
                <div style={{ background: '#090610', border: '1px solid rgba(148, 163, 184, 0.35)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="keycap">ESC</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 3px' }}>or</span>
                    <span className="keycap">P</span>
                  </div>
                  <strong style={{ display: 'block', color: '#e2e8f0', fontSize: '0.94rem', letterSpacing: '0.03em', margin: 0 }}>
                    TACTICAL PAUSE
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    Pause gameplay at any moment to catch your breath or review stage hazard directives.
                  </p>
                </div>
              </div>

              {/* NEW DEDICATED IN-GAME POWER-UPS SECTION */}
              <div style={{ background: '#090610', border: '1.5px solid #d4a349', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: 'rgba(212, 163, 73, 0.2)', color: '#d4a349', border: '1px solid #d4a349', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 900, letterSpacing: '0.08em' }}>
                      SURVIVAL RELICS
                    </span>
                    <strong style={{ color: '#facc15', fontSize: '1.05rem', letterSpacing: '0.04em' }}>
                      IN-GAME SURVIVAL POWER-UPS
                    </strong>
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>SPAWN DYNAMICALLY WHEN IN DANGER</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  {/* Power-up 1: Aegis Shield */}
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                      <strong style={{ color: '#38bdf8', fontSize: '0.96rem' }}>AEGIS FORCEFIELD SHIELD</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                      Floating cyan-and-gold octahedron with dual counter-rotating rings. Appears when vulnerable or under heavy attack to grant <strong>10.0 seconds</strong> of forcefield aura. Completely absorbs any hazard impact (<strong>0 Hearts lost!</strong>), shatters, and provides <strong>750ms</strong> of invulnerability.
                    </p>
                  </div>

                  {/* Power-up 2: Soul Heart */}
                  <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.25rem' }}>❤️</span>
                      <strong style={{ color: '#ef4444', fontSize: '0.96rem' }}>SOUL HEART VESSEL</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                      Floating crimson-and-gold 3D heart with orbiting emerald heal sparkles. Materializes exclusively when you have taken damage to immediately restore <strong>+1 Poké-Heart</strong> (up to 5 max).
                    </p>
                  </div>
                </div>
              </div>

              {/* Vitality & Pennywise threat */}
              <div style={{ background: '#090610', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '10px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: 'rgba(239, 68, 68, 0.22)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.45)', padding: '2px 7px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '0.06em' }}>
                    VITALITY RULES
                  </span>
                  <strong style={{ color: '#ef4444', fontSize: '0.98rem', letterSpacing: '0.03em' }}>
                    THE PURSUER (PENNYWISE) & HEART LOSS
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#f1f5f9', lineHeight: '1.55' }}>
                  You start with <strong>5 Poké-Hearts</strong>. Colliding with any hazard strips 1 Heart (unless shielded). Hearts do <strong>not</strong> automatically restore between stages—collecting <strong>Soul Hearts</strong> and <strong>Aegis Shields</strong> is mandatory for survival! At 0 HP, Pennywise claims your soul with a jumpscare.
                </p>
              </div>

              {/* Zero Miss Enforcement */}
              <div style={{ background: '#090610', border: '1px solid rgba(212, 163, 73, 0.32)', borderRadius: '10px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong style={{ color: '#f59e0b', fontSize: '0.96rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                  <span style={{ background: 'rgba(245, 158, 11, 0.22)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.45)', padding: '2px 7px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '0.06em' }}>
                    CRITICAL
                  </span>
                  MANDATORY DIRECTIVE: NEVER MISS A CARD FRAGMENT!
                </strong>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  Each stage spawns exactly <strong>5 Golden Card Fragments</strong>. You <em>must</em> steer into every fragment’s lane to capture it. Letting a card fragment slip past you immediately ends the run!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: STAGE INTEL (STAGES 1-6) */}
          {activeTab === 'stages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Stage selector buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6].map((stg) => {
                  const b = STAGE_BRIEFINGS[stg];
                  const isCur = selectedStage === stg;
                  return (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => {
                        playButtonClickSfx();
                        setSelectedStage(stg);
                      }}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '8px',
                        background: isCur ? 'rgba(212, 163, 73, 0.25)' : '#090610',
                        border: isCur ? `2px solid ${b.accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isCur ? '#fff' : '#94a3b8',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '3px',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: b.accentColor, letterSpacing: '0.04em' }}>
                        STAGE {stg}
                      </span>
                      <strong style={{ fontSize: '0.76rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
                        {b.name.split(' ')[1] || b.name}
                      </strong>
                    </button>
                  );
                })}
              </div>

              {/* Stage Detail Card in Obsidian/Gold */}
              <div
                style={{
                  background: '#090610',
                  border: `1.5px solid ${stage.accentColor}`,
                  borderRadius: '12px',
                  padding: '20px 22px',
                  boxShadow: `0 0 20px ${stage.accentColor}22`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: stage.accentColor, letterSpacing: '0.12em' }}>
                      STAGE {stage.stage} OF 6 · WHAT TO EXPECT
                    </span>
                    <h3 style={{ margin: '4px 0 2px 0', fontSize: '1.35rem', color: '#f8fafc', letterSpacing: '0.03em' }}>
                      {stage.name.toUpperCase()}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{stage.subtitle}</span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', fontWeight: 700 }}>VELOCITY</span>
                    <strong style={{ color: stage.accentColor, fontSize: '0.96rem' }}>{stage.speed}</strong>
                  </div>
                </div>

                {/* Hazards in this stage */}
                <div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                    HAZARDS DEPLOYED IN THIS STAGE:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stage.hazards.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ color: '#f8fafc', fontSize: '0.88rem' }}>{h.name}</strong>
                            <span style={{ fontSize: '0.66rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.08)', padding: '1px 5px', borderRadius: '3px' }}>{h.type}</span>
                          </div>
                          <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: '#cbd5e1' }}>{h.tip}</p>
                        </div>
                        <span
                          style={{
                            color: '#ef4444',
                            fontWeight: 900,
                            fontSize: '0.72rem',
                            letterSpacing: '0.06em',
                            background: 'rgba(239, 68, 68, 0.16)',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Directive & Pro-tip */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', fontSize: '0.82rem' }}>
                  <div style={{ color: '#e2e8f0' }}>
                    <strong style={{ color: '#fbbf24' }}>DIRECTIVE: </strong>
                    <span>{stage.objective}</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.78rem' }}>
                    <strong>Pro-Tip: </strong>{stage.proTip}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: '16px 0 0 0',
            marginTop: '8px',
            borderTop: '1px solid rgba(212, 163, 73, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {!isStageTransition ? (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.84rem', color: '#94a3b8' }}>
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => handleToggleDontShow(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#d4a349', cursor: 'pointer' }}
              />
              <span>Skip this briefing automatically on next runs</span>
            </label>
          ) : (
            <div style={{ color: '#d4a349', fontSize: '0.85rem', fontWeight: 700 }}>
              PRESS [ENTER] OR CLICK COMMENCE TO DEPLOY
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {onClose && !isStageTransition && (
              <button
                type="button"
                className="text-button cabinet-btn-secondary"
                onClick={onClose}
                style={{ padding: '10px 20px', fontSize: '0.88rem', borderRadius: '8px' }}
              >
                CLOSE
              </button>
            )}
            <button
              type="button"
              className="primary-button cabinet-btn-primary"
              onClick={handleStart}
              style={{ padding: '11px 26px', fontSize: '0.94rem', fontWeight: 800, borderRadius: '8px' }}
              autoFocus
            >
              {startButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
