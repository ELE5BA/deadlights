import React from 'react';

/**
 * Secret In-Game Dev Tools & Admin Command Console
 * Anchored bottom-right dock styled in #140f22 obsidian with #d4a349 gold trim.
 */
export default function DevToolsOverlay({ engine, gameState, onClose }) {
  if (!engine) return null;

  const isGodMode = Boolean(gameState?.devGodMode);
  const isAutoPilot = Boolean(gameState?.devAutoPilot);
  const currentTimeScale = gameState?.devTimeScale || 1.0;
  const currentStage = gameState?.stageNumber || 1;

  return (
    <div
      className="devtools-dock-container"
      role="region"
      aria-label="Developer Command Console"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        width: '320px',
        maxWidth: 'calc(100vw - 2.5rem)',
        maxHeight: 'calc(100vh - 2.5rem)',
        overflowY: 'auto',
        background: 'rgba(20, 15, 34, 0.94)',
        border: '1.5px solid #d4a349',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.85), 0 0 16px rgba(212, 163, 73, 0.35)',
        backdropFilter: 'blur(10px)',
        zIndex: 9500,
        padding: '0.85rem 1rem',
        fontFamily: "'Courier New', Courier, monospace",
        color: '#f8fafc',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(212, 163, 73, 0.3)',
          paddingBottom: '0.5rem',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>⚙️</span>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d4a349', letterSpacing: '0.1em' }}>
              GRIMDEX DEV CONSOLE
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
              SECRET ADMIN BYPASS
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1rem',
            cursor: 'pointer',
            padding: '0.2rem 0.4rem',
            lineHeight: 1,
          }}
          title="Close Console (Ctrl+Shift+D or Alt+`)"
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.72rem' }}>
        {/* Overpowered Toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => engine.setDevGodMode(!isGodMode)}
            style={{
              padding: '0.45rem 0.3rem',
              borderRadius: '5px',
              border: `1px solid ${isGodMode ? '#10b981' : 'rgba(212, 163, 73, 0.4)'}`,
              background: isGodMode ? 'rgba(16, 185, 129, 0.25)' : '#090610',
              color: isGodMode ? '#34d399' : '#e2e8f0',
              fontWeight: 700,
              fontSize: '0.68rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isGodMode ? '🟢 GOD MODE: ON' : '⚪ GOD MODE'}
          </button>

          <button
            type="button"
            onClick={() => engine.setDevAutoPilot(!isAutoPilot)}
            style={{
              padding: '0.45rem 0.3rem',
              borderRadius: '5px',
              border: `1px solid ${isAutoPilot ? '#38bdf8' : 'rgba(212, 163, 73, 0.4)'}`,
              background: isAutoPilot ? 'rgba(56, 189, 248, 0.25)' : '#090610',
              color: isAutoPilot ? '#38bdf8' : '#e2e8f0',
              fontWeight: 700,
              fontSize: '0.68rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isAutoPilot ? '🤖 AUTO-PILOT: ON' : '⚪ AUTO-PILOT AI'}
          </button>
        </div>

        {/* Warp To Stage */}
        <div>
          <div style={{ fontSize: '0.65rem', color: '#d4a349', marginBottom: '0.25rem', fontWeight: 700 }}>
            WARP TO STAGE (CURRENT: S{currentStage})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.25rem' }}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => engine.devWarpToStage(num)}
                style={{
                  padding: '0.35rem 0.1rem',
                  borderRadius: '4px',
                  border: `1px solid ${currentStage === num ? '#d4a349' : 'rgba(212, 163, 73, 0.3)'}`,
                  background: currentStage === num ? 'rgba(212, 163, 73, 0.3)' : '#090610',
                  color: currentStage === num ? '#facc15' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                }}
              >
                S{num}
              </button>
            ))}
          </div>
        </div>

        {/* Card & Stage Progression */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => engine.devGrantCardFragment()}
            style={{
              padding: '0.4rem',
              borderRadius: '5px',
              border: '1px solid rgba(212, 163, 73, 0.4)',
              background: '#090610',
              color: '#facc15',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            +1 FRAGMENT
          </button>
          <button
            type="button"
            onClick={() => engine.devCompleteCurrentStage()}
            style={{
              padding: '0.4rem',
              borderRadius: '5px',
              border: '1px solid rgba(212, 163, 73, 0.4)',
              background: '#090610',
              color: '#34d399',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            INSTANT CLEAR (5/5)
          </button>
        </div>

        {/* Instant State Modifiers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem' }}>
          <button
            type="button"
            onClick={() => engine.devToggleShield()}
            style={{
              padding: '0.35rem 0.2rem',
              borderRadius: '4px',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              background: '#090610',
              color: '#38bdf8',
              fontWeight: 700,
              fontSize: '0.65rem',
              cursor: 'pointer',
            }}
          >
            🛡️ SHIELD
          </button>
          <button
            type="button"
            onClick={() => engine.devFullHeal()}
            style={{
              padding: '0.35rem 0.2rem',
              borderRadius: '4px',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              background: '#090610',
              color: '#ef4444',
              fontWeight: 700,
              fontSize: '0.65rem',
              cursor: 'pointer',
            }}
          >
            ❤️ HEAL 5/5
          </button>
          <button
            type="button"
            onClick={() => engine.devAddShards(50)}
            style={{
              padding: '0.35rem 0.2rem',
              borderRadius: '4px',
              border: '1px solid rgba(212, 163, 73, 0.5)',
              background: '#090610',
              color: '#d4a349',
              fontWeight: 700,
              fontSize: '0.65rem',
              cursor: 'pointer',
            }}
          >
            +50 SHARDS
          </button>
        </div>

        {/* Time Scale Multipliers */}
        <div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
            SPEED MULTIPLIER ({currentTimeScale}x)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem' }}>
            {[0.5, 1.0, 2.0].map((scale) => (
              <button
                key={scale}
                type="button"
                onClick={() => engine.setDevTimeScale(scale)}
                style={{
                  padding: '0.3rem',
                  borderRadius: '4px',
                  border: `1px solid ${currentTimeScale === scale ? '#d4a349' : 'rgba(255, 255, 255, 0.15)'}`,
                  background: currentTimeScale === scale ? 'rgba(212, 163, 73, 0.25)' : '#090610',
                  color: currentTimeScale === scale ? '#facc15' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  cursor: 'pointer',
                }}
              >
                {scale}x
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Cutscene Testers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.2rem' }}>
          <button
            type="button"
            onClick={() => engine.devTriggerVictory()}
            style={{
              padding: '0.4rem 0.2rem',
              borderRadius: '5px',
              border: '1px solid rgba(16, 185, 129, 0.6)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontWeight: 800,
              fontSize: '0.65rem',
              cursor: 'pointer',
            }}
          >
            🏆 TEST VICTORY
          </button>
          <button
            type="button"
            onClick={() => engine.devTriggerJumpscareLoss()}
            style={{
              padding: '0.4rem 0.2rem',
              borderRadius: '5px',
              border: '1px solid rgba(239, 68, 68, 0.6)',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              fontWeight: 800,
              fontSize: '0.65rem',
              cursor: 'pointer',
            }}
          >
            💀 TEST JUMPSCARE
          </button>
        </div>

        {/* Keybind hint footer */}
        <div
          style={{
            fontSize: '0.58rem',
            color: '#64748b',
            textAlign: 'center',
            marginTop: '0.2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.35rem',
          }}
        >
          KEYBINDS: Ctrl+Shift+D · Alt+` · type "dev"
        </div>
      </div>
    </div>
  );
}
