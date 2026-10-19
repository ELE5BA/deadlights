import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, calculateShardAward } from '../../shared/scoreRules.js';

test('canonical score example matches the blueprint', () => {
  assert.equal(calculateScore({ survivalSeconds: 42, normalShardPickups: 7, rareBonusPickups: 1, milestonesReached: 2 }), 755);
  assert.equal(calculateShardAward({ normalShardPickups: 7, rareBonusPickups: 1 }), 10);
});

test('survival score caps at round cap (360s)', () => {
  assert.equal(calculateScore({ survivalSeconds: 400, normalShardPickups: 0, rareBonusPickups: 0, milestonesReached: 0 }), 3600);
});

test('stage clear and fragment awards add score and shards properly', () => {
  assert.equal(calculateScore({ survivalSeconds: 60, stagesCleared: 1, fragmentsCollected: 1 }), 600 + 300 + 150);
  assert.equal(calculateShardAward({ stagesCleared: 2 }), 30);
});
