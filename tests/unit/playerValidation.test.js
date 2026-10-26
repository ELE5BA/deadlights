import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNickname, formatFullName, formatSectionTag } from '../../server/services/playerService.js';

test('nickname normalization preserves allowed display text and creates a unique key', () => {
  assert.deepEqual(normalizeNickname('  Rift   Runner  '), { nickname: 'Rift Runner', normalized: 'rift runner' });
});

test('nickname validation rejects private or malformed identity input', () => {
  assert.equal(normalizeNickname('A'), null);
  assert.equal(normalizeNickname('name@email'), null);
  assert.equal(normalizeNickname('this nickname is longer than sixteen'), null);
});

test('fullName and section formatting handles academic roster input [Last Name, First Name] and [#Section]', () => {
  assert.equal(formatFullName('  Dela Cruz, Juan  '), 'Dela Cruz, Juan');
  assert.equal(formatSectionTag('4isb'), '4ISB');
  assert.equal(formatSectionTag('#4ISB'), '4ISB');
  assert.equal(formatSectionTag('  3isa  '), '3ISA');
  assert.equal(formatSectionTag('##Section-1'), 'SECTION-1');
});
