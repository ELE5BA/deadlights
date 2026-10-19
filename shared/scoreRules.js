import { GAME_CONFIG } from './gameConfig.js';

export function calculateScore({
  survivalSeconds = 0,
  normalShardPickups = 0,
  rareBonusPickups = 0,
  milestonesReached = 0,
  stagesCleared = 0,
  fragmentsCollected = 0,
}) {
  const safeSeconds = Math.min(GAME_CONFIG.roundCapSeconds, Math.max(0, survivalSeconds));
  return Math.floor(safeSeconds * GAME_CONFIG.score.survivalPerSecond)
    + (normalShardPickups * GAME_CONFIG.score.normalShard)
    + (rareBonusPickups * GAME_CONFIG.score.rarePickup)
    + (milestonesReached * GAME_CONFIG.score.milestone)
    + (stagesCleared * (GAME_CONFIG.score.stageClear ?? 300))
    + (fragmentsCollected * (GAME_CONFIG.score.fragmentPickup ?? 150));
}

export function calculateShardAward({
  normalShardPickups = 0,
  rareBonusPickups = 0,
  stagesCleared = 0,
}) {
  return (normalShardPickups * GAME_CONFIG.rewards.normalShardAmount)
    + (rareBonusPickups * GAME_CONFIG.rewards.rareShardAmount)
    + (stagesCleared * (GAME_CONFIG.rewards.stageClearShards ?? 15));
}
