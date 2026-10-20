import * as THREE from 'three';
import { addBoxOutline, addHullOutline } from '../utils/outline.js';

// Helper to flag GPU assets as shared singleton cache
function tagShared(resource) {
  resource.userData = resource.userData || {};
  resource.userData.shared = true;
  return resource;
}

/**
 * Singleton GPU Asset Cache (Zero-GC across entire run).
 * Initialized once at module load; never re-allocated or disposed mid-frame.
 */
export const SHARED_ASSETS = {
  geometries: {
    // Blocker Crate
    crateBody: tagShared(new THREE.BoxGeometry(1.25, 1.35, 1.1)),
    crateEdgeH: tagShared(new THREE.BoxGeometry(1.32, 0.14, 1.16)),
    crateCross: tagShared(new THREE.BoxGeometry(1.5, 0.12, 0.05)),
    crateStud: tagShared(new THREE.BoxGeometry(0.14, 0.14, 0.14)),

    // Shadow Wave
    waveBaseLine: tagShared(new THREE.BoxGeometry(2.4, 0.08, 0.22)),
    waveTopGlow: tagShared(new THREE.BoxGeometry(2.4, 0.04, 0.06)),
    waveSpikes: [0.32, 0.44, 0.36, 0.48, 0.36, 0.44, 0.32].map((h) =>
      tagShared(new THREE.ConeGeometry(0.18, h, 4))
    ),

    // Swaying Specter
    specterCore: tagShared(new THREE.DodecahedronGeometry(0.48, 0)),
    specterHood: tagShared(new THREE.ConeGeometry(0.58, 0.85, 6)),
    specterEye: tagShared(new THREE.BoxGeometry(0.08, 0.08, 0.08)),
    specterTail: tagShared(new THREE.ConeGeometry(0.12, 0.55, 3)),

    // Double Blockade
    gateBody: tagShared(new THREE.BoxGeometry(1.45, 1.4, 0.3)),
    gateStripe: tagShared(new THREE.BoxGeometry(0.15, 1.42, 0.32)),
    gatePole: tagShared(new THREE.BoxGeometry(0.16, 1.85, 0.36)),
    gateBulb: tagShared(new THREE.SphereGeometry(0.14, 6, 6)),

    // Rift Shard
    crystalMain: tagShared(new THREE.OctahedronGeometry(0.38, 0)),
    crystalSub: tagShared(new THREE.OctahedronGeometry(0.22, 0)),
    shardHalo: tagShared(new THREE.TorusGeometry(0.52, 0.04, 6, 16)),

    // Amber Orb
    starCore: tagShared(new THREE.SphereGeometry(0.32, 8, 8)),
    starSpike: tagShared(new THREE.ConeGeometry(0.12, 0.35, 4)),
    orbRing: tagShared(new THREE.TorusGeometry(0.64, 0.05, 6, 16)),

    // Card Fragment
    cardSlab: tagShared(new THREE.BoxGeometry(0.68, 0.95, 0.08)),
    cardBorderTB: tagShared(new THREE.BoxGeometry(0.72, 0.08, 0.10)),
    cardBorderLR: tagShared(new THREE.BoxGeometry(0.08, 0.95, 0.10)),
    cardEmblem: tagShared(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 8)),
    cardSparkle: tagShared(new THREE.BoxGeometry(0.08, 0.08, 0.08)),
  },

  materials: {
    // Blocker Crate
    timber: tagShared(new THREE.MeshStandardMaterial({
      color: '#3a2012',
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    })),
    ironBrace: tagShared(new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.6,
      metalness: 0.5,
      flatShading: true,
    })),
    redStud: tagShared(new THREE.MeshStandardMaterial({
      color: '#E94462',
      emissive: '#E94462',
      emissiveIntensity: 2.2,
    })),

    // Shadow Wave
    waveSpike: tagShared(new THREE.MeshStandardMaterial({
      color: '#1a0b22',
      roughness: 0.4,
      flatShading: true,
    })),
    waveGlowLine: tagShared(new THREE.MeshStandardMaterial({
      color: '#E94462',
      emissive: '#E94462',
      emissiveIntensity: 2.5,
    })),
    waveCyanEdge: tagShared(new THREE.MeshStandardMaterial({
      color: '#43D9F2',
      emissive: '#43D9F2',
      emissiveIntensity: 2.0,
    })),

    // Swaying Specter
    specterShroud: tagShared(new THREE.MeshStandardMaterial({
      color: '#1e102d',
      roughness: 0.6,
      flatShading: true,
    })),
    specterCore: tagShared(new THREE.MeshStandardMaterial({
      color: '#B843F2',
      emissive: '#B843F2',
      emissiveIntensity: 2.8,
      roughness: 0.2,
      flatShading: true,
    })),
    specterEye: tagShared(new THREE.MeshStandardMaterial({
      color: '#FF1E42',
      emissive: '#FF1E42',
      emissiveIntensity: 3.5,
    })),

    // Double Blockade
    barrier: tagShared(new THREE.MeshStandardMaterial({
      color: '#991b1b',
      roughness: 0.5,
      flatShading: true,
    })),
    gateFrame: tagShared(new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.7,
      metalness: 0.4,
      flatShading: true,
    })),
    gateWarningLight: tagShared(new THREE.MeshStandardMaterial({
      color: '#E94462',
      emissive: '#E94462',
      emissiveIntensity: 2.4,
    })),
    gateStripeWhite: tagShared(new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      flatShading: true,
    })),

    // Pickups
    crystal: tagShared(new THREE.MeshStandardMaterial({
      color: '#43D9F2',
      emissive: '#43D9F2',
      emissiveIntensity: 1.8,
      roughness: 0.15,
      metalness: 0.2,
      flatShading: true,
    })),
    shardHalo: tagShared(new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: '#38bdf8',
      emissiveIntensity: 2.2,
    })),
    star: tagShared(new THREE.MeshStandardMaterial({
      color: '#FFD000',
      emissive: '#FFD000',
      emissiveIntensity: 2.2,
      roughness: 0.1,
      flatShading: true,
    })),
    orbRing: tagShared(new THREE.MeshStandardMaterial({
      color: '#F7C56B',
      emissive: '#F7C56B',
      emissiveIntensity: 1.6,
    })),
    cardSlab: tagShared(new THREE.MeshStandardMaterial({
      color: '#1a1f36',
      roughness: 0.2,
      metalness: 0.6,
      flatShading: true,
    })),
    goldBorder: tagShared(new THREE.MeshStandardMaterial({
      color: '#FFD000',
      emissive: '#FFD000',
      emissiveIntensity: 2.0,
    })),
    cardEmblem: tagShared(new THREE.MeshStandardMaterial({
      color: '#43D9F2',
      emissive: '#43D9F2',
      emissiveIntensity: 2.5,
      flatShading: true,
    })),
    cardSparkle: tagShared(new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      emissive: '#ffffff',
      emissiveIntensity: 3.0,
    })),
  },
};

/**
 * 1. Blocker Crate (Must Dodge)
 * Dark timber frame, diagonal iron cross-braces, glowing crimson studs, and occult outlines.
 */
export function createBlockerCrate() {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  // Inner crate body
  const crateBody = new THREE.Mesh(G.crateBody, M.timber);
  addBoxOutline(crateBody);
  group.add(crateBody);

  // Exterior iron framing
  const edgeH = new THREE.Mesh(G.crateEdgeH, M.ironBrace);
  edgeH.position.y = 0.65;
  addBoxOutline(edgeH);
  group.add(edgeH);

  const edgeBottom = new THREE.Mesh(G.crateEdgeH, M.ironBrace);
  edgeBottom.position.y = -0.65;
  addBoxOutline(edgeBottom);
  group.add(edgeBottom);

  // Diagonal warning braces
  const cross1 = new THREE.Mesh(G.crateCross, M.ironBrace);
  cross1.rotation.z = 0.72;
  cross1.position.z = 0.56;
  group.add(cross1);

  const cross2 = new THREE.Mesh(G.crateCross, M.ironBrace);
  cross2.rotation.z = -0.72;
  cross2.position.z = 0.56;
  group.add(cross2);

  // Glowing crimson warning corner studs
  [
    [-0.55, 0.58], [0.55, 0.58],
    [-0.55, -0.58], [0.55, -0.58],
  ].forEach(([x, y]) => {
    const stud = new THREE.Mesh(G.crateStud, M.redStud);
    stud.position.set(x, y, 0.58);
    group.add(stud);
  });

  return group;
}

/**
 * 2. Shadow Wave (Jumpable at Y = 0.18)
 * Low ground-hugging arc of dark purple/black voxel spikes with occult contours and glowing baseline.
 */
export function createShadowWave() {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  // Glowing neon baseline
  const baseLine = new THREE.Mesh(G.waveBaseLine, M.waveGlowLine);
  baseLine.position.y = 0.04;
  addBoxOutline(baseLine);
  group.add(baseLine);

  const topGlow = new THREE.Mesh(G.waveTopGlow, M.waveCyanEdge);
  topGlow.position.y = 0.10;
  group.add(topGlow);

  // Jagged low voxel spikes
  const spikeX = [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];
  const heights = [0.32, 0.44, 0.36, 0.48, 0.36, 0.44, 0.32];
  spikeX.forEach((sx, i) => {
    const spikeGeo = G.waveSpikes[i];
    const spikeH = heights[i];
    const spike = new THREE.Mesh(spikeGeo, M.waveSpike);
    spike.position.set(sx, spikeH / 2, 0);
    spike.rotation.y = Math.PI / 4;
    addHullOutline(spike, 1.12);
    group.add(spike);
  });

  return group;
}

/**
 * 3. Swaying Specter (Drifting Hazard)
 * Floating ghostly lantern-wraith with glowing purple/crimson core and occult contours.
 */
export function createSwayingSpecter() {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  // Glowing core
  const core = new THREE.Mesh(G.specterCore, M.specterCore);
  addHullOutline(core, 1.08);
  group.add(core);

  // Ghostly hooded shroud
  const hood = new THREE.Mesh(G.specterHood, M.specterShroud);
  hood.position.y = 0.22;
  addHullOutline(hood, 1.08);
  group.add(hood);

  // Piercing glowing eyes
  [-0.14, 0.14].forEach((ex) => {
    const eye = new THREE.Mesh(G.specterEye, M.specterEye);
    eye.position.set(ex, 0.05, 0.44);
    group.add(eye);
  });

  // Tattered shroud tails
  for (let t = 0; t < 5; t++) {
    const angle = (t / 5) * Math.PI * 2;
    const tail = new THREE.Mesh(G.specterTail, M.specterShroud);
    tail.position.set(Math.cos(angle) * 0.35, -0.45, Math.sin(angle) * 0.35);
    tail.rotation.x = Math.PI;
    addHullOutline(tail, 1.12);
    group.add(tail);
  }

  return group;
}

/**
 * 4. Double Blockade Gate (2-Lane Hazard)
 * Carnival ticket barricade with occult outlines and flashing warning beacons.
 */
export function createDoubleBlockadeSingle(laneIndex, openLane) {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  // Main gate barrier
  const mainGate = new THREE.Mesh(G.gateBody, M.barrier);
  mainGate.position.y = 0.7;
  addBoxOutline(mainGate);
  group.add(mainGate);

  // Chevron hazard stripes
  [-0.35, 0, 0.35].forEach((cx) => {
    const stripe = new THREE.Mesh(G.gateStripe, M.gateStripeWhite);
    stripe.position.set(cx, 0.7, 0);
    group.add(stripe);
  });

  // Gate side poles & warning bulbs
  [-0.72, 0.72].forEach((px) => {
    const pole = new THREE.Mesh(G.gatePole, M.gateFrame);
    pole.position.set(px, 0.92, 0);
    addBoxOutline(pole);
    group.add(pole);

    const bulb = new THREE.Mesh(G.gateBulb, M.gateWarningLight);
    bulb.position.set(px, 1.95, 0);
    addHullOutline(bulb, 1.15);
    group.add(bulb);
  });

  return group;
}

/**
 * 5. Rift Shard (+1 Shard)
 * Faceted cyan crystal cluster with rotating pixel halo ring and occult ink edges.
 */
export function createRiftShard() {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  const mainCrystal = new THREE.Mesh(G.crystalMain, M.crystal);
  mainCrystal.scale.set(1.0, 1.6, 1.0);
  addHullOutline(mainCrystal, 1.08);
  group.add(mainCrystal);

  [-0.22, 0.22].forEach((sx) => {
    const sub = new THREE.Mesh(G.crystalSub, M.crystal);
    sub.position.set(sx, -0.15, 0);
    sub.scale.set(0.8, 1.2, 0.8);
    sub.rotation.z = sx > 0 ? -0.35 : 0.35;
    addHullOutline(sub, 1.1);
    group.add(sub);
  });

  const haloRing = new THREE.Mesh(G.shardHalo, M.shardHalo);
  haloRing.rotation.x = Math.PI / 2;
  haloRing.position.y = -0.35;
  group.add(haloRing);
  group.userData.haloRing = haloRing;

  return group;
}

/**
 * 6. Amber Orb (+3 Shards)
 * Bright golden star-core with counter-rotating voxel ring and occult edges.
 */
export function createAmberOrb() {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  const starCore = new THREE.Mesh(G.starCore, M.star);
  addHullOutline(starCore, 1.12);
  group.add(starCore);

  for (let a = 0; a < 6; a++) {
    const spike = new THREE.Mesh(G.starSpike, M.star);
    const angle = (a / 6) * Math.PI * 2;
    spike.position.set(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0);
    spike.rotation.z = angle - Math.PI / 2;
    addHullOutline(spike, 1.12);
    group.add(spike);
  }

  const outerRing = new THREE.Mesh(G.orbRing, M.orbRing);
  outerRing.rotation.x = Math.PI / 3;
  group.add(outerRing);
  group.userData.outerRing = outerRing;

  return group;
}

/**
 * 7. Card Fragment (+1 Card Fragment)
 * 3D miniature holographic trading card slab with occult ink border and orbiting sparkles.
 */
export function createCardFragment() {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  const slab = new THREE.Mesh(G.cardSlab, M.cardSlab);
  addBoxOutline(slab);
  group.add(slab);

  const borderTop = new THREE.Mesh(G.cardBorderTB, M.goldBorder);
  borderTop.position.y = 0.48;
  addBoxOutline(borderTop);
  group.add(borderTop);

  const borderBottom = new THREE.Mesh(G.cardBorderTB, M.goldBorder);
  borderBottom.position.y = -0.48;
  addBoxOutline(borderBottom);
  group.add(borderBottom);

  const borderLeft = new THREE.Mesh(G.cardBorderLR, M.goldBorder);
  borderLeft.position.set(-0.35, 0, 0);
  addBoxOutline(borderLeft);
  group.add(borderLeft);

  const borderRight = new THREE.Mesh(G.cardBorderLR, M.goldBorder);
  borderRight.position.set(0.35, 0, 0);
  addBoxOutline(borderRight);
  group.add(borderRight);

  const emblem = new THREE.Mesh(G.cardEmblem, M.cardEmblem);
  emblem.rotation.x = Math.PI / 2;
  group.add(emblem);

  const sparkles = [];
  for (let s = 0; s < 3; s++) {
    const sp = new THREE.Mesh(G.cardSparkle, M.cardSparkle);
    addBoxOutline(sp);
    group.add(sp);
    sparkles.push({ mesh: sp, offset: (s / 3) * Math.PI * 2 });
  }
  group.userData.sparkles = sparkles;

  return group;
}
