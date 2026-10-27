// Difficulty is expressed as a percentage of the apex tuning below (100% = the former
// Stage 6 "Grimlight Core" curve). Runner speed scales linearly with difficulty. Hazard
// pressure (hazards per second) also scales linearly, split evenly between spawn cadence
// and hazard chance (each scales by the square root), so neither knob double-counts.
export const DIFFICULTY_APEX = Object.freeze({
  speed: Object.freeze({ base: 27.0, perSecond: 0.065, maximum: 31.0 }),
  spawnInterval: Object.freeze({ base: 1.08, perSecond: 0.0025, minimum: 0.90 }),
  hazardChance: 0.72,
});

function roundTo(value, places) {
  return Number(value.toFixed(places));
}

// Headroom above the former Stage 6 apex. Kept modest so hazard chance stays a probability
// (0.72 * sqrt(1.2) ~ 0.79) and the within-stage ramps remain humanly reactable.
export const MAX_DIFFICULTY_PERCENT = 120;

export function tuneStageDifficulty(difficultyPercent) {
  if (!Number.isFinite(difficultyPercent) || difficultyPercent <= 0 || difficultyPercent > MAX_DIFFICULTY_PERCENT) {
    throw new RangeError(`difficultyPercent must be in (0, ${MAX_DIFFICULTY_PERCENT}], received ${difficultyPercent}`);
  }
  const d = difficultyPercent / 100;
  const pressure = Math.sqrt(d);
  const { speed, spawnInterval, hazardChance } = DIFFICULTY_APEX;
  return {
    difficultyPercent,
    // Position on the original 6-step ladder (50% = step 0 ... 100% = step 5, 110% = step 6). The engine's
    // secondary ramps (twin barrage odds, specter sway, wave combos) key off this so they
    // track difficulty rather than how many rounds the run happens to have.
    difficultyTier: Math.max(0, (difficultyPercent - 50) / 10),
    speed: {
      base: roundTo(speed.base * d, 3),
      perSecond: roundTo(speed.perSecond * d, 5),
      maximum: roundTo(speed.maximum * d, 3),
    },
    spawnInterval: {
      base: roundTo(spawnInterval.base / pressure, 3),
      perSecond: roundTo(spawnInterval.perSecond / pressure, 5),
      minimum: roundTo(spawnInterval.minimum / pressure, 3),
    },
    hazardChance: roundTo(hazardChance * pressure, 3),
  };
}

// Rounds are numbered 1-4 for progression, scoring and stage_N events. Each round borrows the
// look of an original 6-stage theme (themeStage): name, atmosphere, music, hazard art, card reward.
export const GAME_STAGES = Object.freeze([
  {
    stage: 1,
    themeStage: 3,
    name: 'The Crimson Mire',
    subtitle: 'Watcher in the Red Weeds',
    durationSeconds: 60,
    ...tuneStageDifficulty(70),
    hazardTypes: ['blocker_crate', 'shadow_wave'],
    atmosphere: {
      fogColor: '#2a0812',
      fogNear: 9,
      fogFar: 33,
      lightColor: '#E94462',
      ambientColor: '#340a16',
      accentColor: '#f43f5e',
      groundColor: '#180308',
    },
    creatureRewardId: 'static-moth',
    fragmentName: 'Static Moth Fragment',
  },
  {
    stage: 2,
    themeStage: 4,
    name: 'The Glitch Rift',
    subtitle: 'Fractured Reality Field',
    durationSeconds: 60,
    ...tuneStageDifficulty(80),
    hazardTypes: ['blocker_crate', 'shadow_wave', 'swaying_specter'],
    atmosphere: {
      fogColor: '#1d0b2b',
      fogNear: 8,
      fogFar: 30,
      lightColor: '#c084fc',
      ambientColor: '#280d3d',
      accentColor: '#a855f7',
      groundColor: '#10051b',
    },
    creatureRewardId: 'velvet-wisp',
    fragmentName: 'Velvet Wisp Fragment',
  },
  {
    stage: 3,
    themeStage: 5,
    name: 'The Abyssal Void',
    subtitle: 'The Darkness Closes In',
    durationSeconds: 60,
    ...tuneStageDifficulty(100),
    hazardTypes: ['blocker_crate', 'shadow_wave', 'swaying_specter', 'double_blockade'],
    atmosphere: {
      fogColor: '#070a12',
      fogNear: 7,
      fogFar: 28,
      lightColor: '#94a3b8',
      ambientColor: '#0e1424',
      accentColor: '#38bdf8',
      groundColor: '#030508',
    },
    creatureRewardId: 'clockwork-crow',
    fragmentName: 'Clockwork Crow Fragment',
  },
  {
    stage: 4,
    themeStage: 6,
    name: 'The Grimlight Core',
    subtitle: 'Apex Jester Barrage',
    durationSeconds: 60,
    ...tuneStageDifficulty(110),
    hazardTypes: ['blocker_crate', 'shadow_wave', 'swaying_specter', 'double_blockade'],
    atmosphere: {
      fogColor: '#220014',
      fogNear: 6,
      fogFar: 25,
      lightColor: '#ff0055',
      ambientColor: '#3b0024',
      accentColor: '#ff2a70',
      groundColor: '#13000b',
    },
    creatureRewardId: 'grinfin',
    fragmentName: 'Grinfin Fragment',
  },
]);

const STAGE_DURATION_SECONDS = 60;
const FIRST_STAGE = GAME_STAGES[0];
const FINAL_STAGE = GAME_STAGES[GAME_STAGES.length - 1];

export const GAME_CONFIG = Object.freeze({
  version: '2.4.0',
  stageCount: GAME_STAGES.length,
  stageDurationSeconds: STAGE_DURATION_SECONDS,
  roundCapSeconds: GAME_STAGES.length * STAGE_DURATION_SECONDS,
  startingHealth: 5,
  maxHealth: 5,
  cardsRequiredPerStage: 5,
  cardSpawnSchedule: [8, 18, 28, 38, 48],
  fragmentsToUnlockCard: 3,
  laneCenters: [-3, 0, 3],
  jumpDurationMs: 550,
  spawnDistance: 32,
  speed: { base: FIRST_STAGE.speed.base, perSecond: FIRST_STAGE.speed.perSecond, maximum: FINAL_STAGE.speed.maximum },
  spawnInterval: { base: FIRST_STAGE.spawnInterval.base, perSecond: FIRST_STAGE.spawnInterval.perSecond, minimum: FINAL_STAGE.spawnInterval.minimum },
  rewards: { normalShardAmount: 1, rareShardAmount: 3, stageClearShards: 15 },
  score: { survivalPerSecond: 10, normalShard: 25, rarePickup: 60, milestone: 50, stageClear: 300, fragmentPickup: 150 },
  eventCap: 1200,
  apiBodyLimit: '512kb',
});

export const GAME_CONFIG_NOTES = 'Version 2.4.0: 4 Escalating Difficulty Stages (60s each) at 70% / 80% / 100% / 110% of apex difficulty, themed after original stages 3-6 (Crimson Mire to Grimlight Core), with Pokemon-style Card Fragment Rewards.';
