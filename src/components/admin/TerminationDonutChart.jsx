import React, { useState } from 'react';
import { GAME_CONFIG } from '../../../shared/gameConfig.js';

/**
 * TerminationDonutChart: Visual breakdown of why runs ended.
 * Categorizes runs into:
 *  - ALL STAGES PURIFIED (Full Victory) -> Emerald #10b981
 *  - 0 HP VITALITY DEPLETED -> Crimson #ef4444
 *  - STAGE CARD MISSED (Zero-Miss Rule) -> Amber #f59e0b
 */
export default function TerminationDonutChart({ endReasons = [], totalRuns = 0 }) {
  const [hoveredReason, setHoveredReason] = useState(null);

  // Normalize end reasons
  const categories = [
    {
      key: 'all_stages_cleared',
      label: `ALL ${GAME_CONFIG.stageCount} STAGES PURIFIED`,
      sublabel: 'Full Gauntlet Victory',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
    {
      key: 'hit_points_zero',
      label: 'VITALITY DEPLETED (0 HP)',
      sublabel: 'Collision Damage Fatalities',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.4)',
    },
    {
      key: 'card_missed',
      label: 'STAGE CARD MISSED',
      sublabel: 'Zero-Miss Codex Rule',
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.4)',
    },
  ];

  // Map incoming reasons
  const total = Math.max(1, totalRuns || endReasons.reduce((acc, r) => acc + (r.count || 0), 0) || 1);

  const mapped = categories.map((cat) => {
    const found = endReasons.find((r) => r.reason === cat.key);
    const count = found?.count || 0;
    const pct = found?.pct != null ? found.pct : Number(((count / total) * 100).toFixed(1));
    return {
      ...cat,
      count,
      pct,
    };
  });

  // Calculate SVG arc parameters (Radius = 70, Circumference ≈ 439.82)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  const victoryPct = mapped.find((m) => m.key === 'all_stages_cleared')?.pct || 0;

  return (
    <div className="donut-chart-wrapper" role="region" aria-label="Run Termination Breakdown Chart">
      <div className="donut-chart-header">
        <h4 className="chart-title">RUN TERMINATION DISTRIBUTION</h4>
        <p className="chart-subtitle">
          Root cause analysis for run terminations across all recorded sessions
        </p>
      </div>

      <div className="donut-body-grid">
        {/* SVG Donut Visualizer */}
        <div className="donut-svg-container">
          <svg className="donut-svg" width="200" height="200" viewBox="0 0 200 200">
            <defs>
              <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Track Circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke="rgba(246, 239, 226, 0.05)"
              strokeWidth="20"
            />

            {/* Glowing Segment Rings */}
            {mapped.map((seg) => {
              const strokeLength = (Math.max(0, seg.pct) / 100) * circumference;
              const strokeOffset = -((accumulatedAngle / 100) * circumference);
              accumulatedAngle += seg.pct;

              const isHovered = hoveredReason === seg.key;

              return (
                <circle
                  key={seg.key}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? 24 : 18}
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  filter={isHovered ? 'url(#donutGlow)' : undefined}
                  style={{
                    transition: 'stroke-width 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredReason(seg.key)}
                  onMouseLeave={() => setHoveredReason(null)}
                />
              );
            })}

            {/* Center Dial Hole */}
            <circle cx="100" cy="100" r={radius - 16} fill="#0d111e" stroke="rgba(212, 163, 73, 0.2)" strokeWidth="1.5" />
          </svg>

          {/* Centered Readout Metric */}
          <div className="donut-center-readout">
            <span className="donut-center-pct" style={{ color: '#10b981' }}>
              {victoryPct}%
            </span>
            <span className="donut-center-label">VICTORY RATE</span>
          </div>
        </div>

        {/* Legend Cards Stack */}
        <div className="donut-legend-stack">
          {mapped.map((seg) => {
            const isHovered = hoveredReason === seg.key;
            return (
              <div
                key={seg.key}
                className={`legend-item-card ${isHovered ? 'is-legend-active' : ''}`}
                onMouseEnter={() => setHoveredReason(seg.key)}
                onMouseLeave={() => setHoveredReason(null)}
                style={{
                  borderLeftColor: seg.color,
                  boxShadow: isHovered ? `0 0 16px ${seg.glow}` : 'none',
                }}
              >
                <div className="legend-row-top">
                  <span className="legend-swatch" style={{ background: seg.color }} />
                  <span className="legend-name" style={{ color: seg.color }}>{seg.label}</span>
                  <span className="legend-pct" style={{ color: seg.color }}>{seg.pct}%</span>
                </div>
                <div className="legend-row-bottom">
                  <span className="legend-sub">{seg.sublabel}</span>
                  <span className="legend-count">{seg.count.toLocaleString()} runs</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
