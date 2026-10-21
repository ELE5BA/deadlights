import * as THREE from 'three';
import { createPixelTexture } from '../createScene.js';
import { addBoxOutline, addHullOutline } from '../utils/outline.js';

export const RUNNER_ROSTER = Object.freeze([
  {
    id: 'pika-georgie',
    name: 'Georgie-Chu',
    title: 'Raincoat Spark Cub',
    color: '#FFD000',
    accentColor: '#ef4444',
    badge: 'ELECTRIC',
    desc: 'Bright raincoat with spark cheeks & Pikachu ears',
  },
  {
    id: 'mimikyu-kid',
    name: 'Mimi-Rag',
    title: 'Cursed Disguise Runner',
    color: '#EAB308',
    accentColor: '#8b5cf6',
    badge: 'DISGUISE',
    desc: 'Burlap poncho, bent ragdoll ear & wooden tail',
  },
  {
    id: 'gengar-hood',
    name: 'Spook-Gar',
    title: 'Shadow Prankster',
    color: '#7E22CE',
    accentColor: '#ff1e42',
    badge: 'SHADOW',
    desc: 'Spiked purple hoodie, dorsal spines & fanged grin',
  },
  {
    id: 'litwick-runner',
    name: 'Wick-Kid',
    title: 'Soul-Candle Sprinter',
    color: '#F8FAFC',
    accentColor: '#06b6d4',
    badge: 'SPIRIT',
    desc: 'Melted-wax poncho, glowing soul flame & lantern boots',
  },
]);

/**
 * Creates pixel-art face texture tailored to each runner.
 */
function createPlayerFaceTexture(runnerId) {
  return createPixelTexture((ctx, w, h) => {
    if (runnerId === 'mimikyu-kid') {
      // Dark hollow cavity inside hood
      ctx.fillStyle = '#090510';
      ctx.fillRect(0, 0, w, h);
      // Glowing violet eyes inside dark shadow
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(28, 48, 22, 10);
      ctx.fillRect(78, 48, 22, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(36, 50, 8, 6);
      ctx.fillRect(86, 50, 8, 6);
      return;
    }

    if (runnerId === 'gengar-hood') {
      // Deep amethyst purple skin
      ctx.fillStyle = '#581c87';
      ctx.fillRect(0, 0, w, h);

      // Slanted glowing red Gengar eyes
      ctx.fillStyle = '#ff1e42';
      ctx.fillRect(24, 32, 28, 26);
      ctx.fillRect(76, 32, 28, 26);
      ctx.fillStyle = '#0f020a';
      ctx.fillRect(34, 38, 10, 16);
      ctx.fillRect(84, 38, 10, 16);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(32, 34, 6, 6);
      ctx.fillRect(82, 34, 6, 6);

      // Wide mischievous toothy grin
      ctx.fillStyle = '#1e0520';
      ctx.fillRect(30, 72, 68, 32);
      ctx.fillStyle = '#f8fafc';
      // Upper fangs
      for (let x = 32; x < 96; x += 12) {
        ctx.fillRect(x, 72, 8, 10);
      }
      // Lower fangs
      for (let x = 38; x < 90; x += 12) {
        ctx.fillRect(x, 94, 8, 10);
      }
      return;
    }

    if (runnerId === 'litwick-runner') {
      // Porcelain ghostly white
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, w, h);

      // Sleepy gold-and-violet spirit eyes
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(26, 42, 26, 16);
      ctx.fillRect(76, 42, 26, 16);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(30, 46, 18, 10);
      ctx.fillRect(80, 46, 18, 10);
      ctx.fillStyle = '#0f0814';
      ctx.fillRect(36, 48, 8, 8);
      ctx.fillRect(86, 48, 8, 8);

      // Cute tiny mouth
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(60, 84, 8, 6);
      return;
    }

    // Default 'pika-georgie': Warm peach skin, big expressive eyes, red spark cheeks
    ctx.fillStyle = '#fce2cd';
    ctx.fillRect(0, 0, w, h);

    // Brow shade
    ctx.fillStyle = '#f3cbb0';
    ctx.fillRect(16, 24, 96, 8);

    // Left Eye
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(24, 36, 28, 36);
    ctx.fillStyle = '#3a2012';
    ctx.fillRect(32, 40, 20, 30);
    ctx.fillStyle = '#0f0804';
    ctx.fillRect(36, 44, 14, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(32, 40, 10, 10);
    ctx.fillRect(44, 56, 6, 6);

    // Right Eye
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(76, 36, 28, 36);
    ctx.fillStyle = '#3a2012';
    ctx.fillRect(76, 40, 20, 30);
    ctx.fillStyle = '#0f0804';
    ctx.fillRect(78, 44, 14, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(78, 40, 10, 10);
    ctx.fillRect(86, 56, 6, 6);

    // Bright Pikachu Red Cheek Patches
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(12, 70, 28, 20);
    ctx.fillRect(88, 70, 28, 20);

    // Muzzle & Scared Mouth
    ctx.fillStyle = '#d97757';
    ctx.fillRect(60, 72, 8, 6);
    ctx.fillStyle = '#6b1212';
    ctx.fillRect(52, 86, 24, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(56, 86, 16, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(58, 98, 12, 6);
  }, 128, 128);
}

/**
 * Creates fabric texture tailored to each runner.
 */
function createRunnerFabricTexture(runnerId) {
  return createPixelTexture((ctx, w, h) => {
    if (runnerId === 'mimikyu-kid') {
      // Pale-gold burlap texture with dark twill threads
      ctx.fillStyle = '#eab308';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(113, 63, 18, 0.22)';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }
      for (let x = 0; x < w; x += 3) {
        ctx.fillRect(x, 0, 1, h);
      }
      return;
    }

    if (runnerId === 'gengar-hood') {
      // Amethyst purple textured hoodie
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(59, 7, 100, 0.25)';
      for (let y = 0; y < h; y += 2) {
        ctx.fillRect(0, y, w, 1);
      }
      return;
    }

    if (runnerId === 'litwick-runner') {
      // Ghostly porcelain wax
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(203, 213, 225, 0.35)';
      for (let x = 0; x < w; x += 4) {
        ctx.fillRect(x, 0, 2, h);
      }
      return;
    }

    // Default 'pika-georgie': Raincoat Yellow with twill
    ctx.fillStyle = '#ffd000';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        if ((x + y) % 4 === 0) {
          ctx.fillStyle = 'rgba(255, 240, 120, 0.28)';
          ctx.fillRect(x, y, 1, 1);
        } else if ((x - y) % 4 === 0) {
          ctx.fillStyle = 'rgba(217, 160, 0, 0.22)';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, 64, 64);
}

export class PlayerCharacter {
  constructor(runnerId = 'pika-georgie') {
    this.root = new THREE.Group();
    this.runnerId = runnerId;
    this.runTime = 0;
    this.tiltZ = 0;
    this.disposables = [];

    this.wasJumping = false;
    this.landingTimer = 0;
    this.earGroups = [];
    this.bedroll = null;
    this.tailMesh = null;
    this.flameMesh = null;

    this.buildCharacterRig();
  }

  trackDisposable(item) {
    if (item) this.disposables.push(item);
    return item;
  }

  setRunnerType(runnerId) {
    if (this.runnerId === runnerId && this.root.children.length > 0) return;
    this.runnerId = runnerId;
    this.dispose();
    this.disposables = [];
    this.earGroups = [];
    this.bedroll = null;
    this.tailMesh = null;
    this.flameMesh = null;

    while (this.root.children.length > 0) {
      this.root.remove(this.root.children[0]);
    }
    this.buildCharacterRig();
  }

  buildCharacterRig() {
    const runner = RUNNER_ROSTER.find((r) => r.id === this.runnerId) || RUNNER_ROSTER[0];
    const isPika = this.runnerId === 'pika-georgie';
    const isMimi = this.runnerId === 'mimikyu-kid';
    const isGengar = this.runnerId === 'gengar-hood';
    const isLitwick = this.runnerId === 'litwick-runner';

    // Runner Color Configuration
    let mainColor = '#FFD000';
    let trimColor = '#E09F00';
    let bootColor = '#FFD000';
    let shortsColor = '#1e3a8a';

    if (isMimi) {
      mainColor = '#EAB308';
      trimColor = '#CA8A04';
      bootColor = '#713F12';
      shortsColor = '#854D0E';
    } else if (isGengar) {
      mainColor = '#7E22CE';
      trimColor = '#581C87';
      bootColor = '#EF4444'; // Neon-crimson sneakers
      shortsColor = '#3B0764';
    } else if (isLitwick) {
      mainColor = '#F8FAFC';
      trimColor = '#CBD5E1';
      bootColor = '#1E293B'; // Dark iron lantern boots
      shortsColor = '#475569';
    }

    // Textures
    const coatTex = this.trackDisposable(createRunnerFabricTexture(this.runnerId));
    coatTex.wrapS = THREE.RepeatWrapping;
    coatTex.wrapT = THREE.RepeatWrapping;
    coatTex.repeat.set(2, 2);

    const faceTex = this.trackDisposable(createPlayerFaceTexture(this.runnerId));

    // Materials
    const coatMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      map: coatTex,
      color: mainColor,
      emissive: isGengar ? 0x2e0854 : (isLitwick ? 0x1e293b : 0x332200),
      emissiveIntensity: 0.25,
      roughness: 0.5,
      flatShading: true,
    }));

    const coatTrimMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: trimColor,
      roughness: 0.6,
      flatShading: true,
    }));

    const faceMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.55,
      flatShading: true,
    }));

    const bootMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: bootColor,
      roughness: 0.5,
      flatShading: true,
    }));

    const bootSoleMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.8,
      flatShading: true,
    }));

    const shortsMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: shortsColor,
      roughness: 0.75,
      flatShading: true,
    }));

    const handMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: isGengar ? '#9333ea' : (isLitwick ? '#cbd5e1' : '#f0d2b6'),
      roughness: 0.7,
      flatShading: true,
    }));

    // ── TORSO GROUP ───────────────────────────────────────────────
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 1.05;
    this.torsoGroup.rotation.x = -0.12;

    // Main Body
    const bodyGeo = this.trackDisposable(new THREE.CylinderGeometry(0.44, 0.52, 0.85, 8));
    const bodyMesh = new THREE.Mesh(bodyGeo, coatMat);
    addHullOutline(bodyMesh, 1.08);
    this.torsoGroup.add(bodyMesh);

    // Hem
    const hemGeo = this.trackDisposable(new THREE.CylinderGeometry(0.52, 0.58, 0.25, 8));
    const hemMesh = new THREE.Mesh(hemGeo, coatTrimMat);
    hemMesh.position.y = -0.42;
    addHullOutline(hemMesh, 1.08);
    this.torsoGroup.add(hemMesh);

    // Runner-specific Torso Details
    if (isPika) {
      // Leather Backpack + sleeping bag + cyan shard
      const packMat = this.trackDisposable(new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.75, flatShading: true }));
      const strapMat = this.trackDisposable(new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.8 }));
      const packMain = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.66, 0.74, 0.38)), packMat);
      packMain.position.set(0, 0.04, 0.44);
      addBoxOutline(packMain);
      this.torsoGroup.add(packMain);

      this.bedroll = new THREE.Mesh(this.trackDisposable(new THREE.CylinderGeometry(0.12, 0.12, 0.68, 6)), coatTrimMat);
      this.bedroll.rotation.z = Math.PI / 2;
      this.bedroll.position.set(0, 0.48, 0.44);
      addHullOutline(this.bedroll, 1.08);
      this.torsoGroup.add(this.bedroll);

      const shardClipMat = this.trackDisposable(new THREE.MeshStandardMaterial({ color: '#43D9F2', emissive: '#43D9F2', emissiveIntensity: 2.2, roughness: 0.1 }));
      const miniShard = new THREE.Mesh(this.trackDisposable(new THREE.OctahedronGeometry(0.14, 0)), shardClipMat);
      miniShard.position.set(0.24, -0.15, 0.68);
      this.torsoGroup.add(miniShard);
    } else if (isMimi) {
      // Jagged wooden lightning-bolt tail sticking out the back!
      const tailMat = this.trackDisposable(new THREE.MeshStandardMaterial({ color: '#854d0e', roughness: 0.9, flatShading: true }));
      this.tailMesh = new THREE.Group();
      this.tailMesh.position.set(0, -0.2, 0.5);

      const seg1 = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.12, 0.45, 0.08)), tailMat);
      seg1.position.set(0, 0.2, 0.1);
      seg1.rotation.x = 0.4;
      this.tailMesh.add(seg1);

      const seg2 = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.12, 0.35, 0.08)), tailMat);
      seg2.position.set(0, 0.45, 0.22);
      seg2.rotation.x = -0.3;
      this.tailMesh.add(seg2);

      const seg3 = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.18, 0.45, 0.08)), tailMat);
      seg3.position.set(0, 0.72, 0.32);
      seg3.rotation.x = 0.3;
      this.tailMesh.add(seg3);

      addHullOutline(seg3, 1.1);
      this.torsoGroup.add(this.tailMesh);
    } else if (isGengar) {
      // 3 Dorsal spines down the back
      const spineMat = this.trackDisposable(new THREE.MeshStandardMaterial({ color: '#581c87', roughness: 0.6, flatShading: true }));
      [0.35, 0.05, -0.25].forEach((sy) => {
        const spine = new THREE.Mesh(this.trackDisposable(new THREE.ConeGeometry(0.15, 0.42, 4)), spineMat);
        spine.position.set(0, sy, 0.52);
        spine.rotation.x = Math.PI / 2 + 0.2;
        addHullOutline(spine, 1.1);
        this.torsoGroup.add(spine);
      });
    } else if (isLitwick) {
      // Sculpted wax drips along hem
      const dripMat = this.trackDisposable(new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.3, flatShading: true }));
      [-0.32, -0.10, 0.15, 0.35].forEach((dx) => {
        const drip = new THREE.Mesh(this.trackDisposable(new THREE.ConeGeometry(0.08, 0.28, 5)), dripMat);
        drip.position.set(dx, -0.56, 0.45);
        drip.rotation.x = Math.PI;
        this.torsoGroup.add(drip);
      });
    }

    this.root.add(this.torsoGroup);

    // ── HEAD & HOOD ───────────────────────────────────────────────
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.85, 0.02);

    // Outer Hood Dome
    const hoodDomeGeo = this.trackDisposable(new THREE.SphereGeometry(0.56, 8, 8));
    const hoodDome = new THREE.Mesh(hoodDomeGeo, coatMat);
    hoodDome.scale.set(1.0, 1.08, 1.0);
    addHullOutline(hoodDome, 1.07);
    this.headGroup.add(hoodDome);

    // Hood Rim
    const hoodRimGeo = this.trackDisposable(new THREE.TorusGeometry(0.48, 0.08, 6, 12));
    const hoodRim = new THREE.Mesh(hoodRimGeo, coatTrimMat);
    hoodRim.position.set(0, 0, -0.28);
    hoodRim.rotation.x = -0.15;
    addHullOutline(hoodRim, 1.08);
    this.headGroup.add(hoodRim);

    // Inner Head with Face
    const innerHeadGeo = this.trackDisposable(new THREE.BoxGeometry(0.72, 0.72, 0.72));
    const innerHeadMats = [coatMat, coatMat, coatMat, coatMat, coatMat, faceMat];
    const innerHead = new THREE.Mesh(innerHeadGeo, innerHeadMats);
    innerHead.position.set(0, 0, -0.06);
    this.headGroup.add(innerHead);

    // Runner-specific Head / Ear features
    this.earGroups = [];

    if (isPika) {
      // Pikachu Pointed Cone Ears with Black Tips
      const earBlackMat = this.trackDisposable(new THREE.MeshStandardMaterial({ color: '#120b1d', roughness: 0.6, flatShading: true }));
      [-0.32, 0.32].forEach((earX) => {
        const earGroup = new THREE.Group();
        earGroup.position.set(earX, 0.55, -0.04);

        const earBase = new THREE.Mesh(this.trackDisposable(new THREE.ConeGeometry(0.16, 0.48, 5)), coatMat);
        earBase.rotation.y = Math.PI / 4;
        addHullOutline(earBase, 1.12);
        earGroup.add(earBase);

        const earTip = new THREE.Mesh(this.trackDisposable(new THREE.ConeGeometry(0.10, 0.22, 5)), earBlackMat);
        earTip.position.y = 0.32;
        earTip.rotation.y = Math.PI / 4;
        addHullOutline(earTip, 1.1);
        earGroup.add(earTip);

        earGroup.rotation.z = earX > 0 ? -0.35 : 0.35;
        earGroup.rotation.x = -0.18;
        this.headGroup.add(earGroup);
        this.earGroups.push({ group: earGroup, baseRotX: -0.18 });
      });
    } else if (isMimi) {
      // Two tall black-tipped ragdoll ears on hood - right ear bent 45 degrees!
      const earTipMat = this.trackDisposable(new THREE.MeshStandardMaterial({ color: '#120b1d', roughness: 0.8, flatShading: true }));

      // Left Ear (Tall & Slightly Cocked)
      const earL = new THREE.Group();
      earL.position.set(-0.28, 0.55, 0);
      const earLMesh = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.14, 0.65, 0.12)), coatMat);
      earLMesh.position.y = 0.3;
      addHullOutline(earLMesh, 1.1);
      earL.add(earLMesh);
      const earLTip = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.15, 0.25, 0.13)), earTipMat);
      earLTip.position.y = 0.68;
      earL.add(earLTip);
      earL.rotation.z = 0.18;
      earL.rotation.x = -0.15;
      this.headGroup.add(earL);
      this.earGroups.push({ group: earL, baseRotX: -0.15 });

      // Right Ear (Bent at 45 degrees!)
      const earR = new THREE.Group();
      earR.position.set(0.28, 0.55, 0);
      const earRLower = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.14, 0.38, 0.12)), coatMat);
      earRLower.position.y = 0.18;
      addHullOutline(earRLower, 1.1);
      earR.add(earRLower);

      const earRUpper = new THREE.Group();
      earRUpper.position.set(0.06, 0.36, 0);
      earRUpper.rotation.z = -0.78; // 45-degree hard bend!
      const earRUpperMesh = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.14, 0.42, 0.12)), coatMat);
      earRUpperMesh.position.y = 0.2;
      addHullOutline(earRUpperMesh, 1.1);
      earRUpper.add(earRUpperMesh);
      const earRTip = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.15, 0.22, 0.13)), earTipMat);
      earRTip.position.y = 0.42;
      earRUpper.add(earRTip);
      earR.add(earRUpper);

      earR.rotation.x = -0.15;
      this.headGroup.add(earR);
      this.earGroups.push({ group: earR, baseRotX: -0.15 });

      // Scribbled Crayon Decoy Face on Hood Front
      const crayonMat = this.trackDisposable(new THREE.MeshBasicMaterial({ color: '#120b1d' }));
      [-0.14, 0.14].forEach((cx) => {
        const cEye = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.08, 0.08, 0.04)), crayonMat);
        cEye.position.set(cx, 0.15, -0.56);
        this.headGroup.add(cEye);
      });
      const cSmile = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.26, 0.04, 0.04)), crayonMat);
      cSmile.position.set(0, 0.02, -0.56);
      this.headGroup.add(cSmile);
    } else if (isGengar) {
      // Pointed Gengar Cone Ears
      [-0.34, 0.34].forEach((earX) => {
        const earGroup = new THREE.Group();
        earGroup.position.set(earX, 0.52, -0.04);
        const earMesh = new THREE.Mesh(this.trackDisposable(new THREE.ConeGeometry(0.20, 0.55, 4)), coatMat);
        earMesh.rotation.y = Math.PI / 4;
        addHullOutline(earMesh, 1.12);
        earGroup.add(earMesh);

        earGroup.rotation.z = earX > 0 ? -0.42 : 0.42;
        earGroup.rotation.x = -0.15;
        this.headGroup.add(earGroup);
        this.earGroups.push({ group: earGroup, baseRotX: -0.15 });
      });
    } else if (isLitwick) {
      // Glowing purple-and-cyan Soul Flame atop hood!
      const flameMat = this.trackDisposable(new THREE.MeshStandardMaterial({
        color: '#c084fc',
        emissive: '#06b6d4',
        emissiveIntensity: 3.5,
        roughness: 0.2,
      }));
      this.flameMesh = new THREE.Mesh(this.trackDisposable(new THREE.ConeGeometry(0.18, 0.55, 6)), flameMat);
      this.flameMesh.position.set(0, 0.78, -0.05);
      addHullOutline(this.flameMesh, 1.15);
      this.headGroup.add(this.flameMesh);
    }

    this.torsoGroup.add(this.headGroup);

    // ── ARMS ──────────────────────────────────────────────────────
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-0.56, 0.34, 0);

    const shoulderL = new THREE.Mesh(this.trackDisposable(new THREE.SphereGeometry(0.18, 6, 6)), coatMat);
    addHullOutline(shoulderL, 1.08);
    this.leftArmPivot.add(shoulderL);

    const sleeveGeo = this.trackDisposable(new THREE.CylinderGeometry(0.14, 0.17, 0.65, 6));
    const leftSleeve = new THREE.Mesh(sleeveGeo, coatMat);
    leftSleeve.position.y = -0.30;
    addHullOutline(leftSleeve, 1.08);
    this.leftArmPivot.add(leftSleeve);

    const pawGeo = this.trackDisposable(new THREE.SphereGeometry(0.13, 6, 6));
    const leftHand = new THREE.Mesh(pawGeo, handMat);
    leftHand.position.y = -0.72;
    addHullOutline(leftHand, 1.1);
    this.leftArmPivot.add(leftHand);
    this.torsoGroup.add(this.leftArmPivot);

    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(0.56, 0.34, 0);

    const shoulderR = new THREE.Mesh(this.trackDisposable(new THREE.SphereGeometry(0.18, 6, 6)), coatMat);
    addHullOutline(shoulderR, 1.08);
    this.rightArmPivot.add(shoulderR);

    const rightSleeve = new THREE.Mesh(sleeveGeo, coatMat);
    rightSleeve.position.y = -0.30;
    addHullOutline(rightSleeve, 1.08);
    this.rightArmPivot.add(rightSleeve);

    const rightHand = new THREE.Mesh(pawGeo, handMat);
    rightHand.position.y = -0.72;
    addHullOutline(rightHand, 1.1);
    this.rightArmPivot.add(rightHand);
    this.torsoGroup.add(this.rightArmPivot);

    // ── LEGS ──────────────────────────────────────────────────────
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(-0.24, -0.48, 0);

    const shortsGeo = this.trackDisposable(new THREE.CylinderGeometry(0.16, 0.17, 0.38, 6));
    const leftShorts = new THREE.Mesh(shortsGeo, shortsMat);
    leftShorts.position.y = -0.19;
    addHullOutline(leftShorts, 1.08);
    this.leftLegPivot.add(leftShorts);

    const bootShaftGeo = this.trackDisposable(new THREE.CylinderGeometry(0.17, 0.18, 0.38, 6));
    const leftBootShaft = new THREE.Mesh(bootShaftGeo, bootMat);
    leftBootShaft.position.set(0, -0.46, 0);
    addHullOutline(leftBootShaft, 1.08);
    this.leftLegPivot.add(leftBootShaft);

    const bootToeGeo = this.trackDisposable(new THREE.SphereGeometry(0.19, 6, 6));
    const leftBootToe = new THREE.Mesh(bootToeGeo, bootMat);
    leftBootToe.scale.set(1.0, 0.85, 1.35);
    leftBootToe.position.set(0, -0.58, -0.14);
    addHullOutline(leftBootToe, 1.08);
    this.leftLegPivot.add(leftBootToe);

    const soleGeo = this.trackDisposable(new THREE.BoxGeometry(0.36, 0.08, 0.56));
    const leftSole = new THREE.Mesh(soleGeo, bootSoleMat);
    leftSole.position.set(0, -0.68, -0.08);
    addBoxOutline(leftSole);
    this.leftLegPivot.add(leftSole);
    this.torsoGroup.add(this.leftLegPivot);

    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(0.24, -0.48, 0);

    const rightShorts = new THREE.Mesh(shortsGeo, shortsMat);
    rightShorts.position.y = -0.19;
    addHullOutline(rightShorts, 1.08);
    this.rightLegPivot.add(rightShorts);

    const rightBootShaft = new THREE.Mesh(bootShaftGeo, bootMat);
    rightBootShaft.position.set(0, -0.46, 0);
    addHullOutline(rightBootShaft, 1.08);
    this.rightLegPivot.add(rightBootShaft);

    const rightBootToe = new THREE.Mesh(bootToeGeo, bootMat);
    rightBootToe.scale.set(1.0, 0.85, 1.35);
    rightBootToe.position.set(0, -0.58, -0.14);
    addHullOutline(rightBootToe, 1.08);
    this.rightLegPivot.add(rightBootToe);

    const rightSole = new THREE.Mesh(soleGeo, bootSoleMat);
    rightSole.position.set(0, -0.68, -0.08);
    addBoxOutline(rightSole);
    this.rightLegPivot.add(rightSole);
    this.torsoGroup.add(this.rightLegPivot);
  }

  setVictory(active) {
    this.isVictory = Boolean(active);
    this.victoryTime = 0;
  }

  updateVictory(deltaMs) {
    const dt = deltaMs / 1000;
    this.victoryTime = (this.victoryTime || 0) + dt;
    const t = this.victoryTime;

    // Joyful celebratory victory jumps
    const jumpCycle = Math.sin(t * 6.5);
    const jumpH = Math.max(0, jumpCycle) * 0.75;
    this.root.position.y = jumpH;

    // Raised arms in celebration V pose
    if (this.leftArmPivot) {
      this.leftArmPivot.rotation.x = -2.5 + Math.sin(t * 8) * 0.2;
      this.leftArmPivot.rotation.z = -0.45;
    }
    if (this.rightArmPivot) {
      this.rightArmPivot.rotation.x = -2.5 + Math.sin(t * 8) * 0.2;
      this.rightArmPivot.rotation.z = 0.45;
    }

    // Legs tuck slightly at jump peak
    const legAngle = jumpCycle > 0 ? 0.35 : 0;
    if (this.leftLegPivot) this.leftLegPivot.rotation.x = legAngle;
    if (this.rightLegPivot) this.rightLegPivot.rotation.x = -legAngle;

    // Turn smoothly to face front-camera
    this.root.rotation.y = Math.PI + Math.sin(t * 2.5) * 0.2;
    this.root.rotation.z = 0;
  }

  update(deltaMs, { isRunning = true, isJumping = false, jumpProgress = 0, laneDeltaX = 0, invulnerableMs = 0 } = {}) {
    if (this.isVictory) {
      this.updateVictory(deltaMs);
      return;
    }

    const dt = deltaMs / 1000;

    // Damage invulnerability flashing
    if (invulnerableMs > 0) {
      this.root.visible = Math.floor(invulnerableMs / 70) % 2 === 0;
    } else {
      this.root.visible = true;
    }

    // Lane banking
    const targetTilt = -laneDeltaX * 1.8;
    this.tiltZ += (targetTilt - this.tiltZ) * Math.min(1, dt * 14);
    this.root.rotation.z = this.tiltZ;

    // Running cycle & kinematics
    if (isRunning && !isJumping) {
      this.runTime += deltaMs * 0.013;
      const legAngle = Math.sin(this.runTime) * 0.72;
      const armAngle = Math.sin(this.runTime) * 0.78;

      if (this.leftLegPivot) this.leftLegPivot.rotation.x = legAngle;
      if (this.rightLegPivot) this.rightLegPivot.rotation.x = -legAngle;
      if (this.leftArmPivot) this.leftArmPivot.rotation.x = -armAngle;
      if (this.rightArmPivot) this.rightArmPivot.rotation.x = armAngle;

      if (this.torsoGroup) {
        this.torsoGroup.position.y = 1.05 + Math.abs(Math.sin(this.runTime * 2)) * 0.08;
        this.torsoGroup.rotation.y = Math.sin(this.runTime) * 0.08;
      }

      // Secondary ear & tail follow-through
      this.earGroups.forEach(({ group, baseRotX }, idx) => {
        const offset = idx === 0 ? 0 : 0.4;
        group.rotation.x = baseRotX + Math.sin(this.runTime * 1.5 + offset) * 0.12;
      });

      if (this.tailMesh) {
        this.tailMesh.rotation.y = Math.sin(this.runTime * 1.2) * 0.25;
      }
      if (this.flameMesh) {
        this.flameMesh.rotation.y += dt * 4;
        this.flameMesh.scale.set(
          1 + Math.sin(this.runTime * 3) * 0.1,
          1 + Math.cos(this.runTime * 3) * 0.15,
          1 + Math.sin(this.runTime * 3) * 0.1
        );
      }
    } else if (isJumping) {
      const tuckAngle = Math.sin(jumpProgress * Math.PI) * 0.85;
      if (this.leftLegPivot) this.leftLegPivot.rotation.x = -tuckAngle;
      if (this.rightLegPivot) this.rightLegPivot.rotation.x = -tuckAngle;
      if (this.leftArmPivot) this.leftArmPivot.rotation.x = 0.9;
      if (this.rightArmPivot) this.rightArmPivot.rotation.x = 0.9;
      if (this.torsoGroup) {
        this.torsoGroup.rotation.x = -0.25 + tuckAngle * 0.2;
      }
    }
  }

  dispose() {
    this.disposables.forEach((item) => {
      if (item && item.dispose) {
        try {
          item.dispose();
        } catch {
          // ignore
        }
      }
    });
    this.disposables = [];
  }
}
