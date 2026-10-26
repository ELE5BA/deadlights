import { useEffect, useRef, useState } from 'react';
import { STAGE_BRIEFINGS } from './InstructionsModal.jsx';

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
        bottom: '1.15rem',
        left: '1.25rem',
        width: 'min(310px, 42vw)',
        pointerEvents: 'none',
        zIndex: 18,
        background: '#140f22',
        border: '1.5px solid #d4a349',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.85), 0 0 16px rgba(212, 163, 73, 0.22)',
        borderRadius: '12px',
        padding: '10px 12px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateY(12px) scale(0.97)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Top Intel Row: Stage Number, Name & Speed */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 900,
              letterSpacing: '0.1em',
              background: '#d4a349',
              color: '#090610',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            STAGE {stage.stage}
          </span>
          <strong
            style={{
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
              color: '#f8fafc',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '145px',
            }}
          >
            {stage.name.toUpperCase()}
          </strong>
        </div>

        <span
          style={{
            fontSize: '0.66rem',
            color: '#38bdf8',
            fontWeight: 800,
            letterSpacing: '0.02em',
          }}
        >
          {stage.speed?.split(' ')[0] || 'FAST'}
        </span>
      </div>

      {/* Sunken Inner Well with Hazard Pills */}
      <div
        style={{
          background: '#090610',
          borderRadius: '8px',
          padding: '6px 8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {(stage.hazards || []).map((h, i) => (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                padding: '2px 5px',
                fontSize: '0.66rem',
              }}
            >
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{h.name}</span>
              <span
                style={{
                  color: h.action.includes('JUMP') ? '#38bdf8' : '#ef4444',
                  fontWeight: 900,
                  fontSize: '0.62rem',
                  letterSpacing: '0.03em',
                }}
              >
                {h.action.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
