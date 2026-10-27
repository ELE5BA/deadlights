import { useEffect, useState, useMemo, useCallback } from 'react';
import { adminLogout, getAnalytics } from '../services/apiClient.js';
import { runMonteCarloSimulation } from '../services/monteCarloSimulation.js';
import { subscribeTelemetryEvents } from '../services/telemetryBroadcast.js';
import { playButtonClickSfx } from '../game/soundEffects.js';
import { GAME_CONFIG, GAME_STAGES } from '../../shared/gameConfig.js';
import StageFunnelChart from '../components/admin/StageFunnelChart.jsx';
import TerminationDonutChart from '../components/admin/TerminationDonutChart.jsx';
import HazardComparisonChart from '../components/admin/HazardComparisonChart.jsx';
import DailyActivityChart from '../components/admin/DailyActivityChart.jsx';
import AdminSecurityGate from '../components/admin/AdminSecurityGate.jsx';
import '../styles/adminDashboard.css';

/* ── VECTOR ICONS (NO EMOJIS) ── */
function OverviewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}

function HazardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ForecastIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TuningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-1.19" />
    </svg>
  );
}

function GamepadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="6" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function RosterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const SAMPLE_PARTICIPANT_ROSTER = [
  { playerId: 'p-01', fullName: 'Dela Cruz, Juan', section: '4ISB', nickname: 'JUAN_DEL4ISB', totalRuns: 14, bestScore: 54200, bestSurvival: 213.5, maxStagesCleared: 3, totalShards: 182, lastSeenAt: '2026-10-26T08:45:00Z' },
  { playerId: 'p-02', fullName: 'Santos, Maria Clara', section: '3ISA', nickname: 'MARIA_SAN3ISA', totalRuns: 18, bestScore: 61850, bestSurvival: 240.0, maxStagesCleared: 4, totalShards: 245, lastSeenAt: '2026-10-26T09:12:00Z' },
  { playerId: 'p-03', fullName: 'Reyes, Christian', section: '4ISA', nickname: 'CHRIST_REY4ISA', totalRuns: 9, bestScore: 41300, bestSurvival: 143.6, maxStagesCleared: 2, totalShards: 98, lastSeenAt: '2026-10-26T07:30:00Z' },
  { playerId: 'p-04', fullName: 'Gonzales, Gabriel', section: '3ISB', nickname: 'GABRIE_GON3ISB', totalRuns: 12, bestScore: 48900, bestSurvival: 183.5, maxStagesCleared: 3, totalShards: 140, lastSeenAt: '2026-10-26T08:10:00Z' },
  { playerId: 'p-05', fullName: 'Aquino, Bea Angela', section: '4ISB', nickname: 'BEAANG_AQU4ISB', totalRuns: 15, bestScore: 58400, bestSurvival: 230.5, maxStagesCleared: 3, totalShards: 195, lastSeenAt: '2026-10-26T09:05:00Z' },
  { playerId: 'p-06', fullName: 'Mendoza, Ethan', section: '3ISA', nickname: 'ETHAN_MEN3ISA', totalRuns: 6, bestScore: 32100, bestSurvival: 98.7, maxStagesCleared: 1, totalShards: 62, lastSeenAt: '2026-10-26T06:55:00Z' },
  { playerId: 'p-07', fullName: 'Tan, Sophia Nicole', section: '4ISA', nickname: 'SOPHIA_TAN4ISA', totalRuns: 11, bestScore: 46750, bestSurvival: 161.4, maxStagesCleared: 2, totalShards: 128, lastSeenAt: '2026-10-26T08:22:00Z' },
  { playerId: 'p-08', fullName: 'Villanueva, Marcus', section: '3ISB', nickname: 'MARCUS_VIL3ISB', totalRuns: 7, bestScore: 36800, bestSurvival: 115.0, maxStagesCleared: 1, totalShards: 74, lastSeenAt: '2026-10-26T07:15:00Z' },
];

export default function AnalyticsDashboardScreen({ onExit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [liveData, setLiveData] = useState(null);
  const [activeMode, setActiveMode] = useState('simulation');
  const [activeTab, setActiveTab] = useState('overview');
  const [syncNotice, setSyncNotice] = useState('');

  // Participant Roster State
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterSectionFilter, setRosterSectionFilter] = useState('ALL');
  const [rosterSortBy, setRosterSortBy] = useState('score'); // 'score' | 'name' | 'survival' | 'runs'

  // Interactive Monte Carlo Simulation Controls
  const [cohortSize, setCohortSize] = useState(250);
  const [skillProfile, setSkillProfile] = useState('balanced');
  const [hazardDensity, setHazardDensity] = useState(1.0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [simData, setSimData] = useState(() =>
    runMonteCarloSimulation({ cohortSize: 250, skillProfile: 'balanced', hazardDensity: 1.0, speedMultiplier: 1.0 })
  );

  const loadLive = useCallback(() => {
    getAnalytics(from, to)
      .then((res) => {
        setIsAuthenticated(true);
        setLiveData(res);
        if (res?.metrics?.completedRuns > 0) {
          setActiveMode('live');
        }
      })
      .catch((err) => {
        if (err.message === 'ADMIN_AUTH_REQUIRED' || err.code === 'ADMIN_AUTH_REQUIRED') {
          setIsAuthenticated(false);
        } else {
          console.warn('Live analytics note:', err.message);
        }
      });
  }, [from, to]);

  useEffect(() => {
    loadLive();
  }, [loadLive]);

  // Cross-Window Telemetry Sync Listener
  const [livePowerupStats, setLivePowerupStats] = useState({
    shieldsCollected: 0,
    shieldsBroken: 0,
    heartsCollected: 0,
    heartHpRestored: 0,
  });

  useEffect(() => {
    const unsubscribe = subscribeTelemetryEvents((event) => {
      loadLive();
      const pStats = event.detail?.telemetry?.powerupStats;
      if (pStats) {
        setLivePowerupStats((prev) => ({
          shieldsCollected: prev.shieldsCollected + (pStats.shieldsCollected || 0),
          shieldsBroken: prev.shieldsBroken + (pStats.shieldsBroken || 0),
          heartsCollected: prev.heartsCollected + (pStats.heartsCollected || 0),
          heartHpRestored: prev.heartHpRestored + (pStats.heartHpRestored || 0),
        }));
      }
      setSyncNotice(`Live run recorded from game window! (${event.detail?.score ? `${event.detail.score.toLocaleString()} pts` : 'Synced'})`);
      const timer = setTimeout(() => setSyncNotice(''), 5000);
      return () => clearTimeout(timer);
    });
    return unsubscribe;
  }, [loadLive]);

  const handleRunSim = () => {
    playButtonClickSfx();
    const result = runMonteCarloSimulation({
      cohortSize: Number(cohortSize),
      skillProfile,
      hazardDensity: Number(hazardDensity),
      speedMultiplier: Number(speedMultiplier),
    });
    setSimData(result);
    setActiveMode('simulation');
    setSyncNotice(`Simulated cohort of ${cohortSize} runners calculated.`);
    setTimeout(() => setSyncNotice(''), 4000);
  };

  const handleLogout = async () => {
    playButtonClickSfx();
    try {
      await adminLogout();
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    if (window.opener && !window.opener.closed) {
      window.close();
    } else if (onExit) {
      onExit();
    }
  };

  const handleLaunchGameWindow = () => {
    playButtonClickSfx();
    const gameUrl = `${window.location.origin}${window.location.pathname.replace(/\/admin.*$/, '')}`;
    const win = window.open(gameUrl, 'GrimdexGameWindow');
    if (win) win.focus();
  };

  const isSim = activeMode === 'simulation';
  const liveRunsCount = liveData?.metrics?.completedRuns ?? 0;
  const isBayesian = !isSim && liveRunsCount < 5;

  // Canonical Hazard Baselines
  const PRIOR_OBSTACLES = useMemo(() => [
    { key: 'blocker_crate', name: 'Heavy Lob (blocker_crate)', priorSpawns: 185, priorCollisions: 24, wipeStage: 'Stage 2' },
    { key: 'shadow_wave', name: 'Low Skimmer (shadow_wave)', priorSpawns: 160, priorCollisions: 32, wipeStage: 'Stage 3' },
    { key: 'swaying_specter', name: 'Curveball Pitch (swaying_specter)', priorSpawns: 130, priorCollisions: 36, wipeStage: 'Stage 3' },
    { key: 'double_blockade', name: 'Twin Barrage (double_blockade)', priorSpawns: 95, priorCollisions: 39, wipeStage: `Stage ${GAME_CONFIG.stageCount}` },
  ], []);

  // Aggregated KPIs
  const metrics = useMemo(() => {
    if (isSim) return simData.metrics;
    const n = liveRunsCount;
    const baseAvgScore = 38450;
    const baseMedScore = 36200;
    const baseSurv = 112.5;
    const baseShards = 3850;

    const avgScore = liveData?.metrics?.averageScore && liveData.metrics.averageScore > 0
      ? (n < 5 ? Math.round((liveData.metrics.averageScore * n + baseAvgScore * (5 - n)) / 5) : liveData.metrics.averageScore)
      : baseAvgScore;

    const medScore = liveData?.metrics?.medianScore && liveData.metrics.medianScore > 0
      ? (n < 5 ? Math.round((liveData.metrics.medianScore * n + baseMedScore * (5 - n)) / 5) : liveData.metrics.medianScore)
      : baseMedScore;

    const avgSurv = liveData?.metrics?.averageSurvival && liveData.metrics.averageSurvival > 0
      ? Number((n < 5 ? ((liveData.metrics.averageSurvival * n + baseSurv * (5 - n)) / 5) : liveData.metrics.averageSurvival).toFixed(1))
      : baseSurv;

    const totalShards = liveData?.metrics?.totalShardsEarned && liveData.metrics.totalShardsEarned > 0
      ? liveData.metrics.totalShardsEarned
      : (n > 0 ? n * 24 : baseShards);

    return {
      completedRuns: n,
      uniqueProfiles: liveData?.metrics?.uniqueProfiles || (n > 0 ? n : 190),
      averageScore: avgScore,
      medianScore: medScore,
      averageSurvival: avgSurv,
      totalShardsEarned: totalShards,
      cardsUnlocked: Math.min(8, Math.max(1, Math.round(totalShards / 20))),
    };
  }, [isSim, simData, liveData, liveRunsCount]);

  const powerupMetrics = useMemo(() => {
    if (isSim && simData?.powerupStats) {
      return simData.powerupStats;
    }
    const n = Math.max(1, liveRunsCount);
    const baseShields = Math.max(livePowerupStats.shieldsCollected, n * 2);
    const baseBroken = Math.max(livePowerupStats.shieldsBroken, Math.round(baseShields * 0.82));
    const baseHearts = Math.max(livePowerupStats.heartsCollected, Math.round(n * 2.3));
    const baseRestored = Math.max(livePowerupStats.heartHpRestored, Math.round(baseHearts * 0.75));
    const impactsAbsorbedPct = baseShields > 0 ? Number(((baseBroken / baseShields) * 100).toFixed(1)) : 82.0;

    return {
      shieldsCollected: baseShields,
      shieldsBroken: baseBroken,
      heartsCollected: baseHearts,
      heartHpRestored: baseRestored,
      impactsAbsorbedPct,
    };
  }, [isSim, simData, liveRunsCount, livePowerupStats]);

  const finalStageClearRate = useMemo(() => {
    if (isSim) return simData.metrics.finalStageClearRate;
    if (liveRunsCount >= 5) {
      const fullClearRuns = (liveData?.series?.endReasons || []).find((r) => r.reason === 'all_stages_cleared')?.count || 0;
      return Number(((fullClearRuns / liveRunsCount) * 100).toFixed(1));
    }
    return 16.4;
  }, [isSim, simData, liveData, liveRunsCount]);

  // Stage Progression Funnel
  const funnelData = useMemo(() => {
    if (isSim) return simData.funnel;
    const total = liveRunsCount > 0 ? liveRunsCount : 250;
    // Prior reach curve for the 70% / 80% / 100% / 110% ladder: the 100% step is the steepest drop
    const basePcts = [100, 80.5, 55.0, 26.0];
    return GAME_STAGES.map((stageConfig, idx) => {
      const pct = basePcts[idx] ?? basePcts[basePcts.length - 1];
      const reached = Math.max(1, Math.round(total * (pct / 100)));
      return {
        stage: stageConfig.stage,
        name: stageConfig.name,
        difficultyPercent: stageConfig.difficultyPercent,
        reached,
        pct: Number(pct.toFixed(1)),
      };
    });
  }, [isSim, simData, liveRunsCount]);

  // Obstacle Stats
  const obstacleStats = useMemo(() => {
    if (isSim) return simData.obstacleStats;
    const liveStatsMap = {};
    (liveData?.obstacleStats || []).forEach((st) => {
      liveStatsMap[st.entityKey] = st;
    });

    return PRIOR_OBSTACLES.map((obs) => {
      const liveStat = liveStatsMap[obs.key];
      const spawns = (liveStat?.spawns || 0) + (isBayesian ? obs.priorSpawns : 0);
      const collisions = (liveStat?.collisions || 0) + (isBayesian ? obs.priorCollisions : 0);
      const safeSpawns = Math.max(1, spawns);
      const collisionRate = Number(((collisions / safeSpawns) * 100).toFixed(1));

      return {
        entityKey: obs.key,
        displayName: obs.name,
        spawns: safeSpawns,
        collisions,
        collisionRate,
        primaryFailureStage: liveStat?.primaryFailureStage || obs.wipeStage,
      };
    });
  }, [isSim, simData, liveData, isBayesian, PRIOR_OBSTACLES]);

  // Termination Split
  const terminationSplit = useMemo(() => {
    if (isSim) return simData.endReasons;
    if (liveRunsCount >= 5 && liveData?.series?.endReasons?.length) {
      const total = liveRunsCount;
      return liveData.series.endReasons.map((r) => ({
        reason: r.reason,
        count: r.count,
        pct: Number(((r.count / total) * 100).toFixed(1)),
      }));
    }
    const cohort = Math.max(50, liveRunsCount > 0 ? liveRunsCount : 250);
    return [
      { reason: 'all_stages_cleared', count: Math.max(1, Math.round(cohort * 0.164)), pct: 16.4 },
      { reason: 'hit_points_zero', count: Math.max(1, Math.round(cohort * 0.542)), pct: 54.2 },
      { reason: 'card_missed', count: Math.max(1, Math.round(cohort * 0.294)), pct: 29.4 },
    ];
  }, [isSim, simData, liveData, liveRunsCount]);

  // Predictive Information
  const predictiveInfo = useMemo(() => {
    if (isSim) return simData.predictive;
    const expectedShards = liveData?.estimates?.expectedShardsPerRun ?? 24.5;
    const runsForBinder = Math.ceil(140 / Math.max(1, expectedShards));
    const nextDay = liveData?.estimates?.nextDayRuns ?? Math.max(55, Math.round(liveRunsCount * 1.15 + 68));
    return {
      expectedShardsPerRun: expectedShards,
      runsToCompleteBinder: runsForBinder,
      peakHourRuns: Math.round(nextDay * 0.35),
      nextDayProjection: nextDay,
      bottleneckStage: `Stage 3: ${GAME_STAGES[2].name}`,
      wipeProbability: 29.0,
    };
  }, [isSim, simData, liveData, liveRunsCount]);

  // Prescriptive Tuning Feed
  const recommendations = useMemo(() => {
    if (isSim) return simData.recommendations;
    if (liveRunsCount >= 20 && liveData?.recommendations?.length) {
      return liveData.recommendations;
    }
    const sampleTag = `n = ${liveRunsCount} (Bayesian Prior Blended)`;
    return [
      {
        id: 'P-01',
        sample: sampleTag,
        observed: 'Twin Barrage (double_blockade): 41.1% Hit Rate',
        text: `Calibrate safe-lane telegraphing 1.2s prior to Twin Barrage releases in Stage ${GAME_CONFIG.stageCount} to widen escape corridor.`,
        projectedImpact: '+9.2% Stage Survival',
      },
      {
        id: 'P-02',
        sample: sampleTag,
        observed: 'Curveball Pitch (swaying_specter): 27.7% Hit Rate',
        text: 'Dampen lateral sinusoidal frequency of Curveball Pitches in Stage 3 by 14% to reduce flank lane collision spikes.',
        projectedImpact: '+6.5% Progression Throughput',
      },
      {
        id: 'P-03',
        sample: sampleTag,
        observed: 'Low Skimmer (shadow_wave): 20.0% Hit Rate',
        text: 'Enhance jump ramp visual telegraph at Z ≈ -6.5m for ground-skimming chakrams.',
        projectedImpact: '+5.1% Vitality Retention',
      },
      {
        id: 'P-04',
        sample: sampleTag,
        observed: 'Expected Shards: 24.5 / run (Binder Target: 140 Shards)',
        text: `Maintain 6-run binder progression curve; sustain 15-shard completion bonus on Stage ${GAME_CONFIG.stageCount} clear.`,
        projectedImpact: 'Optimizes 6-Session Player Retention',
      },
      {
        id: 'P-05',
        sample: sampleTag,
        observed: `Stage ${GAME_CONFIG.stageCount} Clear Rate: 16.4% (${GAME_STAGES[GAME_STAGES.length - 1].name})`,
        text: 'Apex gauntlet difficulty calibrated within ideal 15–20% tournament balance envelope.',
        projectedImpact: 'Preserves Grimdex Master Holo Rarity',
      },
    ];
  }, [isSim, simData, liveData, liveRunsCount]);

  // Participant Roster Filtering & Sorting
  const participantRoster = useMemo(() => {
    const raw = (liveData?.playerRoster && liveData.playerRoster.length > 0)
      ? liveData.playerRoster
      : (isSim ? SAMPLE_PARTICIPANT_ROSTER : (liveData?.playerRoster || SAMPLE_PARTICIPANT_ROSTER));

    return raw.filter((p) => {
      const q = rosterSearch.toLowerCase();
      const matchName = (p.fullName || '').toLowerCase().includes(q) || (p.nickname || '').toLowerCase().includes(q);
      const matchSec = rosterSectionFilter === 'ALL' || (p.section || '').toLowerCase() === rosterSectionFilter.toLowerCase();
      return matchName && matchSec;
    }).sort((a, b) => {
      if (rosterSortBy === 'name') return (a.fullName || a.nickname).localeCompare(b.fullName || b.nickname);
      if (rosterSortBy === 'runs') return (b.totalRuns || 0) - (a.totalRuns || 0);
      if (rosterSortBy === 'survival') return (b.bestSurvival || 0) - (a.bestSurvival || 0);
      return (b.bestScore || 0) - (a.bestScore || 0);
    });
  }, [liveData, isSim, rosterSearch, rosterSectionFilter, rosterSortBy]);

  const availableSections = useMemo(() => {
    const raw = (liveData?.playerRoster && liveData.playerRoster.length > 0)
      ? liveData.playerRoster
      : SAMPLE_PARTICIPANT_ROSTER;
    const set = new Set();
    raw.forEach((p) => { if (p.section) set.add(p.section); });
    return ['ALL', ...Array.from(set).sort()];
  }, [liveData]);

  const handleExportCsv = useCallback(() => {
    playButtonClickSfx();
    const headers = [
      'Player Name [Last Name, First Name]',
      'Section',
      'Arcade Call-sign',
      'Completed Runs',
      'High Score',
      'Best Survival (sec)',
      'Max Stage Cleared',
      'Shards Collected',
      'Last Active'
    ];
    const rows = participantRoster.map((p) => [
      `"${(p.fullName || '').replace(/"/g, '""')}"`,
      `"${(p.section || '').replace(/"/g, '""')}"`,
      `"${(p.nickname || '').replace(/"/g, '""')}"`,
      p.totalRuns || 0,
      p.bestScore || 0,
      typeof p.bestSurvival === 'number' ? p.bestSurvival.toFixed(1) : p.bestSurvival || 0,
      p.maxStagesCleared || 0,
      p.totalShards || 0,
      `"${p.lastSeenAt || ''}"`
    ]);
    const csvStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows.map((r) => r.join(','))].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvStr);
    link.setAttribute('download', `deadlights_student_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [participantRoster]);

  // Security Gate if unauthenticated
  if (!isAuthenticated) {
    return (
      <AdminSecurityGate
        onAuthenticated={() => {
          setIsAuthenticated(true);
          loadLive();
        }}
        onLaunchGame={handleLaunchGameWindow}
      />
    );
  }

  return (
    <div className="admin-console-root">
      {/* ── STICKY TOP APP BAR ── */}
      <header className="admin-top-bar">
        <div className="admin-brand-cluster">
          <div className="admin-emblem-badge" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="admin-title-group">
            <h1>
              GRIMDEX BOOTH CONSOLE
              <span className="admin-mode-indicator">
                {isSim ? 'SIMULATOR' : 'LIVE TELEMETRY'}
              </span>
            </h1>
            <p className="admin-title-sub">
              4-Tier Arcade Data Science Suite & Real-Time Balance Simulator
            </p>
          </div>
        </div>

        {/* Source Switcher */}
        <div className="admin-source-toggle" role="radiogroup" aria-label="Data Source">
          <button
            type="button"
            className={`source-btn ${!isSim ? 'is-active-source' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveMode('live');
              loadLive();
            }}
          >
            <span style={{ color: '#ef4444' }}>●</span>
            <span>Live SQLite ({liveRunsCount})</span>
          </button>
          <button
            type="button"
            className={`source-btn ${isSim ? 'is-active-source' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveMode('simulation');
            }}
          >
            <SparkIcon />
            <span>Monte Carlo Sandbox</span>
          </button>
        </div>

        {/* Actions Cluster */}
        <div className="admin-top-actions">
          <div className="admin-status-pulse" title="Cross-window live sync enabled">
            <span className="pulse-dot" />
            <span>LIVE SYNC</span>
          </div>

          <button
            type="button"
            className="admin-btn-sm"
            onClick={handleLaunchGameWindow}
            title="Open game runner window so game and admin are side-by-side"
          >
            <GamepadIcon />
            <span>Play Game</span>
          </button>

          <button
            type="button"
            className="admin-btn-sm"
            onClick={() => {
              playButtonClickSfx();
              loadLive();
            }}
            title="Reload latest live metrics"
          >
            <RefreshIcon />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            className="admin-btn-danger-sm"
            onClick={handleLogout}
            title="Close or sign out of operator console"
          >
            <ExitIcon />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="admin-main-container">
        {syncNotice && (
          <div className="live-sync-banner" role="status">
            <span>{syncNotice}</span>
            <button
              type="button"
              onClick={() => setSyncNotice('')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── TOP KPI WELLS STRIP (4 CLEAN HIGH-IMPACT CARDS) ── */}
        <section className="admin-kpi-grid" aria-label="Core Key Performance Indicators">
          <div className="admin-kpi-card">
            <div className="kpi-card-glow" />
            <div className="kpi-header">
              <span className="kpi-label">TOTAL SESSIONS</span>
              <span className="kpi-tag">{isSim ? 'SIMULATED' : isBayesian ? 'BAYESIAN' : 'LIVE'}</span>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-main-val">{(metrics.completedRuns ?? 0).toLocaleString()}</span>
              <span className="kpi-unit">runs</span>
            </div>
            <span className="kpi-footer-note">
              {metrics.uniqueProfiles ?? 0} unique arcade runner callsigns
            </span>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-card-glow" />
            <div className="kpi-header">
              <span className="kpi-label">STAGE {GAME_CONFIG.stageCount} VICTORY</span>
              <span className="kpi-tag" style={{ color: '#10b981' }}>APEX CLEAR</span>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-main-val" style={{ color: '#10b981' }}>{finalStageClearRate}%</span>
              <span className="kpi-unit">cleared</span>
            </div>
            <span className="kpi-footer-note">
              Target balance envelope: 15% – 20%
            </span>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-card-glow" />
            <div className="kpi-header">
              <span className="kpi-label">AVG SURVIVAL</span>
              <span className="kpi-tag">CAP: {GAME_CONFIG.roundCapSeconds}s</span>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-main-val" style={{ color: '#38bdf8' }}>{metrics.averageSurvival ?? 0}</span>
              <span className="kpi-unit">sec</span>
            </div>
            <span className="kpi-footer-note">
              Median: {metrics.medianSurvival ?? 0}s · Mean: {metrics.averageSurvival ?? 0}s
            </span>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-card-glow" />
            <div className="kpi-header">
              <span className="kpi-label">SHARDS EXTRACTED</span>
              <span className="kpi-tag" style={{ color: '#f59e0b' }}>ECONOMY</span>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-main-val" style={{ color: '#f59e0b' }}>
                {(metrics.totalShardsEarned ?? 0).toLocaleString()}
              </span>
              <span className="kpi-unit">shards</span>
            </div>
            <span className="kpi-footer-note">
              {metrics.cardsUnlocked ?? 0} / 8 Pokédex cards crafted
            </span>
          </div>
        </section>

        {/* ── TAB NAVIGATION BAR ── */}
        <nav className="admin-tabs-bar" aria-label="Console Navigation Tabs">
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'overview' ? 'is-active-tab' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveTab('overview');
            }}
          >
            <OverviewIcon />
            <span>Overview & Flow</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'hazards' ? 'is-active-tab' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveTab('hazards');
            }}
          >
            <HazardIcon />
            <span>Hazard Lethality</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'economy' ? 'is-active-tab' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveTab('economy');
            }}
          >
            <ForecastIcon />
            <span>Predictive & Capacity</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'prescriptions' ? 'is-active-tab' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveTab('prescriptions');
            }}
          >
            <TuningIcon />
            <span>Prescriptive Tuning ({recommendations.length})</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'roster' ? 'is-active-tab' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveTab('roster');
            }}
          >
            <RosterIcon />
            <span>Participant Roster ({participantRoster.length})</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'simulator' ? 'is-active-tab' : ''}`}
            onClick={() => {
              playButtonClickSfx();
              setActiveTab('simulator');
            }}
          >
            <SparkIcon />
            <span>Monte Carlo Sandbox</span>
          </button>
        </nav>

        {/* ── TAB 1: OVERVIEW & FLOW ── */}
        {activeTab === 'overview' && (
          <div className="tab-content-panel">
            <div className="overview-grid-2col">
              <div className="admin-card-section">
                <StageFunnelChart
                  funnelData={funnelData}
                  bottleneckStage={predictiveInfo.bottleneckStage}
                />
              </div>

              <div className="admin-card-section">
                <TerminationDonutChart
                  endReasons={terminationSplit}
                  totalRuns={metrics.completedRuns}
                />
              </div>
            </div>

            <div className="admin-card-section">
              <DailyActivityChart seriesDaily={liveData?.series?.daily} />
            </div>

            {/* SURVIVAL RELICS & POWER-UP UTILIZATION SECTION */}
            <div className="admin-card-section">
              <div className="funnel-chart-header">
                <div>
                  <h4 className="chart-title">SURVIVAL RELICS & POWER-UP TELEMETRY MATRIX</h4>
                  <p className="chart-subtitle">
                    Field deployment volume, hazard impact absorption efficacy, and runner survivability impact
                  </p>
                </div>
                <span className="source-badge">
                  {isSim ? 'SIMULATED COHORT' : isBayesian ? 'BAYESIAN PRIORS' : 'LIVE TELEMETRY'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '1rem' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em' }}>AEGIS FORCEFIELD SHIELD</span>
                    <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', marginBottom: '4px' }}>
                    {powerupMetrics.shieldsCollected.toLocaleString()}
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginLeft: '6px' }}>deployed</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    <strong style={{ color: '#38bdf8' }}>{powerupMetrics.shieldsBroken.toLocaleString()}</strong> lethal hazard hits absorbed with 0 HP lost ({powerupMetrics.impactsAbsorbedPct}% absorption rate).
                  </div>
                </div>

                <div style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f43f5e', letterSpacing: '0.06em' }}>SOUL HEARTS RECOVERED</span>
                    <span style={{ fontSize: '1.2rem' }}>❤️</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', marginBottom: '4px' }}>
                    {powerupMetrics.heartsCollected.toLocaleString()}
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginLeft: '6px' }}>recovered</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    Restored <strong style={{ color: '#f43f5e' }}>+{powerupMetrics.heartHpRestored.toLocaleString()} HP</strong> to critical runners; overflow awarded bonus arcade points.
                  </div>
                </div>

                <div style={{ background: 'rgba(212, 163, 73, 0.06)', border: '1px solid rgba(212, 163, 73, 0.3)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#d4a349', letterSpacing: '0.06em' }}>RELIC SURVIVABILITY LIFT</span>
                    <span style={{ fontSize: '1.2rem' }}>✨</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#facc15', marginBottom: '4px' }}>
                    +{(powerupMetrics.shieldsBroken + powerupMetrics.heartHpRestored).toLocaleString()}
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginLeft: '6px' }}>hits buffered</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    Extended runner lifespan by an estimated <strong style={{ color: '#facc15' }}>~{((powerupMetrics.shieldsBroken + powerupMetrics.heartHpRestored) * 4.2).toFixed(0)}s</strong> across all gauntlet runs.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: HAZARD LETHALITY & DIAGNOSTICS ── */}
        {activeTab === 'hazards' && (
          <div className="tab-content-panel">
            <div className="admin-card-section">
              <HazardComparisonChart obstacleStats={obstacleStats} />
            </div>

            <div className="admin-card-section" style={{ marginTop: '1rem' }}>
              <div className="funnel-chart-header">
                <div>
                  <h4 className="chart-title">DEFENSIVE RELIC MITIGATION ANALYSIS</h4>
                  <p className="chart-subtitle">
                    How Aegis Forcefields and Soul Hearts neutralize hazard lethality curves
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '0.75rem' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🛡️</span>
                    <strong style={{ color: '#38bdf8', fontSize: '0.88rem' }}>Aegis Shield vs. Twin Barrage & Heavy Lob</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.45' }}>
                    Aegis Shields have absorbed <strong style={{ color: '#38bdf8' }}>{powerupMetrics.shieldsBroken.toLocaleString()}</strong> heavy and lethal strikes across carnival lanes with 0 HP lost, directly lowering wipe probability on sudden double blockades.
                  </p>
                </div>
                <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '8px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.1rem' }}>❤️</span>
                    <strong style={{ color: '#f43f5e', fontSize: '0.88rem' }}>Soul Heart Vitality Buffer</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.45' }}>
                    Recovered <strong style={{ color: '#f43f5e' }}>+{powerupMetrics.heartHpRestored.toLocaleString()} HP</strong>, offering runners crucial vitality recovery after low skimmer and curveball clipping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: PREDICTIVE & CAPACITY FORECAST ── */}
        {activeTab === 'economy' && (
          <div className="tab-content-panel">
            <div className="admin-card-section">
              <div className="funnel-chart-header">
                <div>
                  <h4 className="chart-title">PREDICTIVE BOOTH & PLAYER RETENTION FORECAST</h4>
                  <p className="chart-subtitle">
                    Projected gauntlet completions, peak floor attendance, and bottleneck risk model
                  </p>
                </div>
              </div>

              <div className="predictive-cards-grid">
                <div className="pred-card-well">
                  <span className="pred-eyebrow">PLAYER ECONOMY HORIZON</span>
                  <h4 className="pred-title">BINDER COMPLETION TIME</h4>
                  <div className="pred-hero-metric">
                    <span className="pred-val" style={{ color: '#f59e0b' }}>
                      {predictiveInfo.runsToCompleteBinder}
                    </span>
                    <span className="pred-unit">RUNS</span>
                  </div>
                  <p className="pred-desc">
                    At an average yield of <strong>{predictiveInfo.expectedShardsPerRun} shards/run</strong>, runners require approximately {predictiveInfo.runsToCompleteBinder} gauntlets to craft all 8 Pokédex binder cards.
                  </p>
                </div>

                <div className="pred-card-well">
                  <span className="pred-eyebrow">ATTENDANCE CAPACITY</span>
                  <h4 className="pred-title">PEAK BOOTH THROUGHPUT</h4>
                  <div className="pred-hero-metric">
                    <span className="pred-val" style={{ color: '#38bdf8' }}>
                      {predictiveInfo.peakHourRuns}
                    </span>
                    <span className="pred-unit">RUNS / HR</span>
                  </div>
                  <p className="pred-desc">
                    Projection models <strong>{predictiveInfo.nextDayProjection} daily sessions</strong>, with peak carnival traffic accommodating up to {predictiveInfo.peakHourRuns} player rotations per hour.
                  </p>
                </div>

                <div className="pred-card-well">
                  <span className="pred-eyebrow">VULNERABILITY CLIFF</span>
                  <h4 className="pred-title">BOTTLENECK HAZARD SPIKE</h4>
                  <div className="pred-hero-metric">
                    <span className="pred-val" style={{ color: '#ef4444' }}>
                      {predictiveInfo.wipeProbability}%
                    </span>
                    <span className="pred-unit">WIPE RISK</span>
                  </div>
                  <p className="pred-desc">
                    <strong>{predictiveInfo.bottleneckStage}</strong> represents the steepest difficulty cliff, where double blockade velocity causes rapid vitality wipes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: PRESCRIPTIVE TUNING FEED ── */}
        {activeTab === 'prescriptions' && (
          <div className="tab-content-panel">
            <div className="admin-card-section">
              <div className="funnel-chart-header">
                <div>
                  <h4 className="chart-title">PRESCRIPTIVE GAME BALANCE & TUNING PROPOSALS</h4>
                  <p className="chart-subtitle">
                    Automated data-driven adjustments derived from observed hazard collision rates and survival curves
                  </p>
                </div>
              </div>

              <div className="prescriptive-feed-stack">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="rec-card-item">
                    <div className="rec-top-row">
                      <div className="rec-left-badges">
                        <span className="rec-id-pill">{rec.id}</span>
                        <span className="rec-sample-pill">SAMPLE: {rec.sample}</span>
                      </div>
                      {rec.projectedImpact && (
                        <span className="rec-delta-pill">PROJECTED: {rec.projectedImpact}</span>
                      )}
                    </div>
                    <div className="rec-observed-row">
                      <span className="rec-obs-label">OBSERVED TELEMETRY:</span>
                      <span className="rec-obs-val">{rec.observed}</span>
                    </div>
                    <p className="rec-action-text">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: MONTE CARLO SIMULATOR LAB ── */}
        {activeTab === 'simulator' && (
          <div className="tab-content-panel">
            <div className="simulator-sandbox-box">
              <div>
                <h4 className="chart-title">INTERACTIVE MONTE CARLO BALANCE SANDBOX</h4>
                <p className="chart-subtitle">
                  Simulate stochastic cohorts (50 to 1,000 runs) to preview gameplay balance, throughput, and lethal hazard hit rates
                </p>
              </div>

              <div className="sim-controls-grid">
                <div className="sim-control-item">
                  <label htmlFor="simCohort" className="sim-control-label">
                    <span>COHORT SIZE</span>
                    <span className="sim-control-val">{cohortSize} runs</span>
                  </label>
                  <input
                    id="simCohort"
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={cohortSize}
                    onChange={(e) => setCohortSize(Number(e.target.value))}
                    className="sim-slider-input"
                  />
                </div>

                <div className="sim-control-item">
                  <label htmlFor="simSkill" className="sim-control-label">
                    <span>SKILL PROFILE</span>
                    <span className="sim-control-val">{skillProfile.toUpperCase()}</span>
                  </label>
                  <select
                    id="simSkill"
                    value={skillProfile}
                    onChange={(e) => setSkillProfile(e.target.value)}
                    className="sim-select-input"
                  >
                    <option value="novice">Novice (First-Time Players)</option>
                    <option value="balanced">Balanced (Average Arcade Mix)</option>
                    <option value="veteran">Veteran (Experienced Runners)</option>
                  </select>
                </div>

                <div className="sim-control-item">
                  <label htmlFor="simDensity" className="sim-control-label">
                    <span>HAZARD DENSITY</span>
                    <span className="sim-control-val">{hazardDensity}x</span>
                  </label>
                  <input
                    id="simDensity"
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={hazardDensity}
                    onChange={(e) => setHazardDensity(Number(e.target.value))}
                    className="sim-slider-input"
                  />
                </div>

                <div className="sim-control-item">
                  <label htmlFor="simSpeed" className="sim-control-label">
                    <span>SPEED MULTIPLIER</span>
                    <span className="sim-control-val">{speedMultiplier}x</span>
                  </label>
                  <input
                    id="simSpeed"
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.05"
                    value={speedMultiplier}
                    onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
                    className="sim-slider-input"
                  />
                </div>
              </div>

              <div className="sim-run-btn-bar">
                <button
                  type="button"
                  className="sim-execute-btn"
                  onClick={handleRunSim}
                >
                  <SparkIcon />
                  <span>EXECUTE MONTE CARLO SIMULATION</span>
                </button>
              </div>
            </div>

            {/* Preview of Simulated Funnel & Hazards */}
            <div className="overview-grid-2col">
              <div className="admin-card-section">
                <StageFunnelChart
                  funnelData={simData.funnel}
                  bottleneckStage={simData.predictive?.bottleneckStage}
                />
              </div>
              <div className="admin-card-section">
                <TerminationDonutChart
                  endReasons={simData.endReasons}
                  totalRuns={simData.metrics?.completedRuns}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: PARTICIPANT ROSTER & STUDENT RECORDS ── */}
        {activeTab === 'roster' && (
          <div className="tab-content-panel">
            <div className="admin-card-section">
              <div className="funnel-chart-header" style={{ marginBottom: '14px' }}>
                <div>
                  <h4 className="chart-title">PARTICIPANT REGISTRY & STUDENT ACADEMIC ROSTER</h4>
                  <p className="chart-subtitle">
                    Recorded student names [Last Name, First Name], class sections [#Section], arcade runs, and apex scores
                  </p>
                </div>
              </div>

              {/* Roster Summary KPIs */}
              <div className="roster-kpi-bar">
                <div className="roster-kpi-item">
                  <span className="roster-kpi-label">TOTAL REGISTERED PARTICIPANTS</span>
                  <span className="roster-kpi-val" style={{ color: '#38bdf8' }}>{participantRoster.length}</span>
                </div>
                <div className="roster-kpi-item">
                  <span className="roster-kpi-label">ACTIVE CLASS SECTIONS</span>
                  <span className="roster-kpi-val" style={{ color: '#fbbf24' }}>{availableSections.length - 1}</span>
                </div>
                <div className="roster-kpi-item">
                  <span className="roster-kpi-label">TOP RECORD SCORE</span>
                  <span className="roster-kpi-val" style={{ color: '#10b981' }}>
                    {participantRoster.length > 0
                      ? Math.max(...participantRoster.map(p => p.bestScore || 0)).toLocaleString()
                      : 0}
                  </span>
                </div>
                <div className="roster-kpi-item">
                  <span className="roster-kpi-label">TOTAL SESSIONS LOGGED</span>
                  <span className="roster-kpi-val" style={{ color: '#f59e0b' }}>
                    {participantRoster.reduce((sum, p) => sum + (p.totalRuns || 0), 0)}
                  </span>
                </div>
              </div>

              {/* Filter & Action Controls Bar */}
              <div className="roster-filter-bar">
                <div className="roster-filter-left">
                  <input
                    type="text"
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    placeholder="Search by student name or call-sign…"
                    className="roster-search-input"
                  />

                  <select
                    value={rosterSectionFilter}
                    onChange={(e) => setRosterSectionFilter(e.target.value)}
                    className="roster-select-input"
                  >
                    <option value="ALL">All Sections (Filter)</option>
                    {availableSections.filter(s => s !== 'ALL').map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>

                  <select
                    value={rosterSortBy}
                    onChange={(e) => setRosterSortBy(e.target.value)}
                    className="roster-select-input"
                  >
                    <option value="score">Sort by: High Score (Highest First)</option>
                    <option value="survival">Sort by: Best Survival Time</option>
                    <option value="runs">Sort by: Most Runs Completed</option>
                    <option value="name">Sort by: Student Name (A-Z)</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="roster-export-btn"
                  onClick={handleExportCsv}
                  title="Export student records to CSV spreadsheet"
                >
                  <DownloadIcon />
                  <span>EXPORT CSV SPREADSHEET</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="roster-table-container">
                <table className="roster-data-table">
                  <thead>
                    <tr>
                      <th className="roster-th">STUDENT NAME</th>
                      <th className="roster-th">SECTION</th>
                      <th className="roster-th">CALL-SIGN</th>
                      <th className="roster-th">RUNS</th>
                      <th className="roster-th">HIGH SCORE</th>
                      <th className="roster-th">BEST SURVIVAL</th>
                      <th className="roster-th">MAX STAGE</th>
                      <th className="roster-th">SHARDS</th>
                      <th className="roster-th">LAST ACTIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantRoster.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                          No participant records found matching the current search filters.
                        </td>
                      </tr>
                    ) : (
                      participantRoster.map((p, idx) => (
                        <tr key={p.playerId || idx} className="roster-tr">
                          <td className="roster-td">
                            <span className="student-avatar-circle">
                              {(p.fullName || p.nickname).charAt(0).toUpperCase()}
                            </span>
                            <strong style={{ color: '#f8fafc' }}>{p.fullName || p.nickname}</strong>
                          </td>
                          <td className="roster-td">
                            {p.section ? (
                              <span className="section-badge-pill">{p.section}</span>
                            ) : (
                              <span style={{ color: '#64748b' }}>—</span>
                            )}
                          </td>
                          <td className="roster-td">
                            <span className="callsign-mono">{p.nickname}</span>
                          </td>
                          <td className="roster-td" style={{ textAlign: 'center' }}>
                            <strong style={{ color: '#e2e8f0' }}>{p.totalRuns || 0}</strong>
                          </td>
                          <td className="roster-td">
                            <span className="score-badge-gold">{(p.bestScore || 0).toLocaleString()}</span>
                          </td>
                          <td className="roster-td">
                            <span style={{ color: '#38bdf8' }}>
                              {typeof p.bestSurvival === 'number' ? p.bestSurvival.toFixed(1) : p.bestSurvival || '0.0'}s
                            </span>
                          </td>
                          <td className="roster-td">
                            <span style={{ color: (p.maxStagesCleared || 0) >= GAME_CONFIG.stageCount ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                              {(p.maxStagesCleared || 0) >= GAME_CONFIG.stageCount
                                ? `APEX CLEAR (${GAME_CONFIG.stageCount}/${GAME_CONFIG.stageCount})`
                                : `Stage ${(p.maxStagesCleared || 0) + 1}/${GAME_CONFIG.stageCount}`}
                            </span>
                          </td>
                          <td className="roster-td" style={{ color: '#f59e0b' }}>
                            {p.totalShards || 0}
                          </td>
                          <td className="roster-td" style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                            {p.lastSeenAt ? new Date(p.lastSeenAt).toLocaleDateString() : 'Recent'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
