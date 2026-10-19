import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNickname } from '../../server/services/playerService.js';

test('nickname normalization preserves allowed display text and creates a unique key', () => {
  assert.deepEqual(normalizeNickname('  Rift   Runner  '), { nickname: 'Rift Runner', normalized: 'rift runner' });
});

test('nickname validation rejects private or malformed identity input', () => {
  assert.equal(normalizeNickname('A'), null);
  assert.equal(normalizeNickname('name@email'), null);
  assert.equal(normalizeNickname('this nickname is longer than sixteen'), null);
});
