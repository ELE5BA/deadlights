import React, { useState } from 'react';

/**
 * Clean SVG Vector Hazard Icons
 */
function WaveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function SpiralIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A6 6 0 1 0 12 8a2 2 0 1 0 2 2" />
    </svg>
  );
}

function CrateIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 22 12 12 22 2 12" />
    </svg>
  );
}

function DualBladesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  );
}

const HAZARD_METADATA = {
  shadow_wave: {
    icon: WaveIcon,
    name: 'Low Skimmer',
    flavor: 'Ground-sweeping chakram requiring jump timing',
    color: '#38bdf8',
  },
  swaying_specter: {
    icon: SpiralIcon,
    name: 'Curveball Pitch',
    flavor: 'Sinusoidal projectile requiring apex lane reads',
    color: '#c084fc',
  },
  blocker_crate: {
    icon: CrateIcon,
    name: 'Heavy Lob',
    flavor: 'High-arc lob requiring lateral sidestepping',
    color: '#f59e0b',
  },
  double_blockade: {
    icon: DualBladesIcon,
    name: 'Twin Barrage',
    flavor: 'Simultaneous 2-lane projectile with narrow escape',
    color: '#ef4444',
  },
};

/**
 * HazardComparisonChart: Comparative analysis of obstacle spawns, collisions, and lethality.
 */
export default function HazardComparisonChart({ obstacleStats = [] }) {
  const [hoveredHazard, setHoveredHazard] = useState(null);

  if (!obstacleStats || obstacleStats.length === 0) {
    return (
      <div className="admin-chart-empty">
        <p>No hazard encounter events recorded in this date range.</p>
      </div>
    );
  }

  // Find max spawns for proportional bar width
  const maxSpawns = Math.max(1, ...obstacleStats.map((o) => o.spawns || 1));

  return (
    <div className="hazard-chart-wrapper" role="region" aria-label="Hazard Lethality & Collision Comparison">
      <div className="hazard-chart-header">
        <div>
          <h4 className="chart-title">HAZARD LETHALITY & HIT RATE MATRIX</h4>
          <p className="chart-subtitle">
            Observed encounters vs player collisions per projectile type, identifying balance pinch points
          </p>
        </div>
      </div>

      <div className="hazard-cards-grid">
        {obstacleStats.map((obs) => {
          const meta = HAZARD_METADATA[obs.entityKey] || {
            icon: CrateIcon,
            name: obs.displayName || obs.entityKey,
            flavor: 'Haunted carnival obstacle',
            color: '#d4a349',
          };
          const IconComp = meta.icon;
          const hitRate = Number(obs.collisionRate || 0);

          let threatBadge = { label: 'LOW THREAT', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
          if (hitRate >= 35) {
            threatBadge = { label: 'CRITICAL LETHALITY', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.14)' };
          } else if (hitRate >= 20) {
            threatBadge = { label: 'ELEVATED HAZARD', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.14)' };
          }

          const spawnBarWidth = Math.min(100, Math.max(15, (obs.spawns / maxSpawns) * 100));
          const isHovered = hoveredHazard === obs.entityKey;

          return (
            <div
              key={obs.entityKey}
              className={`hazard-stat-card ${isHovered ? 'is-hazard-hovered' : ''}`}
              onMouseEnter={() => setHoveredHazard(obs.entityKey)}
              onMouseLeave={() => setHoveredHazard(null)}
              style={{
                borderLeftColor: meta.color,
              }}
            >
              <div className="hazard-card-head">
                <div className="hazard-identity">
                  <div className="hazard-icon-bubble" style={{ borderColor: meta.color }}>
                    <IconComp />
                  </div>
                  <div>
                    <h5 className="hazard-name-title">{meta.name}</h5>
                    <span className="hazard-key-sub"><code>{obs.entityKey}</code></span>
                  </div>
                </div>
                <span
                  className="hazard-threat-pill"
                  style={{ color: threatBadge.color, backgroundColor: threatBadge.bg, borderColor: threatBadge.color }}
                >
                  {threatBadge.label}
                </span>
              </div>

              <p className="hazard-flavor-text">{meta.flavor}</p>

              {/* Comparative Dual-Bar Visual */}
              <div className="hazard-bars-section">
                {/* Spawns Bar */}
                <div className="stat-metric-row">
                  <span className="stat-metric-label">SPAWNS OBSERVED</span>
                  <span className="stat-metric-val">{obs.spawns?.toLocaleString()}</span>
                </div>
                <div className="meter-track">
                  <div
                    className="meter-fill"
                    style={{
                      width: `${spawnBarWidth}%`,
                      background: 'rgba(246, 239, 226, 0.2)',
                    }}
                  />
                </div>

                {/* Collisions Bar */}
                <div className="stat-metric-row">
                  <span className="stat-metric-label">RUNNER COLLISIONS</span>
                  <span className="stat-metric-val" style={{ color: threatBadge.color }}>
                    {obs.collisions?.toLocaleString()}
                  </span>
                </div>
                <div className="meter-track">
                  <div
                    className="meter-fill"
                    style={{
                      width: `${Math.min(100, (obs.collisions / Math.max(1, obs.spawns)) * 100)}%`,
                      background: meta.color,
                      boxShadow: isHovered ? `0 0 10px ${meta.color}` : 'none',
                    }}
                  />
                </div>
              </div>

              {/* Hit Rate Footer Box */}
              <div className="hazard-card-footer">
                <div className="footer-metric">
                  <span className="footer-label">COLLISION RATE</span>
                  <span className="footer-rate" style={{ color: threatBadge.color }}>
                    {hitRate.toFixed(1)}%
                  </span>
                </div>
                <div className="footer-metric text-right">
                  <span className="footer-label">PRIMARY WIPE ZONE</span>
                  <span className="footer-zone">{obs.primaryFailureStage || 'Stage 3'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
