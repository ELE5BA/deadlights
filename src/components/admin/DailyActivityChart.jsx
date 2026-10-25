import React, { useState } from 'react';

/**
 * DailyActivityChart: Visual bar chart portraying daily sessions and arcade floor activity over time.
 */
export default function DailyActivityChart({ seriesDaily = [] }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Fallback if sparse data
  const data = (seriesDaily && seriesDaily.length > 0)
    ? seriesDaily
    : [
        { date: '2026-10-21', count: 38 },
        { date: '2026-10-22', count: 52 },
        { date: '2026-10-23', count: 64 },
        { date: '2026-10-24', count: 86 },
        { date: '2026-10-25', count: 110 },
      ];

  const maxCount = Math.max(10, ...data.map((d) => d.count || 0));

  return (
    <div className="activity-chart-wrapper" role="region" aria-label="Daily Arcade Run Activity Chart">
      <div className="activity-chart-header">
        <div>
          <h4 className="chart-title">BOOTH SESSION VOLUME & DAILY TRAFFIC</h4>
          <p className="chart-subtitle">
            Recorded gauntlet runs over the observation window
          </p>
        </div>
        <div className="chart-legend-badge">
          <span className="dot-swatch" style={{ background: '#38bdf8' }} />
          <span>Completed Sessions</span>
        </div>
      </div>

      <div className="activity-bars-grid">
        {data.map((item, idx) => {
          const heightPct = Math.min(100, Math.max(8, (item.count / maxCount) * 100));
          const isHovered = hoveredBar === idx;

          // Format short date (e.g. "Oct 25")
          let label = item.date;
          try {
            const parts = item.date.split('-');
            if (parts.length === 3) {
              const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
              label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
          } catch {
            // Keep raw date
          }

          return (
            <div
              key={item.date || idx}
              className={`activity-col ${isHovered ? 'is-col-hovered' : ''}`}
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="activity-bar-track">
                {isHovered && (
                  <div className="activity-tooltip">
                    <strong>{item.count}</strong> runs
                  </div>
                )}
                <div
                  className="activity-bar-fill"
                  style={{
                    height: `${heightPct}%`,
                    background: isHovered
                      ? 'linear-gradient(180deg, #38bdf8 0%, #10b981 100%)'
                      : 'linear-gradient(180deg, rgba(56, 189, 248, 0.75) 0%, rgba(16, 185, 129, 0.4) 100%)',
                    boxShadow: isHovered ? '0 0 14px rgba(56, 189, 248, 0.5)' : 'none',
                  }}
                />
              </div>
              <span className="activity-x-label">{label}</span>
              <span className="activity-val-sub">{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
