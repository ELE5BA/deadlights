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
    // --- STAGE 1: Twilight Mist (Trevenant & Vine Whip) ---
    trevStump: tagShared(new THREE.CylinderGeometry(0.55, 0.65, 1.3, 8)),
    trevKnotEye: tagShared(new THREE.BoxGeometry(0.24, 0.14, 0.12)),
    trevHorn: tagShared(new THREE.ConeGeometry(0.18, 0.65, 5)),
    trevVineWrap: tagShared(new THREE.TorusGeometry(0.62, 0.08, 6, 12)),
    vineRootBase: tagShared(new THREE.BoxGeometry(2.4, 0.1, 0.3)),
    vineThornSpike: tagShared(new THREE.ConeGeometry(0.16, 0.42, 5)),
    vineSporeOrb: tagShared(new THREE.SphereGeometry(0.1, 6, 6)),

    // --- STAGE 2: Amber Hollow (Litwick, Will-O-Wisp, Drifloon) ---
    litwickBase: tagShared(new THREE.CylinderGeometry(0.6, 0.68, 0.25, 8)),
    litwickWaxPillar: tagShared(new THREE.CylinderGeometry(0.48, 0.52, 1.1, 8)),
    litwickMeltDrip: tagShared(new THREE.ConeGeometry(0.12, 0.35, 5)),
    litwickFlame: tagShared(new THREE.ConeGeometry(0.22, 0.55, 6)),
    litwickEye: tagShared(new THREE.BoxGeometry(0.08, 0.04, 0.05)),
    wispFlameArc: tagShared(new THREE.BoxGeometry(2.4, 0.08, 0.2)),
    wispFlameCore: tagShared(new THREE.SphereGeometry(0.18, 6, 6)),
    drifloonBody: tagShared(new THREE.SphereGeometry(0.52, 8, 8)),
    drifloonCloud: tagShared(new THREE.SphereGeometry(0.26, 6, 6)),
    drifloonCrossH: tagShared(new THREE.BoxGeometry(0.22, 0.06, 0.04)),
    drifloonCrossV: tagShared(new THREE.BoxGeometry(0.06, 0.22, 0.04)),
    drifloonFoot: tagShared(new THREE.BoxGeometry(0.14, 0.14, 0.08)),

    // --- STAGE 3: Crimson Mire (Voltorb, Electro-Ball, Haunter, Magneton) ---
    voltorbSphere: tagShared(new THREE.SphereGeometry(0.65, 10, 8)),
    voltorbEye: tagShared(new THREE.BoxGeometry(0.22, 0.06, 0.06)),
    voltorbElectrode: tagShared(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 6)),
    electroRail: tagShared(new THREE.BoxGeometry(2.4, 0.12, 0.22)),
    electroSpark: tagShared(new THREE.OctahedronGeometry(0.18, 0)),
    haunterHead: tagShared(new THREE.DodecahedronGeometry(0.55, 0)),
    haunterSpike: tagShared(new THREE.ConeGeometry(0.16, 0.45, 4)),
    haunterClaw: tagShared(new THREE.BoxGeometry(0.18, 0.32, 0.1)),
    haunterEye: tagShared(new THREE.ConeGeometry(0.12, 0.25, 4)),
    magnetonGateFrame: tagShared(new THREE.BoxGeometry(1.45, 1.4, 0.3)),
    magnetonMagnet: tagShared(new THREE.TorusGeometry(0.26, 0.08, 6, 12, Math.PI)),
    magnetonPole: tagShared(new THREE.BoxGeometry(0.18, 1.85, 0.36)),
    magnetonBulb: tagShared(new THREE.SphereGeometry(0.16, 6, 6)),

    // --- STAGE 4: Glitch Rift (MissingNo/Porygon, Psywave, Mimikyu, Mr. Mime) ---
    glitchCubeLarge: tagShared(new THREE.BoxGeometry(0.9, 0.9, 0.9)),
    glitchCubeMed: tagShared(new THREE.BoxGeometry(0.5, 0.5, 0.5)),
    glitchCubeSmall: tagShared(new THREE.BoxGeometry(0.3, 0.3, 0.3)),
    glitchUnownRing: tagShared(new THREE.TorusGeometry(0.25, 0.06, 6, 12)),
    psywaveRippleBar: tagShared(new THREE.BoxGeometry(2.4, 0.08, 0.2)),
    psywavePrism: tagShared(new THREE.OctahedronGeometry(0.25, 0)),
    mimikyuBody: tagShared(new THREE.ConeGeometry(0.5, 1.1, 7)),
    mimikyuEarBent: tagShared(new THREE.BoxGeometry(0.12, 0.55, 0.12)),
    mimikyuZipper: tagShared(new THREE.BoxGeometry(0.35, 0.06, 0.06)),
    mrmimeBarrierFrame: tagShared(new THREE.BoxGeometry(1.45, 1.45, 0.18)),
    mrmimeHexCore: tagShared(new THREE.CylinderGeometry(0.45, 0.45, 0.12, 6)),

    // --- STAGE 5: Abyssal Void (Cofagrigus, Klinklang, Duskull, Aegislash) ---
    cofaCoffin: tagShared(new THREE.BoxGeometry(1.1, 1.5, 0.6)),
    cofaHeadpiece: tagShared(new THREE.BoxGeometry(1.25, 0.45, 0.68)),
    cofaEye: tagShared(new THREE.BoxGeometry(0.2, 0.08, 0.08)),
    cofaShadowArm: tagShared(new THREE.BoxGeometry(0.16, 0.6, 0.16)),
    gearSaw: tagShared(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 8)),
    duskullSkull: tagShared(new THREE.BoxGeometry(0.7, 0.8, 0.65)),
    duskullCyclopsEye: tagShared(new THREE.SphereGeometry(0.2, 8, 8)),
    aegiGateShield: tagShared(new THREE.BoxGeometry(1.4, 1.4, 0.22)),
    aegiSwordBlade: tagShared(new THREE.BoxGeometry(0.16, 1.7, 0.16)),

    // --- STAGE 6: Deadlights Core (Pennywise Jack-in-the-Box, Razor Maw, Deadlights Trio, Funhouse Guillotine) ---
    pennyBox: tagShared(new THREE.BoxGeometry(1.2, 1.0, 1.2)),
    pennySpring: tagShared(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 6)),
    pennyClownHead: tagShared(new THREE.SphereGeometry(0.38, 8, 8)),
    pennyNose: tagShared(new THREE.SphereGeometry(0.12, 6, 6)),
    pennyBalloon: tagShared(new THREE.SphereGeometry(0.3, 8, 8)),
    mawBase: tagShared(new THREE.BoxGeometry(2.4, 0.1, 0.3)),
    mawFang: tagShared(new THREE.ConeGeometry(0.14, 0.45, 4)),
    deadlightsOrb: tagShared(new THREE.SphereGeometry(0.22, 8, 8)),
    georgieBoat: tagShared(new THREE.ConeGeometry(0.28, 0.5, 3)),
    guillotinePost: tagShared(new THREE.BoxGeometry(0.2, 2.1, 0.3)),
    guillotineBlade: tagShared(new THREE.BoxGeometry(1.2, 0.4, 0.08)),
    guillotineCross: tagShared(new THREE.BoxGeometry(1.45, 0.2, 0.3)),

    // Generic / Fallback Crate & Wave
    crateBody: tagShared(new THREE.BoxGeometry(1.25, 1.35, 1.1)),
    crateEdgeH: tagShared(new THREE.BoxGeometry(1.32, 0.14, 1.16)),
    crateCross: tagShared(new THREE.BoxGeometry(1.5, 0.12, 0.05)),
    crateStud: tagShared(new THREE.BoxGeometry(0.14, 0.14, 0.14)),
    waveBaseLine: tagShared(new THREE.BoxGeometry(2.4, 0.08, 0.22)),
    waveTopGlow: tagShared(new THREE.BoxGeometry(2.4, 0.04, 0.06)),
    waveSpikes: [0.32, 0.44, 0.36, 0.48, 0.36, 0.44, 0.32].map((h) =>
      tagShared(new THREE.ConeGeometry(0.18, h, 4))
    ),
    specterCore: tagShared(new THREE.DodecahedronGeometry(0.48, 0)),
    specterHood: tagShared(new THREE.ConeGeometry(0.58, 0.85, 6)),
    specterEye: tagShared(new THREE.BoxGeometry(0.08, 0.08, 0.08)),
    specterTail: tagShared(new THREE.ConeGeometry(0.12, 0.55, 3)),
    gateBody: tagShared(new THREE.BoxGeometry(1.45, 1.4, 0.3)),
    gateStripe: tagShared(new THREE.BoxGeometry(0.15, 1.42, 0.32)),
    gatePole: tagShared(new THREE.BoxGeometry(0.16, 1.85, 0.36)),
    gateBulb: tagShared(new THREE.SphereGeometry(0.14, 6, 6)),

    // Pickups
    crystalMain: tagShared(new THREE.OctahedronGeometry(0.38, 0)),
    crystalSub: tagShared(new THREE.OctahedronGeometry(0.22, 0)),
    shardHalo: tagShared(new THREE.TorusGeometry(0.52, 0.04, 6, 16)),
    starCore: tagShared(new THREE.SphereGeometry(0.32, 8, 8)),
    starSpike: tagShared(new THREE.ConeGeometry(0.12, 0.35, 4)),
    orbRing: tagShared(new THREE.TorusGeometry(0.64, 0.05, 6, 16)),
    cardSlab: tagShared(new THREE.BoxGeometry(0.68, 0.95, 0.08)),
    cardBorderTB: tagShared(new THREE.BoxGeometry(0.72, 0.08, 0.10)),
    cardBorderLR: tagShared(new THREE.BoxGeometry(0.08, 0.95, 0.10)),
    cardEmblem: tagShared(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 8)),
    cardSparkle: tagShared(new THREE.BoxGeometry(0.08, 0.08, 0.08)),
  },

  materials: {
    // --- STAGE MATERIALS ---
    // Stage 1: Trevenant & Vines
    trevBark: tagShared(new THREE.MeshStandardMaterial({ color: '#27190d', roughness: 0.9, flatShading: true })),
    trevFoliage: tagShared(new THREE.MeshStandardMaterial({ color: '#14532d', roughness: 0.8, flatShading: true })),
    trevRedEye: tagShared(new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 3.0 })),
    vineGreen: tagShared(new THREE.MeshStandardMaterial({ color: '#047857', roughness: 0.6, flatShading: true })),
    sporeCyan: tagShared(new THREE.MeshStandardMaterial({ color: '#06b6d4', emissive: '#06b6d4', emissiveIntensity: 2.8 })),

    // Stage 2: Litwick & Wisp & Drifloon
    litwickWax: tagShared(new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.3, flatShading: true })),
    litwickBaseMat: tagShared(new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.7, flatShading: true })),
    litwickFlameMat: tagShared(new THREE.MeshStandardMaterial({ color: '#c084fc', emissive: '#a855f7', emissiveIntensity: 3.0 })),
    wispAmberFlame: tagShared(new THREE.MeshStandardMaterial({ color: '#f59e0b', emissive: '#f59e0b', emissiveIntensity: 2.6 })),
    drifloonPurple: tagShared(new THREE.MeshStandardMaterial({ color: '#7e22ce', roughness: 0.4, flatShading: true })),
    drifloonCloudMat: tagShared(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, flatShading: true })),
    drifloonYellow: tagShared(new THREE.MeshStandardMaterial({ color: '#facc15', emissive: '#eab308', emissiveIntensity: 1.5 })),

    // Stage 3: Voltorb & Haunter & Magneton
    voltorbRed: tagShared(new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.3, flatShading: true })),
    voltorbWhite: tagShared(new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.3, flatShading: true })),
    brassMetal: tagShared(new THREE.MeshStandardMaterial({ color: '#b45309', metalness: 0.7, roughness: 0.3 })),
    lightningYellow: tagShared(new THREE.MeshStandardMaterial({ color: '#facc15', emissive: '#eab308', emissiveIntensity: 3.2 })),
    haunterGhost: tagShared(new THREE.MeshStandardMaterial({ color: '#4c1d95', roughness: 0.5, flatShading: true })),
    haunterEyeMat: tagShared(new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 3.0 })),
    magnetonSteel: tagShared(new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.6, roughness: 0.4 })),
    magnetonRed: tagShared(new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 2.2 })),

    // Stage 4: Glitch Rift
    glitchMagenta: tagShared(new THREE.MeshStandardMaterial({ color: '#d946ef', emissive: '#c026d3', emissiveIntensity: 1.8, flatShading: true })),
    glitchCyan: tagShared(new THREE.MeshStandardMaterial({ color: '#06b6d4', emissive: '#0891b2', emissiveIntensity: 1.8, flatShading: true })),
    glitchDark: tagShared(new THREE.MeshStandardMaterial({ color: '#18181b', flatShading: true })),
    mimikyuRag: tagShared(new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.9, flatShading: true })),
    mimikyuEarMat: tagShared(new THREE.MeshStandardMaterial({ color: '#18181b', flatShading: true })),
    psychicBarrierMat: tagShared(new THREE.MeshStandardMaterial({ color: '#f43f5e', emissive: '#e11d48', emissiveIntensity: 2.5, transparent: true, opacity: 0.85 })),

    // Stage 5: Abyssal Void
    goldPharaoh: tagShared(new THREE.MeshStandardMaterial({ color: '#eab308', metalness: 0.7, roughness: 0.3, flatShading: true })),
    obsidianMat: tagShared(new THREE.MeshStandardMaterial({ color: '#09090b', roughness: 0.6, flatShading: true })),
    shadowArmMat: tagShared(new THREE.MeshStandardMaterial({ color: '#020617', flatShading: true })),
    steelGearMat: tagShared(new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.6, roughness: 0.4 })),
    boneSkullMat: tagShared(new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.6, flatShading: true })),
    crimsonEyeGlow: tagShared(new THREE.MeshStandardMaterial({ color: '#dc2626', emissive: '#dc2626', emissiveIntensity: 3.5 })),
    shieldGold: tagShared(new THREE.MeshStandardMaterial({ color: '#ca8a04', metalness: 0.6, roughness: 0.3 })),

    // Stage 6: Deadlights Core
    carnivalRed: tagShared(new THREE.MeshStandardMaterial({ color: '#ef4444', flatShading: true })),
    carnivalWhite: tagShared(new THREE.MeshStandardMaterial({ color: '#ffffff', flatShading: true })),
    carnivalBlack: tagShared(new THREE.MeshStandardMaterial({ color: '#09090b', flatShading: true })),
    deadlightsAmberCore: tagShared(new THREE.MeshStandardMaterial({ color: '#ffaa00', emissive: '#ffaa00', emissiveIntensity: 3.5 })),
    porcelainWhite: tagShared(new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2, flatShading: true })),
    paperBoatWhite: tagShared(new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.9, flatShading: true })),

    // Generic / Fallback
    timber: tagShared(new THREE.MeshStandardMaterial({ color: '#3a2012', roughness: 0.85, metalness: 0.1, flatShading: true })),
    ironBrace: tagShared(new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.6, metalness: 0.5, flatShading: true })),
    redStud: tagShared(new THREE.MeshStandardMaterial({ color: '#E94462', emissive: '#E94462', emissiveIntensity: 2.2 })),
    waveSpike: tagShared(new THREE.MeshStandardMaterial({ color: '#1a0b22', roughness: 0.4, flatShading: true })),
    waveGlowLine: tagShared(new THREE.MeshStandardMaterial({ color: '#E94462', emissive: '#E94462', emissiveIntensity: 2.5 })),
    waveCyanEdge: tagShared(new THREE.MeshStandardMaterial({ color: '#43D9F2', emissive: '#43D9F2', emissiveIntensity: 2.0 })),
    specterShroud: tagShared(new THREE.MeshStandardMaterial({ color: '#1e102d', roughness: 0.6, flatShading: true })),
    specterCore: tagShared(new THREE.MeshStandardMaterial({ color: '#B843F2', emissive: '#B843F2', emissiveIntensity: 2.8, roughness: 0.2, flatShading: true })),
    specterEye: tagShared(new THREE.MeshStandardMaterial({ color: '#FF1E42', emissive: '#FF1E42', emissiveIntensity: 3.5 })),
    barrier: tagShared(new THREE.MeshStandardMaterial({ color: '#991b1b', roughness: 0.5, flatShading: true })),
    gateFrame: tagShared(new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.7, metalness: 0.4, flatShading: true })),
    gateWarningLight: tagShared(new THREE.MeshStandardMaterial({ color: '#E94462', emissive: '#E94462', emissiveIntensity: 2.4 })),
    gateStripeWhite: tagShared(new THREE.MeshStandardMaterial({ color: '#f8fafc', flatShading: true })),

    // Pickups
    crystal: tagShared(new THREE.MeshStandardMaterial({ color: '#43D9F2', emissive: '#43D9F2', emissiveIntensity: 1.8, roughness: 0.15, metalness: 0.2, flatShading: true })),
    shardHalo: tagShared(new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#38bdf8', emissiveIntensity: 2.2 })),
    star: tagShared(new THREE.MeshStandardMaterial({ color: '#FFD000', emissive: '#FFD000', emissiveIntensity: 2.2, roughness: 0.1, flatShading: true })),
    orbRing: tagShared(new THREE.MeshStandardMaterial({ color: '#F7C56B', emissive: '#F7C56B', emissiveIntensity: 1.6 })),
    cardSlab: tagShared(new THREE.MeshStandardMaterial({ color: '#1a1f36', roughness: 0.2, metalness: 0.6, flatShading: true })),
    goldBorder: tagShared(new THREE.MeshStandardMaterial({ color: '#FFD000', emissive: '#FFD000', emissiveIntensity: 2.0 })),
    cardEmblem: tagShared(new THREE.MeshStandardMaterial({ color: '#43D9F2', emissive: '#43D9F2', emissiveIntensity: 2.5, flatShading: true })),
    cardSparkle: tagShared(new THREE.MeshStandardMaterial({ color: '#f8fafc', emissive: '#ffffff', emissiveIntensity: 3.0 })),
  },
};

/**
 * 1. Blocker Crate (Must Dodge)
 * Stage-distinct Pokémon-inspired solid hazard.
 */
export function createBlockerCrate(stageNum = 1) {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  switch (stageNum) {
    case 1: {
      // Trevenant Cursed Tree Stump & Tangling Vines
      const stump = new THREE.Mesh(G.trevStump, M.trevBark);
      addHullOutline(stump, 1.08);
      group.add(stump);

      const knotEye = new THREE.Mesh(G.trevKnotEye, M.trevRedEye);
      knotEye.position.set(0, 0.15, 0.56);
      group.add(knotEye);

      [-0.45, 0.45].forEach((hx) => {
        const horn = new THREE.Mesh(G.trevHorn, M.trevBark);
        horn.position.set(hx, 0.75, 0);
        horn.rotation.z = hx > 0 ? -0.4 : 0.4;
        addHullOutline(horn, 1.1);
        group.add(horn);
      });

      const vine = new THREE.Mesh(G.trevVineWrap, M.vineGreen);
      vine.rotation.x = Math.PI / 2;
      vine.position.y = -0.2;
      group.add(vine);
      break;
    }

    case 2: {
      // Litwick Giant Wax Brazier
      const base = new THREE.Mesh(G.litwickBase, M.litwickBaseMat);
      base.position.y = -0.55;
      addHullOutline(base, 1.08);
      group.add(base);

      const wax = new THREE.Mesh(G.litwickWaxPillar, M.litwickWax);
      addHullOutline(wax, 1.08);
      group.add(wax);

      const drip = new THREE.Mesh(G.litwickMeltDrip, M.litwickWax);
      drip.position.set(0.38, 0.1, 0.38);
      drip.rotation.x = Math.PI;
      group.add(drip);

      const flame = new THREE.Mesh(G.litwickFlame, M.litwickFlameMat);
      flame.position.y = 0.85;
      addHullOutline(flame, 1.12);
      group.add(flame);

      [-0.16, 0.16].forEach((ex) => {
        const eye = new THREE.Mesh(G.litwickEye, M.obsidianMat);
        eye.position.set(ex, 0.15, 0.5);
        group.add(eye);
      });
      break;
    }

    case 3: {
      // Voltorb Carnival Shock-Sphere
      const orb = new THREE.Mesh(G.voltorbSphere, M.voltorbRed);
      addHullOutline(orb, 1.08);
      group.add(orb);

      // Lower white hemisphere
      const lowerHalf = new THREE.Mesh(G.voltorbSphere, M.voltorbWhite);
      lowerHalf.position.y = -0.15;
      lowerHalf.scale.set(0.98, 0.85, 0.98);
      group.add(lowerHalf);

      // Angry slanted eyes
      [-0.22, 0.22].forEach((ex) => {
        const eye = new THREE.Mesh(G.voltorbEye, M.obsidianMat);
        eye.position.set(ex, 0.18, 0.58);
        eye.rotation.z = ex > 0 ? 0.35 : -0.35;
        group.add(eye);
      });

      // Brass electrodes
      [-0.55, 0.55].forEach((bx) => {
        const elec = new THREE.Mesh(G.voltorbElectrode, M.brassMetal);
        elec.position.set(bx, 0.5, 0);
        elec.rotation.z = bx > 0 ? -0.5 : 0.5;
        addHullOutline(elec, 1.1);
        group.add(elec);
      });
      break;
    }

    case 4: {
      // MissingNo. / Porygon Glitch Obelisk
      const main = new THREE.Mesh(G.glitchCubeLarge, M.glitchMagenta);
      addBoxOutline(main);
      group.add(main);

      const topCube = new THREE.Mesh(G.glitchCubeMed, M.glitchCyan);
      topCube.position.set(0.2, 0.65, -0.1);
      addBoxOutline(topCube);
      group.add(topCube);

      const sideCube = new THREE.Mesh(G.glitchCubeSmall, M.glitchDark);
      sideCube.position.set(-0.45, -0.2, 0.25);
      addBoxOutline(sideCube);
      group.add(sideCube);

      const unownEye = new THREE.Mesh(G.glitchUnownRing, M.lightningYellow);
      unownEye.position.set(0, 0, 0.48);
      group.add(unownEye);
      break;
    }

    case 5: {
      // Cofagrigus Cursed Gold Sarcophagus
      const coffin = new THREE.Mesh(G.cofaCoffin, M.goldPharaoh);
      addBoxOutline(coffin);
      group.add(coffin);

      const headpiece = new THREE.Mesh(G.cofaHeadpiece, M.obsidianMat);
      headpiece.position.y = 0.55;
      addBoxOutline(headpiece);
      group.add(headpiece);

      [-0.25, 0.25].forEach((ex) => {
        const eye = new THREE.Mesh(G.cofaEye, M.crimsonEyeGlow);
        eye.position.set(ex, 0.4, 0.32);
        group.add(eye);
      });

      [-0.6, 0.6].forEach((ax) => {
        const arm = new THREE.Mesh(G.cofaShadowArm, M.shadowArmMat);
        arm.position.set(ax, 0.1, 0.2);
        arm.rotation.z = ax > 0 ? -0.45 : 0.45;
        addBoxOutline(arm);
        group.add(arm);
      });
      break;
    }

    case 6:
    default: {
      // Pennywise Jack-in-the-Box Monster Crate
      const box = new THREE.Mesh(G.pennyBox, M.carnivalRed);
      addBoxOutline(box);
      group.add(box);

      const spring = new THREE.Mesh(G.pennySpring, M.steelGearMat);
      spring.position.y = 0.65;
      group.add(spring);

      const clownHead = new THREE.Mesh(G.pennyClownHead, M.porcelainWhite);
      clownHead.position.y = 1.05;
      addHullOutline(clownHead, 1.08);
      group.add(clownHead);

      const nose = new THREE.Mesh(G.pennyNose, M.carnivalRed);
      nose.position.set(0, 1.05, 0.38);
      group.add(nose);

      // Tethered red balloon floating above
      const balloon = new THREE.Mesh(G.pennyBalloon, M.carnivalRed);
      balloon.position.set(0.4, 1.65, 0);
      addHullOutline(balloon, 1.1);
      group.add(balloon);
      break;
    }
  }

  return group;
}

/**
 * 2. Shadow Wave (Jumpable at Y = 0.18)
 * Low ground-hugging stage-distinct Pokémon hazard.
 */
export function createShadowWave(stageNum = 1) {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  switch (stageNum) {
    case 1: {
      // Vine Whip Thorny Root Surge (Emerald vines + cyan spores)
      const baseLine = new THREE.Mesh(G.vineRootBase, M.trevBark);
      baseLine.position.y = 0.05;
      addBoxOutline(baseLine);
      group.add(baseLine);

      const thornPositions = [-0.85, -0.5, -0.15, 0.2, 0.55, 0.85];
      thornPositions.forEach((tx) => {
        const spike = new THREE.Mesh(G.vineThornSpike, M.vineGreen);
        spike.position.set(tx, 0.21, 0);
        addHullOutline(spike, 1.12);
        group.add(spike);

        const spore = new THREE.Mesh(G.vineSporeOrb, M.sporeCyan);
        spore.position.set(tx, 0.42, 0);
        group.add(spore);
      });
      break;
    }

    case 2: {
      // Will-O-Wisp Soul Fire Arc (Violet & amber spirit flames)
      const baseLine = new THREE.Mesh(G.wispFlameArc, M.wispAmberFlame);
      baseLine.position.y = 0.04;
      addBoxOutline(baseLine);
      group.add(baseLine);

      [-0.8, -0.4, 0, 0.4, 0.8].forEach((wx, i) => {
        const flame = new THREE.Mesh(G.litwickFlame, i % 2 === 0 ? M.litwickFlameMat : M.wispAmberFlame);
        flame.position.set(wx, 0.26, 0);
        flame.scale.set(0.8, 0.9, 0.8);
        addHullOutline(flame, 1.12);
        group.add(flame);
      });
      break;
    }

    case 3: {
      // Electro-Ball Rail Surge (Crackling yellow/crimson lightning)
      const rail = new THREE.Mesh(G.electroRail, M.voltorbRed);
      rail.position.y = 0.06;
      addBoxOutline(rail);
      group.add(rail);

      [-0.8, -0.3, 0.2, 0.7].forEach((sx) => {
        const spark = new THREE.Mesh(G.electroSpark, M.lightningYellow);
        spark.position.set(sx, 0.24, 0);
        spark.rotation.z = Math.PI / 4;
        addHullOutline(spark, 1.15);
        group.add(spark);
      });
      break;
    }

    case 4: {
      // Psywave Crystal Ripple (Prism spikes)
      const bar = new THREE.Mesh(G.psywaveRippleBar, M.glitchMagenta);
      bar.position.y = 0.04;
      addBoxOutline(bar);
      group.add(bar);

      [-0.85, -0.4, 0.05, 0.5, 0.85].forEach((px, i) => {
        const prism = new THREE.Mesh(G.psywavePrism, i % 2 === 0 ? M.glitchCyan : M.glitchMagenta);
        prism.position.set(px, 0.22, 0);
        addHullOutline(prism, 1.12);
        group.add(prism);
      });
      break;
    }

    case 5: {
      // Klinklang Spinning Gear Trap (Row of interlocking saw-gears)
      const bar = new THREE.Mesh(G.waveBaseLine, M.obsidianMat);
      bar.position.y = 0.04;
      addBoxOutline(bar);
      group.add(bar);

      [-0.8, -0.4, 0, 0.4, 0.8].forEach((gx) => {
        const gear = new THREE.Mesh(G.gearSaw, M.steelGearMat);
        gear.position.set(gx, 0.2, 0);
        gear.rotation.x = Math.PI / 2;
        addHullOutline(gear, 1.1);
        group.add(gear);
      });
      break;
    }

    case 6:
    default: {
      // Deadlights Razor-Teeth Maw (Snapping porcelain clown fangs & blazing orange energy)
      const mawBar = new THREE.Mesh(G.mawBase, M.carnivalBlack);
      mawBar.position.y = 0.05;
      addBoxOutline(mawBar);
      group.add(mawBar);

      const glowLine = new THREE.Mesh(G.waveTopGlow, M.deadlightsAmberCore);
      glowLine.position.y = 0.1;
      group.add(glowLine);

      [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9].forEach((fx) => {
        const fang = new THREE.Mesh(G.mawFang, M.porcelainWhite);
        fang.position.set(fx, 0.22, 0);
        addHullOutline(fang, 1.12);
        group.add(fang);
      });
      break;
    }
  }

  return group;
}

/**
 * 3. Swaying Specter (Drifting Hazard)
 * Stage-distinct drifting Pokémon entity.
 */
export function createSwayingSpecter(stageNum = 2) {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  switch (stageNum) {
    case 2: {
      // Drifloon Ghost-Balloon Hazard (Purple body, white cloud, yellow X, heart feet)
      const body = new THREE.Mesh(G.drifloonBody, M.drifloonPurple);
      addHullOutline(body, 1.08);
      group.add(body);

      const cloud = new THREE.Mesh(G.drifloonCloud, M.drifloonCloudMat);
      cloud.position.y = 0.52;
      group.add(cloud);

      const crossH = new THREE.Mesh(G.drifloonCrossH, M.drifloonYellow);
      crossH.position.set(0, 0, 0.52);
      group.add(crossH);

      const crossV = new THREE.Mesh(G.drifloonCrossV, M.drifloonYellow);
      crossV.position.set(0, 0, 0.52);
      group.add(crossV);

      [-0.2, 0.2].forEach((fx) => {
        const foot = new THREE.Mesh(G.drifloonFoot, M.drifloonYellow);
        foot.position.set(fx, -0.7, 0);
        foot.rotation.z = Math.PI / 4;
        group.add(foot);
      });
      break;
    }

    case 3: {
      // Haunter Floating Phantom (Jagged purple ghost head, glowing red eyes, disembodied claws)
      const head = new THREE.Mesh(G.haunterHead, M.haunterGhost);
      addHullOutline(head, 1.08);
      group.add(head);

      [-0.45, 0.45].forEach((sx) => {
        const spike = new THREE.Mesh(G.haunterSpike, M.haunterGhost);
        spike.position.set(sx, 0.35, 0);
        spike.rotation.z = sx > 0 ? -0.6 : 0.6;
        group.add(spike);
      });

      [-0.18, 0.18].forEach((ex) => {
        const eye = new THREE.Mesh(G.haunterEye, M.haunterEyeMat);
        eye.position.set(ex, 0.1, 0.48);
        eye.rotation.x = Math.PI / 2;
        group.add(eye);
      });

      [-0.65, 0.65].forEach((cx) => {
        const claw = new THREE.Mesh(G.haunterClaw, M.haunterGhost);
        claw.position.set(cx, -0.2, 0.3);
        addBoxOutline(claw);
        group.add(claw);
      });
      break;
    }

    case 4: {
      // Mimikyu / Banette Cursed Doll (Ragdoll silhouette, golden zipper mouth, crooked ears)
      const body = new THREE.Mesh(G.mimikyuBody, M.mimikyuRag);
      addHullOutline(body, 1.08);
      group.add(body);

      const ear1 = new THREE.Mesh(G.mimikyuEarBent, M.mimikyuEarMat);
      ear1.position.set(-0.25, 0.75, 0);
      ear1.rotation.z = 0.3;
      addBoxOutline(ear1);
      group.add(ear1);

      const ear2 = new THREE.Mesh(G.mimikyuEarBent, M.mimikyuEarMat);
      ear2.position.set(0.25, 0.65, 0);
      ear2.rotation.z = -0.55;
      addBoxOutline(ear2);
      group.add(ear2);

      const zip = new THREE.Mesh(G.mimikyuZipper, M.lightningYellow);
      zip.position.set(0, -0.15, 0.4);
      group.add(zip);

      [-0.12, 0.12].forEach((ex) => {
        const eye = new THREE.Mesh(G.specterEye, M.specterCore);
        eye.position.set(ex, -0.32, 0.42);
        group.add(eye);
      });
      break;
    }

    case 5: {
      // Duskull Crimson Cyclops Skull (Bone skull mask with roving crimson eye)
      const skull = new THREE.Mesh(G.duskullSkull, M.boneSkullMat);
      addBoxOutline(skull);
      group.add(skull);

      const eye = new THREE.Mesh(G.duskullCyclopsEye, M.crimsonEyeGlow);
      eye.position.set(0, 0, 0.35);
      group.add(eye);
      break;
    }

    case 6:
    default: {
      // Deadlights Trio Cluster & Georgie Paper Boat
      const mask = new THREE.Mesh(G.pennyClownHead, M.porcelainWhite);
      addHullOutline(mask, 1.08);
      group.add(mask);

      // 3 glowing Deadlights orbs
      [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].forEach((angle) => {
        const orb = new THREE.Mesh(G.deadlightsOrb, M.deadlightsAmberCore);
        orb.position.set(Math.cos(angle) * 0.65, Math.sin(angle) * 0.65, 0);
        group.add(orb);
      });

      // Georgie paper boat
      const boat = new THREE.Mesh(G.georgieBoat, M.paperBoatWhite);
      boat.position.set(0, -0.65, 0.2);
      boat.rotation.x = Math.PI / 2;
      group.add(boat);
      break;
    }
  }

  return group;
}

/**
 * 4. Double Blockade Gate (2-Lane Hazard)
 * Stage-distinct 2-lane barrier.
 */
export function createDoubleBlockadeSingle(laneIndex, openLane, stageNum = 3) {
  const group = new THREE.Group();
  const { geometries: G, materials: M } = SHARED_ASSETS;

  switch (stageNum) {
    case 3: {
      // Magneton Twin Tesla Gates (Shock-barriers with spinning U-magnets & warning bulbs)
      const gate = new THREE.Mesh(G.magnetonGateFrame, M.magnetonSteel);
      gate.position.y = 0.7;
      addBoxOutline(gate);
      group.add(gate);

      [-0.72, 0.72].forEach((px) => {
        const pole = new THREE.Mesh(G.magnetonPole, M.magnetonSteel);
        pole.position.set(px, 0.92, 0);
        addBoxOutline(pole);
        group.add(pole);

        const magnet = new THREE.Mesh(G.magnetonMagnet, M.magnetonRed);
        magnet.position.set(px, 1.9, 0);
        magnet.rotation.z = Math.PI;
        group.add(magnet);
      });
      break;
    }

    case 4: {
      // Mr. Mime Psychic Barrier Wall (Hexagonal glowing forcefield frames)
      const frame = new THREE.Mesh(G.mrmimeBarrierFrame, M.psychicBarrierMat);
      frame.position.y = 0.75;
      addBoxOutline(frame);
      group.add(frame);

      const hex = new THREE.Mesh(G.mrmimeHexCore, M.psychicBarrierMat);
      hex.position.set(0, 0.75, 0);
      hex.rotation.x = Math.PI / 2;
      group.add(hex);
      break;
    }

    case 5: {
      // Aegislash Twin Royal Shield Gates (Iron and gold shield barricades)
      const shield = new THREE.Mesh(G.aegiGateShield, M.shieldGold);
      shield.position.y = 0.72;
      addBoxOutline(shield);
      group.add(shield);

      const blade = new THREE.Mesh(G.aegiSwordBlade, M.steelGearMat);
      blade.position.set(0, 0.85, 0.12);
      addBoxOutline(blade);
      group.add(blade);
      break;
    }

    case 6:
    default: {
      // Funhouse Nightmare Guillotine Gates (Towering crimson/black striped carnival gates)
      const gate = new THREE.Mesh(G.gateBody, M.carnivalRed);
      gate.position.y = 0.7;
      addBoxOutline(gate);
      group.add(gate);

      [-0.35, 0, 0.35].forEach((cx) => {
        const stripe = new THREE.Mesh(G.gateStripe, M.carnivalBlack);
        stripe.position.set(cx, 0.7, 0);
        group.add(stripe);
      });

      [-0.72, 0.72].forEach((px) => {
        const post = new THREE.Mesh(G.guillotinePost, M.carnivalBlack);
        post.position.set(px, 1.05, 0);
        addBoxOutline(post);
        group.add(post);

        const bulb = new THREE.Mesh(G.gateBulb, M.deadlightsAmberCore);
        bulb.position.set(px, 2.15, 0);
        addHullOutline(bulb, 1.15);
        group.add(bulb);
      });
      break;
    }
  }

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
