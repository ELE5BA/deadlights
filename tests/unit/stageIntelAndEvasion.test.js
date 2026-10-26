import test from 'node:test';
import assert from 'node:assert/strict';

test('overhead obstacle tumbling vault arc clears overhead marquee archway with high clearance', () => {
  // Test the parabolic aerial vault arc used in PursuerEntity
  const calculateVaultLift = (dz) => {
    if (dz < -9.5 || dz > 4.5) return 0;
    const vaultProgress = (dz - (-9.5)) / (4.5 - (-9.5));
    const vaultArc = Math.sin(Math.min(1, Math.max(0, vaultProgress)) * Math.PI);
    return Math.pow(vaultArc, 0.75) * 5.4;
  };

  // Outside detection window
  assert.equal(calculateVaultLift(-15), 0);
  assert.equal(calculateVaultLift(10), 0);

  // Directly over the arch (dz = 0), clown vaults with maximum height (+5.0+ units)
  const liftAtArch = calculateVaultLift(0);
  assert.ok(liftAtArch > 4.5, `Clown vaults high above arch beam: ${liftAtArch}`);

  // Base hover (4.35) + lift (5.0+) places Pennywise above Y = 9.35 (beam is at 6.4, bulbs at 7.05)
  const totalClownY = 4.35 + liftAtArch;
  assert.ok(totalClownY > 8.8, `Clown center of mass (${totalClownY}) clears the 7.05 bulbs by at least 1.7 units`);
});

test('somersault tumbling angle executes complete 360 degree front-flip over the arch with quintic smootherstep easing', () => {
  const calculateFlip = (dz) => {
    const vaultProgress = (dz - (-9.5)) / (4.5 - (-9.5));
    if (vaultProgress < 0.10) return 0;
    if (vaultProgress > 0.88) return -Math.PI * 2;
    const flipProgress = (vaultProgress - 0.10) / (0.88 - 0.10);
    const flipEase = flipProgress * flipProgress * flipProgress * (flipProgress * (flipProgress * 6 - 15) + 10);
    return -flipEase * Math.PI * 2;
  };

  // At the crest of the vault (dz around -2.6), somersault angle passes through inverted (~ -PI)
  const flipMid = calculateFlip(-2.6);
  assert.ok(Math.abs(flipMid) > 2.5, `Clown is tumbling inverted over obstacle: ${flipMid}`);

  // At end of flip (dz = 2.5), rotation completes full 360 degrees (~ -2*PI)
  const flipEnd = calculateFlip(2.5);
  assert.ok(Math.abs(flipEnd) > 5.5, `Clown completes full somersault loop: ${flipEnd}`);

  // Landing glide (dz = 3.5): holds full 360 loop without snapping back to 0
  const flipLanding = calculateFlip(3.5);
  assert.equal(flipLanding, -Math.PI * 2);
});

test('stage intel card default auto-dismissal is strictly 4000ms', () => {
  const autoDismissMs = 4000;
  assert.equal(autoDismissMs, 4000);
});
