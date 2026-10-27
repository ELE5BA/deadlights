import React from 'react';
import { GAME_STAGES } from '../../shared/gameConfig.js';

/**
 * Bespoke Vector SVG Glyphs for Grimdex Cabinet Console
 */
function ConsoleGearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        fill="#06b6d4"
        stroke="#d4a349"
        strokeWidth="1.5"
      />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="#d4a349"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldAegisIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L20 5.5V11C20 16.5 16.5 21 12 22C7.5 21 4 16.5 4 11V5.5L12 2Z"
        fill="#06b6d4"
        stroke="#38bdf8"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 6V18M8 11H16" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartVesselIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#ef4444"
        stroke="#f87171"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FacetedShardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L5 9l7 13 7-13-7-7z" fill="#06b6d4" stroke="#38bdf8" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 2v20M5 9h14M12 9l-4 7m4-7l4 7" stroke="#ffffff" strokeWidth="1.0" />
    </svg>
  );
}

function StarEmblemIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l2.8 6.5L22 10l-5 4.8 1.4 7-6.4-3.8L5.6 21.8 7 14.8 2 10l7.2-1.5L12 2z"
        fill="#facc15"
        stroke="#ca8a04"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrownVictoryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 19h20v2H2v-2zm1-8l4.5 3.5L12 6l4.5 8.5L21 11v6H3v-6z"
        fill="#10b981"
        stroke="#34d399"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SkullHorrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2a8 8 0 00-8 8c0 3.2 1.8 6 4.5 7.3V20a1 1 0 001 1h5a1 1 0 001-1v-2.7c2.7-1.3 4.5-4.1 4.5-7.3a8 8 0 00-8-8z"
        fill="#ef4444"
        stroke="#f87171"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="10" r="1.5" fill="#090610" />
      <circle cx="15" cy="10" r="1.5" fill="#090610" />
      <path d="M10 16h4M10 18h4" stroke="#090610" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Secret In-Game Dev Tools & Admin Command Console
 * Handcrafted Cabinet Aesthetic matching Picture 3's Obsidian & Gold Master Theme.
 */
export default function DevToolsOverlay({ engine, gameState, onClose }) {
  if (!engine) return null;

  const [isMinimized, setIsMinimized] = React.useState(false);

  const isGodMode = Boolean(gameState?.devGodMode);
  const isAutoPilot = Boolean(gameState?.devAutoPilot);
  const currentTimeScale = gameState?.devTimeScale || 1.0;
  const currentStage = gameState?.stageNumber || 1;

  return (
    <aside
      className="devtools-dock-container"
      role="region"
      aria-label="Grimdex Cabinet Master Console"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        width: isMinimized ? '240px' : '325px',
        maxWidth: 'calc(100vw - 2.5rem)',
        maxHeight: isMinimized ? 'auto' : 'min(520px, calc(100vh - 2.5rem))',
        overflowY: isMinimized ? 'hidden' : 'auto',
        background: 'radial-gradient(circle at 50% 0%, #171129 0%, #090610 90%)',
        border: '1.5px solid #d4a349',
        borderRadius: '12px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95), 0 0 24px rgba(212, 163, 73, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(14px)',
        zIndex: 9500,
        padding: isMinimized ? '0.65rem 0.85rem' : '0.95rem 1.05rem',
        fontFamily: 'var(--font-display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        color: '#f8fafc',
      }}
    >
      {/* 1. Header with Spacious Spacing & Non-overlapping Badge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          marginBottom: isMinimized ? 0 : '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 900,
              letterSpacing: '0.09em',
              background: '#d4a349',
              color: '#090610',
              padding: '2px 8px',
              borderRadius: '999px',
              textTransform: 'uppercase',
            }}
          >
            ADMIN / DEV CONSOLE
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setIsMinimized((prev) => !prev)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(212, 163, 73, 0.35)',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: '0.2rem 0.45rem',
                lineHeight: 1,
                transition: 'all 0.15s ease',
              }}
              title={isMinimized ? 'Expand Console' : 'Minimize Console'}
            >
              {isMinimized ? '▲' : '▼'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(212, 163, 73, 0.35)',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.85rem',
                cursor: 'pointer',
                padding: '0.2rem 0.5rem',
                lineHeight: 1,
                transition: 'all 0.15s ease',
              }}
              title="Close Console (Ctrl+Shift+D or Alt+`)"
            >
              ✕
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '2px' }}>
            <ConsoleGearIcon />
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.03em',
                }}
              >
                CARNIVAL DEBUG HARNESS
              </h3>
              <span
                style={{
                  fontSize: '0.62rem',
                  color: '#94a3b8',
                  letterSpacing: '0.03em',
                  display: 'block',
                  marginTop: '1px',
                }}
              >
                REAL-TIME OVERRIDES & TELEMETRY
              </span>
            </div>
          </div>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Sleek Gradient Divider (1:1 with Picture 3) */}
          <div
            style={{
              height: '2.5px',
              background: 'linear-gradient(90deg, #ca8a04 0%, #06b6d4 60%, #38bdf8 100%)',
              borderRadius: '2px',
              marginBottom: '0.85rem',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* 2. Core Overpowered Toggles (Arcade Illuminated Push Switches) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => engine.setDevGodMode(!isGodMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.55rem 0.5rem',
              borderRadius: '8px',
              border: `1.5px solid ${isGodMode ? '#10b981' : 'rgba(212, 163, 73, 0.35)'}`,
              background: isGodMode
                ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 46, 22, 0.5) 100%)'
                : '#090610',
              color: isGodMode ? '#34d399' : '#94a3b8',
              boxShadow: isGodMode ? '0 0 12px rgba(16, 185, 129, 0.45)' : 'none',
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isGodMode ? '#10b981' : '#64748b',
                boxShadow: isGodMode ? '0 0 6px #10b981' : 'none',
              }}
            />
            {isGodMode ? 'GOD MODE: ON' : 'GOD MODE: OFF'}
          </button>

          <button
            type="button"
            onClick={() => engine.setDevAutoPilot(!isAutoPilot)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.55rem 0.5rem',
              borderRadius: '8px',
              border: `1.5px solid ${isAutoPilot ? '#38bdf8' : 'rgba(212, 163, 73, 0.35)'}`,
              background: isAutoPilot
                ? 'linear-gradient(180deg, rgba(56, 189, 248, 0.3) 0%, rgba(8, 51, 68, 0.5) 100%)'
                : '#090610',
              color: isAutoPilot ? '#38bdf8' : '#94a3b8',
              boxShadow: isAutoPilot ? '0 0 12px rgba(56, 189, 248, 0.45)' : 'none',
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isAutoPilot ? '#38bdf8' : '#64748b',
                boxShadow: isAutoPilot ? '0 0 6px #38bdf8' : 'none',
              }}
            />
            {isAutoPilot ? 'AUTOPILOT: ON' : 'AUTOPILOT: OFF'}
          </button>
        </div>

        {/* 3. Warp To Stage Grid */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(212, 163, 73, 0.25)',
            borderRadius: '8px',
            padding: '0.5rem 0.65rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.35rem',
            }}
          >
            <span style={{ fontSize: '0.62rem', color: '#d4a349', fontWeight: 900, letterSpacing: '0.08em' }}>
              WARP TO STAGE
            </span>
            <span style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 800 }}>
              ACTIVE: STAGE {currentStage}/{GAME_STAGES.length}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GAME_STAGES.length}, 1fr)`, gap: '0.3rem' }}>
            {GAME_STAGES.map(({ stage: num }) => {
              const isActive = currentStage === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => engine.devWarpToStage(num)}
                  style={{
                    padding: '0.4rem 0.1rem',
                    borderRadius: '6px',
                    border: `1.5px solid ${isActive ? '#facc15' : 'rgba(212, 163, 73, 0.3)'}`,
                    background: isActive ? '#d4a349' : '#090610',
                    color: isActive ? '#090610' : '#cbd5e1',
                    fontWeight: 900,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 0 10px rgba(250, 204, 21, 0.5)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  S{num}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Stage Progression Shortcuts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
          <button
            type="button"
            onClick={() => engine.devGrantCardFragment()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: '0.48rem',
              borderRadius: '6px',
              border: '1.5px solid rgba(212, 163, 73, 0.5)',
              background: '#090610',
              color: '#facc15',
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <StarEmblemIcon />
            <span>+1 FRAGMENT</span>
          </button>
          <button
            type="button"
            onClick={() => engine.devCompleteCurrentStage()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: '0.48rem',
              borderRadius: '6px',
              border: '1.5px solid rgba(16, 185, 129, 0.6)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>INSTANT CLEAR (5/5)</span>
          </button>
        </div>

        {/* 5. Tactical State Modifiers (Picture 3 Inset Style) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={() => engine.devToggleShield()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              padding: '0.45rem 0.2rem',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              background: '#090610',
              color: '#38bdf8',
              fontWeight: 800,
              fontSize: '0.66rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Toggle Aegis Forcefield"
          >
            <ShieldAegisIcon />
            <span>SHIELD</span>
          </button>
          <button
            type="button"
            onClick={() => engine.devFullHeal()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              padding: '0.45rem 0.2rem',
              borderRadius: '6px',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              background: '#090610',
              color: '#f87171',
              fontWeight: 800,
              fontSize: '0.66rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Fully Restore Soul Vitality"
          >
            <HeartVesselIcon />
            <span>HEAL 5/5</span>
          </button>
          <button
            type="button"
            onClick={() => engine.devAddShards(50)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              padding: '0.45rem 0.2rem',
              borderRadius: '6px',
              border: '1px solid rgba(212, 163, 73, 0.5)',
              background: '#090610',
              color: '#d4a349',
              fontWeight: 800,
              fontSize: '0.66rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Add +50 Rift Shards"
          >
            <FacetedShardIcon />
            <span>+50 SHARDS</span>
          </button>
        </div>

        {/* 6. Speed Multiplier Segmented Capsule */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(212, 163, 73, 0.25)',
            borderRadius: '8px',
            padding: '0.45rem 0.65rem',
          }}
        >
          <div
            style={{
              fontSize: '0.62rem',
              color: '#94a3b8',
              marginBottom: '0.3rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
            }}
          >
            SPEED MULTIPLIER ({currentTimeScale}x)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem' }}>
            {[0.5, 1.0, 2.0].map((scale) => {
              const isSelected = currentTimeScale === scale;
              return (
                <button
                  key={scale}
                  type="button"
                  onClick={() => engine.setDevTimeScale(scale)}
                  style={{
                    padding: '0.35rem',
                    borderRadius: '5px',
                    border: `1px solid ${isSelected ? '#facc15' : 'rgba(255, 255, 255, 0.12)'}`,
                    background: isSelected ? 'rgba(212, 163, 73, 0.3)' : '#090610',
                    color: isSelected ? '#facc15' : '#94a3b8',
                    fontWeight: 900,
                    fontSize: '0.68rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {scale}x
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Cinematic Cutscene Testers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
          <button
            type="button"
            onClick={() => engine.devTriggerVictory()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.48rem 0.3rem',
              borderRadius: '6px',
              border: '1.5px solid rgba(16, 185, 129, 0.6)',
              background: 'rgba(16, 185, 129, 0.18)',
              color: '#34d399',
              fontWeight: 800,
              fontSize: '0.68rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <CrownVictoryIcon />
            <span>TEST VICTORY</span>
          </button>
          <button
            type="button"
            onClick={() => engine.devTriggerJumpscareLoss()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.48rem 0.3rem',
              borderRadius: '6px',
              border: '1.5px solid rgba(239, 68, 68, 0.6)',
              background: 'rgba(239, 68, 68, 0.18)',
              color: '#f87171',
              fontWeight: 800,
              fontSize: '0.68rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <SkullHorrorIcon />
            <span>TEST JUMPSCARE</span>
          </button>
        </div>

        {/* 8. Hotkey Hint Footer */}
        <div
          style={{
            fontSize: '0.58rem',
            color: '#64748b',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.4rem',
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '0.04em',
          }}
        >
          KEYBINDS: Ctrl+Shift+D · Alt+` · type "dev"
        </div>
      </div>
    </>
  )}
</aside>
  );
}
