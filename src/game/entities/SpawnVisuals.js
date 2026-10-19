import * as THREE from 'three';
import { addBoxOutline, addHullOutline } from '../utils/outline.js';

/**
 * 1. Blocker Crate (Must Dodge)
 * Dark timber frame, diagonal iron cross-braces, glowing crimson studs, and black cartoon outlines.
 */
export function createBlockerCrate() {
  const group = new THREE.Group();

  const timberMat = new THREE.MeshStandardMaterial({
    color: '#3a2012',
    roughness: 0.85,
    metalness: 0.1,
  });
  const ironBraceMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.6,
    metalness: 0.5,
  });
  const redStudMat = new THREE.MeshStandardMaterial({
    color: '#E94462',
    emissive: '#E94462',
    emissiveIntensity: 2.2,
  });

  // Inner crate box
  const crateBody = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.35, 1.1), timberMat);
  addBoxOutline(crateBody);
  group.add(crateBody);

  // Exterior iron framing (edges)
  const edgeH = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.14, 1.16), ironBraceMat);
  edgeH.position.y = 0.65;
  addBoxOutline(edgeH);
  group.add(edgeH);

  const edgeBottom = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.14, 1.16), ironBraceMat);
  edgeBottom.position.y = -0.65;
  addBoxOutline(edgeBottom);
  group.add(edgeBottom);

  // Diagonal warning braces on front face
  const cross1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.05), ironBraceMat);
  cross1.rotation.z = 0.72;
  cross1.position.z = 0.56;
  group.add(cross1);

  const cross2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.05), ironBraceMat);
  cross2.rotation.z = -0.72;
  cross2.position.z = 0.56;
  group.add(cross2);

  // Glowing crimson warning corner studs
  [
    [-0.55, 0.58], [0.55, 0.58],
    [-0.55, -0.58], [0.55, -0.58],
  ].forEach(([x, y]) => {
    const stud = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), redStudMat);
    stud.position.set(x, y, 0.58);
    group.add(stud);
  });

  return group;
}

/**
 * 2. Shadow Wave (Jumpable at Y = 0.18)
 * Low ground-hugging arc of dark purple/black voxel spikes with bold cartoon outlines and glowing cyan/magenta baseline.
 */
export function createShadowWave() {
  const group = new THREE.Group();

  const spikeMat = new THREE.MeshStandardMaterial({
    color: '#1a0b22',
    roughness: 0.4,
    flatShading: true,
  });
  const glowLineMat = new THREE.MeshStandardMaterial({
    color: '#E94462',
    emissive: '#E94462',
    emissiveIntensity: 2.5,
  });
  const cyanEdgeMat = new THREE.MeshStandardMaterial({
    color: '#43D9F2',
    emissive: '#43D9F2',
    emissiveIntensity: 2.0,
  });

  // Glowing neon baseline
  const baseLine = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.22), glowLineMat);
  baseLine.position.y = 0.04;
  addBoxOutline(baseLine);
  group.add(baseLine);

  const topGlow = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.06), cyanEdgeMat);
  topGlow.position.y = 0.10;
  group.add(topGlow);

  // Jagged low voxel spikes
  const spikePositions = [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];
  spikePositions.forEach((sx, i) => {
    const spikeH = 0.32 + Math.sin(i * 1.2) * 0.14;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.18, spikeH, 4), spikeMat);
    spike.position.set(sx, spikeH / 2, 0);
    spike.rotation.y = Math.PI / 4;
    addHullOutline(spike, 1.12);
    group.add(spike);
  });

  return group;
}

/**
 * 3. Swaying Specter (Drifting Hazard)
 * Floating ghostly lantern-wraith with glowing purple/crimson core and black cartoon contours.
 */
export function createSwayingSpecter() {
  const group = new THREE.Group();

  const shroudMat = new THREE.MeshStandardMaterial({
    color: '#1e102d',
    roughness: 0.6,
    flatShading: true,
  });
  const coreMat = new THREE.MeshStandardMaterial({
    color: '#B843F2',
    emissive: '#B843F2',
    emissiveIntensity: 2.8,
    roughness: 0.2,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: '#FF1E42',
    emissive: '#FF1E42',
    emissiveIntensity: 3.5,
  });

  // Glowing core
  const core = new THREE.Mesh(new THREE.DodecahedronGeometry(0.48, 0), coreMat);
  addHullOutline(core, 1.08);
  group.add(core);

  // Ghostly hooded shroud
  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.85, 6), shroudMat);
  hood.position.y = 0.22;
  addHullOutline(hood, 1.08);
  group.add(hood);

  // Piercing glowing eyes
  [-0.14, 0.14].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), eyeMat);
    eye.position.set(ex, 0.05, 0.44);
    group.add(eye);
  });

  // Tattered shroud tails
  for (let t = 0; t < 5; t++) {
    const angle = (t / 5) * Math.PI * 2;
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.55, 3), shroudMat);
    tail.position.set(Math.cos(angle) * 0.35, -0.45, Math.sin(angle) * 0.35);
    tail.rotation.x = Math.PI;
    addHullOutline(tail, 1.12);
    group.add(tail);
  }

  return group;
}

/**
 * 4. Double Blockade Gate (2-Lane Hazard)
 * Carnival ticket barricade with black cartoon outlines and flashing warning beacons.
 */
export function createDoubleBlockadeSingle(laneIndex, openLane) {
  const group = new THREE.Group();

  const barrierMat = new THREE.MeshStandardMaterial({
    color: '#991b1b',
    roughness: 0.5,
  });
  const frameMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.7,
    metalness: 0.4,
  });
  const warningLightMat = new THREE.MeshStandardMaterial({
    color: '#E94462',
    emissive: '#E94462',
    emissiveIntensity: 2.4,
  });
  const stripeWhiteMat = new THREE.MeshStandardMaterial({ color: '#f8fafc' });

  // Main gate barrier
  const mainGate = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.4, 0.3), barrierMat);
  mainGate.position.y = 0.7;
  addBoxOutline(mainGate);
  group.add(mainGate);

  // Chevron hazard stripes
  [-0.35, 0, 0.35].forEach((cx) => {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.42, 0.32), stripeWhiteMat);
    stripe.position.set(cx, 0.7, 0);
    group.add(stripe);
  });

  // Gate side poles
  [-0.72, 0.72].forEach((px) => {
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.85, 0.36), frameMat);
    pole.position.set(px, 0.92, 0);
    addBoxOutline(pole);
    group.add(pole);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), warningLightMat);
    bulb.position.set(px, 1.95, 0);
    addHullOutline(bulb, 1.15);
    group.add(bulb);
  });

  return group;
}

/**
 * 5. Rift Shard (+1 Shard)
 * Faceted cyan crystal cluster with rotating pixel halo ring and cartoon ink edges.
 */
export function createRiftShard() {
  const group = new THREE.Group();

  const crystalMat = new THREE.MeshStandardMaterial({
    color: '#43D9F2',
    emissive: '#43D9F2',
    emissiveIntensity: 1.8,
    roughness: 0.15,
    metalness: 0.2,
  });
  const haloMat = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#38bdf8',
    emissiveIntensity: 2.2,
  });

  const mainCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), crystalMat);
  mainCrystal.scale.set(1.0, 1.6, 1.0);
  addHullOutline(mainCrystal, 1.08);
  group.add(mainCrystal);

  [-0.22, 0.22].forEach((sx) => {
    const sub = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), crystalMat);
    sub.position.set(sx, -0.15, 0);
    sub.scale.set(0.8, 1.2, 0.8);
    sub.rotation.z = sx > 0 ? -0.35 : 0.35;
    addHullOutline(sub, 1.1);
    group.add(sub);
  });

  const haloRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.04, 6, 16), haloMat);
  haloRing.rotation.x = Math.PI / 2;
  haloRing.position.y = -0.35;
  group.add(haloRing);
  group.userData.haloRing = haloRing;

  return group;
}

/**
 * 6. Amber Orb (+3 Shards)
 * Bright golden star-core with counter-rotating voxel ring and cartoon edges.
 */
export function createAmberOrb() {
  const group = new THREE.Group();

  const starMat = new THREE.MeshStandardMaterial({
    color: '#FFD000',
    emissive: '#FFD000',
    emissiveIntensity: 2.2,
    roughness: 0.1,
  });
  const ringMat = new THREE.MeshStandardMaterial({
    color: '#F7C56B',
    emissive: '#F7C56B',
    emissiveIntensity: 1.6,
  });

  const starCore = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), starMat);
  addHullOutline(starCore, 1.12);
  group.add(starCore);

  for (let a = 0; a < 6; a++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 4), starMat);
    const angle = (a / 6) * Math.PI * 2;
    spike.position.set(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0);
    spike.rotation.z = angle - Math.PI / 2;
    addHullOutline(spike, 1.12);
    group.add(spike);
  }

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.05, 8, 20), ringMat);
  outerRing.rotation.x = Math.PI / 3;
  group.add(outerRing);
  group.userData.outerRing = outerRing;

  return group;
}

/**
 * 7. Card Fragment (+1 Card Fragment)
 * 3D miniature holographic trading card slab with black cartoon border.
 */
export function createCardFragment() {
  const group = new THREE.Group();

  const slabMat = new THREE.MeshStandardMaterial({
    color: '#1a1f36',
    roughness: 0.2,
    metalness: 0.6,
  });
  const goldBorderMat = new THREE.MeshStandardMaterial({
    color: '#FFD000',
    emissive: '#FFD000',
    emissiveIntensity: 2.0,
  });
  const emblemMat = new THREE.MeshStandardMaterial({
    color: '#43D9F2',
    emissive: '#43D9F2',
    emissiveIntensity: 2.5,
  });
  const sparkleMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    emissive: '#ffffff',
    emissiveIntensity: 3.0,
  });

  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.95, 0.08), slabMat);
  addBoxOutline(slab);
  group.add(slab);

  const borderTop = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.10), goldBorderMat);
  borderTop.position.y = 0.48;
  addBoxOutline(borderTop);
  group.add(borderTop);

  const borderBottom = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.10), goldBorderMat);
  borderBottom.position.y = -0.48;
  addBoxOutline(borderBottom);
  group.add(borderBottom);

  const borderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.95, 0.10), goldBorderMat);
  borderLeft.position.set(-0.35, 0, 0);
  addBoxOutline(borderLeft);
  group.add(borderLeft);

  const borderRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.95, 0.10), goldBorderMat);
  borderRight.position.set(0.35, 0, 0);
  addBoxOutline(borderRight);
  group.add(borderRight);

  const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 12), emblemMat);
  emblem.rotation.x = Math.PI / 2;
  group.add(emblem);

  const sparkles = [];
  for (let s = 0; s < 3; s++) {
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), sparkleMat);
    addBoxOutline(sp);
    group.add(sp);
    sparkles.push({ mesh: sp, offset: (s / 3) * Math.PI * 2 });
  }
  group.userData.sparkles = sparkles;

  return group;
}
