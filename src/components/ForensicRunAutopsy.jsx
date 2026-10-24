import React from 'react';

/**
 * Clean SVG Vector Icons (12x12) replacing raw emojis
 */
function DiamondIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 22 12 12 22 2 12" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function SpiralIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A6 6 0 1 0 12 8a2 2 0 1 0 2 2" />
    </svg>
  );
}

function CrossedBladesIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  );
}

/**
 * 4-Tier Forensic Run Autopsy Component
 * Obsidian & Antique Gold Cabinet Style with balanced 2x2 responsive grid
 */
export default function ForensicRunAutopsy({ telemetry, currentStage = 1, currentScore = 0 }) {
  const data = {
    laneOccupancyPct: telemetry?.laneOccupancyPct || [22, 56, 22],
    meanReactionMs: Math.max(80, telemetry?.meanReactionMs || 215),
    dodgeEfficiencyPct: typeof telemetry?.dodgeEfficiencyPct === 'number' ? telemetry.dodgeEfficiencyPct : 78,
    survivalProbPct: typeof telemetry?.survivalProbPct === 'number' ? telemetry.survivalProbPct : 62,
    fatalProjectile: telemetry?.fatalProjectile || null,
    attackStats: {
      blocker_crate: {
        label: 'Heavy Lob',
        Icon: DiamondIcon,
        spawns: telemetry?.attackStats?.blocker_crate?.spawns || 0,
        hits: telemetry?.attackStats?.blocker_crate?.hits || 0,
        dodges: telemetry?.attackStats?.blocker_crate?.dodges || 0,
        dodgePct: telemetry?.attackStats?.blocker_crate?.dodgePct ?? 100,
      },
      shadow_wave: {
        label: 'Low Skimmer',
        Icon: BoltIcon,
        spawns: telemetry?.attackStats?.shadow_wave?.spawns || 0,
        hits: telemetry?.attackStats?.shadow_wave?.hits || 0,
        dodges: telemetry?.attackStats?.shadow_wave?.dodges || 0,
        dodgePct: telemetry?.attackStats?.shadow_wave?.dodgePct ?? 100,
      },
      swaying_specter: {
        label: 'Curveball Pitch',
        Icon: SpiralIcon,
        spawns: telemetry?.attackStats?.swaying_specter?.spawns || 0,
        hits: telemetry?.attackStats?.swaying_specter?.hits || 0,
        dodges: telemetry?.attackStats?.swaying_specter?.dodges || 0,
        dodgePct: telemetry?.attackStats?.swaying_specter?.dodgePct ?? 100,
      },
      double_blockade: {
        label: 'Twin Barrage',
        Icon: CrossedBladesIcon,
        spawns: telemetry?.attackStats?.double_blockade?.spawns || 0,
        hits: telemetry?.attackStats?.double_blockade?.hits || 0,
        dodges: telemetry?.attackStats?.double_blockade?.dodges || 0,
        dodgePct: telemetry?.attackStats?.double_blockade?.dodgePct ?? 100,
      },
    },
  };

  const [leftPct, centerPct, rightPct] = data.laneOccupancyPct;
  const eff = data.dodgeEfficiencyPct;

  // Tier 3: Predictive Run Analytics
  const stageWeight = Math.min(1, Math.max(0.2, (currentStage || 1) / 6));
  const projectedScore = Math.max(
    currentScore,
    Math.round((28000 + (eff / 100) * 34000) * (0.5 + 0.5 * stageWeight))
  );
  const projectedShards = Math.max(12, Math.round(15 + (eff / 100) * 75 * stageWeight));

  // Tier 4: Prescriptive Tactical Field Prescription
  let prescription = {
    code: 'P-00',
    title: 'APEX REFLEX OPTIMIZATION',
    detail: `Dodge efficiency is optimal (${eff}%). Maintain tight center micro-adjustments and sustain focus through Grimlight Core.`,
  };

  const wav = data.attackStats.shadow_wave;
  const spc = data.attackStats.swaying_specter;
  const blk = data.attackStats.double_blockade;

  if (leftPct > 48 || rightPct > 48) {
    const heavyFlank = leftPct > rightPct ? `LEFT (${leftPct}%)` : `RIGHT (${rightPct}%)`;
    prescription = {
      code: 'P-01',
      title: 'CENTER-LANE ANCHORING',
      detail: `Heavy camping on ${heavyFlank} lane. Anchor to center between throws to reduce lateral travel distance.`,
    };
  } else if (wav.spawns > 0 && wav.dodgePct < 70) {
    prescription = {
      code: 'P-02',
      title: 'EARLY JUMP CADENCE (Z ≈ -6.5m)',
      detail: `Low Skimmers inflicted ${wav.hits} hit(s). Initiate jump release earlier at Z ≈ -6.5m to avoid hitbox clipping.`,
    };
  } else if (spc.spawns > 0 && spc.dodgePct < 70) {
    prescription = {
      code: 'P-03',
      title: 'SINE-CURVE ANTICIPATION',
      detail: `Curveballs breached defenses with ${spc.hits} hit(s). Wait for the lateral sine apex before committing.`,
    };
  } else if (blk.spawns > 0 && blk.dodgePct < 70) {
    prescription = {
      code: 'P-04',
      title: 'APEX CORRIDOR TUNNELING',
      detail: `Twin Barrages scored ${blk.hits} hit(s). Spot Pennywise's two-handed wind-up telegraph early.`,
    };
  } else if (data.meanReactionMs > 260) {
    prescription = {
      code: 'P-05',
      title: 'TELEGRAPH ANTICIPATION DRILL',
      detail: `Reaction latency (${data.meanReactionMs}ms) is high. Watch Pennywise's shoulder wind-up animation.`,
    };
  }

  // Fatal projectile string without raw bracketed code keys
  const fatalName = data.fatalProjectile?.name || 'Grimlight Hazard';
  const fatalStage = data.fatalProjectile?.stage || currentStage;

  return (
    <div className="forensic-autopsy-well" role="region" aria-label="Forensic Run Autopsy">
      <div className="autopsy-header">
        <span className="autopsy-title">FORENSIC RUN AUTOPSY</span>
        <span className="autopsy-status-pill">4-TIER TELEMETRY</span>
      </div>

      {/* 2x2 Balanced Responsive Grid */}
      <div className="autopsy-tiers-grid">
        {/* Tier 1: Descriptive Analytics */}
        <div className="autopsy-tier">
          <div className="tier-header">
            <span className="tier-tag">TIER 1</span>
            <span className="tier-name">DESCRIPTIVE TELEMETRY</span>
          </div>
          <div className="telemetry-stat-row">
            <span className="stat-label">LANE OCCUPANCY:</span>
            <span className="stat-value">
              L <strong>{leftPct}%</strong> · C <strong>{centerPct}%</strong> · R <strong>{rightPct}%</strong>
            </span>
          </div>
          <div className="occupancy-track-bar" title="Lane Occupancy Distribution">
            {leftPct > 0 && (
              <div className="occupancy-segment seg-left" style={{ width: `${leftPct}%` }}>
                {leftPct >= 14 ? `L ${leftPct}%` : ''}
              </div>
            )}
            {centerPct > 0 && (
              <div className="occupancy-segment seg-center" style={{ width: `${centerPct}%` }}>
                {centerPct >= 14 ? `C ${centerPct}%` : ''}
              </div>
            )}
            {rightPct > 0 && (
              <div className="occupancy-segment seg-right" style={{ width: `${rightPct}%` }}>
                {rightPct >= 14 ? `R ${rightPct}%` : ''}
              </div>
            )}
          </div>
          <div className="metric-chips-row">
            <div className="metric-chip">
              <span className="chip-label">REFLEX</span>
              <span className="chip-value highlight-cyan">{data.meanReactionMs}ms</span>
            </div>
            <div className="metric-chip">
              <span className="chip-label">EVASION</span>
              <span className="chip-value highlight-gold">{eff}%</span>
            </div>
            <div className="metric-chip">
              <span className="chip-label">ODDS</span>
              <span className={`chip-value ${data.survivalProbPct >= 65 ? 'highlight-green' : data.survivalProbPct >= 35 ? 'highlight-amber' : 'highlight-red'}`}>
                {data.survivalProbPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Tier 2: Diagnostic Analytics */}
        <div className="autopsy-tier">
          <div className="tier-header">
            <span className="tier-tag">TIER 2</span>
            <span className="tier-name">DIAGNOSTIC MATRIX</span>
          </div>
          <div className="attack-matrix-grid">
            {Object.entries(data.attackStats).map(([k, s]) => {
              const IconComp = s.Icon;
              return (
                <div key={k} className="attack-matrix-cell">
                  <div className="attack-cell-title">
                    <IconComp />
                    <span className="attack-name">{s.label}</span>
                  </div>
                  <div className="attack-cell-numbers">
                    <span>{s.hits > 0 ? <strong className="text-danger">{s.hits}H</strong> : <strong className="text-ok">0H</strong>} / {s.spawns}T</span>
                    <strong className="text-cyan">{s.dodgePct}%</strong>
                  </div>
                  <div className="attack-mini-bar">
                    <div className="attack-mini-fill" style={{ width: `${s.dodgePct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {data.fatalProjectile && (
            <div className="fatal-projectile-callout">
              <span className="fatal-label">FATAL:</span>
              <span className="fatal-value">{fatalName} · Stage {fatalStage}</span>
            </div>
          )}
        </div>

        {/* Tier 3: Predictive Analytics */}
        <div className="autopsy-tier">
          <div className="tier-header">
            <span className="tier-tag">TIER 3</span>
            <span className="tier-name">PREDICTIVE REPERCUSSION</span>
          </div>
          <div className="predictive-grid">
            <div className="predictive-card">
              <span className="pred-label">PROJECTED SCORE</span>
              <span className="pred-value highlight-gold">{projectedScore.toLocaleString()}</span>
              <span className="pred-sub">At {eff}% evasion rate</span>
            </div>
            <div className="predictive-card">
              <span className="pred-label">EST. SHARD YIELD</span>
              <span className="pred-value highlight-cyan">+{projectedShards}</span>
              <span className="pred-sub">Stage 1-6 drop model</span>
            </div>
          </div>
        </div>

        {/* Tier 4: Prescriptive Analytics */}
        <div className="autopsy-tier tier-prescriptive">
          <div className="tier-header">
            <span className="tier-tag">TIER 4</span>
            <span className="tier-name">TACTICAL PRESCRIPTION</span>
          </div>
          <div className="prescription-box">
            <div className="prescription-badge">{prescription.code}</div>
            <div className="prescription-content">
              <h4 className="prescription-title">{prescription.title}</h4>
              <p className="prescription-detail">{prescription.detail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
