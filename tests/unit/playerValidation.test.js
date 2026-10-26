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
  assert.equal(formatSectionTag('Diamond'), '#Diamond');
  assert.equal(formatSectionTag('#Section-1'), '#Section-1');
  assert.equal(formatSectionTag('  CS-101  '), '#CS-101');
});
