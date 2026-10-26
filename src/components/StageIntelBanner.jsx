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

    // Smooth exit slide-up / fade out 350ms before full unmount
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, Math.max(100, autoDismissMs - 350));

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
    <div
      className="stage-intel-banner-wrap"
      role="alert"
      aria-live="assertive"
      style={{
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        maxWidth: '680px',
        width: '92%',
        pointerEvents: isExiting ? 'none' : 'auto',
        animation: isExiting
          ? 'stageBannerSlideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          : 'stageBannerPopIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }}
    >
      <div
        style={{
          background: 'rgba(10, 8, 20, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `2px solid ${stage.accentColor}`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.7), 0 0 20px ${stage.accentColor}33`,
          borderRadius: '12px',
          padding: '12px 18px',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                background: stage.accentColor,
                color: '#07060b',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              STAGE {stage.stage} OF 6
            </span>
            <strong style={{ fontSize: '1.1rem', letterSpacing: '0.04em', color: '#fff' }}>
              {stage.name.toUpperCase()}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: stage.accentColor, fontWeight: 700 }}>
              SPEED: {stage.speed}
            </span>
            <button
              type="button"
              onClick={() => {
                setVisible(false);
                if (onDismiss) onDismiss();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#94a3b8',
                borderRadius: '4px',
                width: '22px',
                height: '22px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Dismiss intel banner"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Hazard Expectations Strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.06em' }}>
            WHAT TO EXPECT:
          </span>
          {stage.hazards.map((h, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.75rem',
              }}
            >
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#94a3b8', background: 'rgba(255, 255, 255, 0.08)', padding: '1px 5px', borderRadius: '3px' }}>{h.type}</span>
              <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{h.name}</span>
              <span
                style={{
                  color: '#ef4444',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  background: 'rgba(239, 68, 68, 0.18)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                }}
              >
                {h.action}
              </span>
            </div>
          ))}
        </div>

        {/* Goal & Pro-tip Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#cbd5e1', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '6px' }}>
          <div>
            <strong style={{ color: '#fbbf24' }}>DIRECTIVE: </strong>
            <span>{stage.objective}</span>
          </div>
          <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.73rem' }}>
            Tip: {stage.proTip}
          </div>
        </div>
      </div>
    </div>
  );
}
