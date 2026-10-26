import { useEffect, useRef, useState } from 'react';
import { STAGE_BRIEFINGS } from './InstructionsModal.jsx';

/**
 * Stage Tactical Intel Scanner
 * Handcrafted Cabinet Aesthetic matching Picture 3's Obsidian & Gold Master Theme.
 */
export default function StageIntelBanner({ stageNumber = 1, onDismiss, autoDismissMs = 4000 }) {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const stage = STAGE_BRIEFINGS[stageNumber] || STAGE_BRIEFINGS[1];

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    setVisible(true);
    setIsExiting(false);
    if (!autoDismissMs) return undefined;

    // Smooth exit fade out 450ms before unmount
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, Math.max(100, autoDismissMs - 450));

    const dismissTimer = setTimeout(() => {
      setVisible(false);
      if (onDismissRef.current) onDismissRef.current();
    }, autoDismissMs);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [stageNumber, autoDismissMs]);

  if (!visible) return null;

  return (
    <aside
      className={`tactical-stage-intel-card ${isExiting ? 'intel-card--exiting' : 'intel-card--entering'}`}
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        bottom: '1.25rem',
        left: '1.25rem',
        width: 'min(330px, 44vw)',
        pointerEvents: 'none',
        zIndex: 18,
        background: 'radial-gradient(circle at 50% 0%, #171129 0%, #090610 90%)',
        border: '1.5px solid #d4a349',
        borderRadius: '12px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.9), 0 0 18px rgba(212, 163, 73, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        padding: '0.75rem 0.95rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
        fontFamily: 'var(--font-display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateY(10px) scale(0.97)' : 'translateY(0) scale(1)',
      }}
    >
      {/* 1. Top Header Row (Matching Picture 3's STAGE Pill & Display Title) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              background: '#d4a349',
              color: '#090610',
              padding: '1.5px 7px',
              borderRadius: '999px',
              textTransform: 'uppercase',
            }}
          >
            STAGE {stage.stage}/6
          </span>
          <strong
            style={{
              fontSize: '0.84rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '150px',
            }}
          >
            {stage.name}
          </strong>
        </div>

        <span
          style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: 800,
            color: '#38bdf8',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {stage.speed?.split(' ')[0] || '15.0m/s'}
        </span>
      </div>

      {/* 2. Sleek Gradient Divider (1:1 with Picture 3's Progress Track) */}
      <div
        style={{
          height: '2.5px',
          background: 'linear-gradient(90deg, #ca8a04 0%, #06b6d4 50%, #38bdf8 100%)',
          borderRadius: '2px',
        }}
      />

      {/* 3. Sunken Hazard Threat Pods (Matching Picture 3's Sunken Telemetry Pod) */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.65)',
          borderRadius: '8px',
          padding: '0.45rem 0.6rem',
          border: '1px solid rgba(212, 163, 73, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        <div
          style={{
            fontSize: '0.58rem',
            color: '#d4a349',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1px',
          }}
        >
          TACTICAL HAZARDS & COUNTERS
        </div>

        {(stage.hazards || []).map((h, i) => {
          const isJump = h.action.toUpperCase().includes('JUMP');
          const isDodge = h.action.toUpperCase().includes('DODGE') || h.action.toUpperCase().includes('OPEN');
          const isChain = h.action.toUpperCase().includes('CHAIN');

          const pillBg = isJump
            ? 'rgba(56, 189, 248, 0.15)'
            : isChain
            ? 'rgba(239, 68, 68, 0.15)'
            : 'rgba(250, 204, 21, 0.15)';
          const pillBorder = isJump
            ? 'rgba(56, 189, 248, 0.45)'
            : isChain
            ? 'rgba(239, 68, 68, 0.45)'
            : 'rgba(250, 204, 21, 0.45)';
          const pillColor = isJump ? '#38bdf8' : isChain ? '#f87171' : '#facc15';

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.4rem',
                fontSize: '0.68rem',
              }}
            >
              <span style={{ color: '#e2e8f0', fontWeight: 700, letterSpacing: '0.01em' }}>
                {h.name}
              </span>
              <span
                style={{
                  fontSize: '0.60rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  background: pillBg,
                  border: `1px solid ${pillBorder}`,
                  color: pillColor,
                  padding: '1.5px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {h.action}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
