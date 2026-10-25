import React, { useState } from 'react';

/**
 * StageFunnelChart: Visual Stage-by-Stage Survival Funnel
 * Portrays player retention from Stage 1 (The Twilight Mist) to Stage 6 (The Grimlight Core).
 * Fits the Dark Carnival & Obsidian theme with crisp SVG visual flows.
 */
export default function StageFunnelChart({ funnelData = [], bottleneckStage = '' }) {
  const [activeStage, setActiveStage] = useState(null);

  if (!funnelData || funnelData.length === 0) {
    return (
      <div className="admin-chart-empty">
        <p>No stage funnel telemetry available for this range.</p>
      </div>
    );
  }

  const maxRuns = Math.max(1, funnelData[0]?.reached || 1);

  return (
    <div className="funnel-chart-wrapper" role="region" aria-label="Stage Survival Funnel Chart">
      <div className="funnel-chart-header">
        <div>
          <h4 className="chart-title">GAUNTLET PROGRESSION & STAGE SURVIVAL FUNNEL</h4>
          <p className="chart-subtitle">
            Percentage and volume of runners reaching each stage before succumbing to the Grimlight
          </p>
        </div>
        {bottleneckStage && (
          <div className="bottleneck-pill">
            <span className="bottleneck-icon">⚠</span>
            <span>BOTTLENECK: <strong>{bottleneckStage}</strong></span>
          </div>
        )}
      </div>

      <div className="funnel-steps-container">
        {funnelData.map((item, index) => {
          const isBottleneck =
            typeof bottleneckStage === 'string' &&
            bottleneckStage.toLowerCase().includes(`stage ${item.stage}`);
          const prevItem = index > 0 ? funnelData[index - 1] : null;
          const dropPct = prevItem ? (prevItem.pct - item.pct).toFixed(1) : null;
          const isHovered = activeStage === item.stage;

          // Theme gradient tailored across stages 1 to 6
          const stageColors = [
            { bar: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)', text: '#34d399' },
            { bar: 'linear-gradient(90deg, #34d399 0%, #38bdf8 100%)', text: '#38bdf8' },
            { bar: 'linear-gradient(90deg, #38bdf8 0%, #f59e0b 100%)', text: '#f59e0b' },
            { bar: 'linear-gradient(90deg, #f59e0b 0%, #ec4899 100%)', text: '#ec4899' },
            { bar: 'linear-gradient(90deg, #ec4899 0%, #c084fc 100%)', text: '#c084fc' },
            { bar: 'linear-gradient(90deg, #c084fc 0%, #fbbf24 100%)', text: '#fbbf24' },
          ];
          const color = stageColors[index % stageColors.length];

          return (
            <div
              key={item.stage}
              className={`funnel-step-card ${isBottleneck ? 'is-bottleneck-card' : ''} ${isHovered ? 'is-hovered' : ''}`}
              onMouseEnter={() => setActiveStage(item.stage)}
              onMouseLeave={() => setActiveStage(null)}
            >
              <div className="funnel-step-left">
                <span className="stage-pill-num">STG 0{item.stage}</span>
                <div className="stage-name-block">
                  <span className="stage-main-name">{item.name}</span>
                  {dropPct && Number(dropPct) > 0 && (
                    <span className="stage-attrition-tag">
                      ↓ -{dropPct}% attrition
                    </span>
                  )}
                </div>
              </div>

              <div className="funnel-step-visual">
                <div className="funnel-track">
                  <div
                    className="funnel-fill-bar"
                    style={{
                      width: `${Math.max(5, item.pct)}%`,
                      background: color.bar,
                      boxShadow: isBottleneck ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none',
                    }}
                  >
                    <span className="funnel-bar-pct-text">{item.pct}%</span>
                  </div>
                </div>
              </div>

              <div className="funnel-step-right">
                <span className="funnel-count-val">{item.reached?.toLocaleString()}</span>
                <span className="funnel-count-label">runners</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="funnel-footer-insights">
        <span className="insight-bullet">✦ Stage 1 begins with 100% entrant cohort.</span>
        <span className="insight-bullet">✦ Steepest attrition typically occurs at Stages 3–4 during high-velocity sinusoidal and double-blockade releases.</span>
      </div>
    </div>
  );
}
