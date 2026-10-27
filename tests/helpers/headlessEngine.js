import * as THREE from 'three';
import { GameEngine } from '../../src/game/GameEngine.js';

// Drives the real GameEngine frame loop without WebGL, DOM, or audio: the renderer and the
// animated character rigs are stubbed, while spawning, scoring, stage progression, telemetry
// and the run-end payload all execute the production code paths.
globalThis.requestAnimationFrame ??= () => 0;
globalThis.cancelAnimationFrame ??= () => {};

function stubRig() {
  const root = new THREE.Group();
  return {
    root,
    lastThrowHand: 'right',
    update() {},
    updateVictory() {},
    updateDefeat() {},
    setVictory() {},
    setShieldActive() {},
    setRunnerType() {},
    resetJumpscare() {},
    triggerJumpscare() {},
    triggerDefeatCollapse() {},
    triggerThrowAnimation() {},
    triggerHeartHealEffect() {},
    triggerShieldActivateEffect() {},
    triggerShieldBreakEffect() {},
    getHandWorldPosition: () => null,
    getSpeechBubbleScreenCoords: () => null,
    dispose() {},
  };
}

export function createHeadlessEngine({ frameMs = 1000 / 60, onRunEnd, onStateChange } = {}) {
  const engine = Object.create(GameEngine.prototype);
  const atmosphereCalls = [];
  Object.assign(engine, {
    world: {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(53, 16 / 9, 0.1, 200),
      renderer: { render() {}, setSize() {} },
      applyAtmosphere: (_theme, stageNumber) => atmosphereCalls.push(stageNumber),
      setLowEffectsMode() {},
    },
    clock: { start() {}, getDelta: () => frameMs / 1000 },
    playerEntity: stubRig(),
    pursuerEntity: stubRig(),
    laneIndex: 1,
    targetX: 0,
    currentX: 0,
    objects: [],
    pickupAnimations: [],
    upcomingCardLane: null,
    running: false,
    paused: false,
    onRunEnd,
    onStateChange,
    onFrameTick: null,
  });
  engine.frame = engine.frame.bind(engine);
  return { engine, atmosphereCalls };
}

export function runFrames(engine, { maxFrames, onFrame } = {}) {
  let frames = 0;
  while (engine.running && frames < maxFrames) {
    engine.frame();
    frames += 1;
    onFrame?.(engine, frames);
  }
  return frames;
}
