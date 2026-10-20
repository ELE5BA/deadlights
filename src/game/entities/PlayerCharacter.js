import * as THREE from 'three';
import { createPixelTexture } from '../createScene.js';
import { addBoxOutline, addHullOutline } from '../utils/outline.js';

/**
 * Creates pixel-art face texture for the runner.
 * Features expressive anime/pixel eyes with specular highlights, blush, and open scared mouth.
 */
function createPlayerFaceTexture() {
  return createPixelTexture((ctx, w, h) => {
    // Warm peach skin tone
    ctx.fillStyle = '#fce2cd';
    ctx.fillRect(0, 0, w, h);

    // Subtle forehead brow shade
    ctx.fillStyle = '#f3cbb0';
    ctx.fillRect(16, 24, 96, 8);

    // Left Eye
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(24, 36, 28, 36); // Sclera
    ctx.fillStyle = '#3a2012';
    ctx.fillRect(32, 40, 20, 30); // Iris
    ctx.fillStyle = '#0f0804';
    ctx.fillRect(36, 44, 14, 22); // Pupil
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(32, 40, 10, 10); // Primary catchlight
    ctx.fillRect(44, 56, 6, 6);   // Secondary catchlight

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

    // Rosy Cheeks
    ctx.fillStyle = '#f87171';
    ctx.fillRect(16, 76, 24, 12);
    ctx.fillRect(88, 76, 24, 12);

    // Muzzle & Nose
    ctx.fillStyle = '#d97757';
    ctx.fillRect(60, 72, 8, 6);

    // Open Scared Mouth
    ctx.fillStyle = '#6b1212';
    ctx.fillRect(52, 86, 24, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(56, 86, 16, 6); // Top teeth
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(58, 98, 12, 6); // Tongue
  }, 128, 128);
}

/**
 * Creates pixelated raincoat fabric texture with woven twill grain,
 * stitched hem border, and baked bottom ambient occlusion gradient.
 */
function createRaincoatFabricTexture() {
  return createPixelTexture((ctx, w, h) => {
    // Base raincoat yellow (#FFD000)
    ctx.fillStyle = '#ffd000';
    ctx.fillRect(0, 0, w, h);

    // Subtle woven diagonal twill grain
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

    // Top-to-bottom ambient occlusion gradient (darker towards bottom)
    for (let y = 0; y < h; y++) {
      const aoFactor = Math.pow(y / h, 1.8) * 0.32;
      ctx.fillStyle = `rgba(160, 95, 0, ${aoFactor.toFixed(3)})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Stitched hem border along bottom
    ctx.fillStyle = '#8f5200';
    for (let x = 2; x < w; x += 4) {
      ctx.fillRect(x, h - 3, 2, 1);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let x = 3; x < w; x += 4) {
      ctx.fillRect(x, h - 4, 1, 1);
    }
  }, 64, 64);
}

export class PlayerCharacter {
  constructor() {
    this.root = new THREE.Group();
    this.runTime = 0;
    this.tiltZ = 0;
    this.disposables = [];

    // Jump state tracking for Squash & Stretch
    this.wasJumping = false;
    this.landingTimer = 0; // seconds remaining in landing squash

    // Animatable sub-elements for secondary follow-through motion
    this.earGroups = [];
    this.bedroll = null;

    this.buildCharacterRig();
  }

  trackDisposable(item) {
    if (item) this.disposables.push(item);
    return item;
  }

  buildCharacterRig() {
    const raincoatYellow = '#FFD000';
    const hoodTrimYellow = '#E09F00';
    const outerEarColor = '#d97706';
    const innerEarPink = '#fda4af';
    const backpackBrown = '#78350f';
    const strapBrown = '#451a03';
    const shortsNavy = '#1e3a8a';
    const bootYellow = '#FFD000';
    const bootSoleDark = '#1e293b';
    const furHand = '#f0d2b6';

    // Textures
    const coatTex = this.trackDisposable(createRaincoatFabricTexture());
    coatTex.wrapS = THREE.RepeatWrapping;
    coatTex.wrapT = THREE.RepeatWrapping;
    coatTex.repeat.set(2, 2);

    const faceTex = this.trackDisposable(createPlayerFaceTexture());

    // Faceted low-poly materials (flatShading: true)
    const coatMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      map: coatTex,
      color: raincoatYellow,
      emissive: 0x332200,
      emissiveIntensity: 0.35,
      roughness: 0.5,
      flatShading: true,
    }));
    const coatTrimMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: hoodTrimYellow,
      emissive: 0x221500,
      emissiveIntensity: 0.3,
      roughness: 0.55,
      flatShading: true,
    }));
    const outerEarMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: outerEarColor,
      roughness: 0.65,
      flatShading: true,
    }));
    const innerEarMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: innerEarPink,
      roughness: 0.6,
      flatShading: true,
    }));
    const packMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: backpackBrown,
      roughness: 0.75,
      flatShading: true,
    }));
    const strapMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: strapBrown,
      roughness: 0.8,
      flatShading: true,
    }));
    const shortsMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: shortsNavy,
      roughness: 0.8,
      flatShading: true,
    }));
    const bootMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: bootYellow,
      emissive: 0x332200,
      emissiveIntensity: 0.3,
      roughness: 0.45,
      flatShading: true,
    }));
    const bootSoleMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: bootSoleDark,
      roughness: 0.8,
      flatShading: true,
    }));
    const handMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: furHand,
      roughness: 0.7,
      flatShading: true,
    }));
    const snapMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#2a1e0b',
      roughness: 0.4,
    }));
    const faceMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.55,
      flatShading: true,
    }));

    // ── TORSO GROUP (Tapered Flared Raincoat) ──────────────────────
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 1.05;
    this.torsoGroup.rotation.x = -0.12;

    // Main Raincoat Body (faceted 8-sided tapered cylinder)
    const bodyGeo = this.trackDisposable(new THREE.CylinderGeometry(0.44, 0.52, 0.85, 8));
    const bodyMesh = new THREE.Mesh(bodyGeo, coatMat);
    addHullOutline(bodyMesh, 1.08);
    this.torsoGroup.add(bodyMesh);

    // Flared raincoat bottom skirt hem
    const hemGeo = this.trackDisposable(new THREE.CylinderGeometry(0.52, 0.58, 0.25, 8));
    const hemMesh = new THREE.Mesh(hemGeo, coatTrimMat);
    hemMesh.position.y = -0.42;
    addHullOutline(hemMesh, 1.08);
    this.torsoGroup.add(hemMesh);

    // Front coat buttons / snap fasteners placket
    const placket = new THREE.Mesh(
      this.trackDisposable(new THREE.BoxGeometry(0.12, 0.95, 0.08)),
      coatTrimMat
    );
    placket.position.set(0, -0.05, -0.48);
    this.torsoGroup.add(placket);

    [-0.24, 0.02, 0.28].forEach((by) => {
      const snap = new THREE.Mesh(this.trackDisposable(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 6)), snapMat);
      snap.rotation.x = Math.PI / 2;
      snap.position.set(0, by, -0.52);
      this.torsoGroup.add(snap);
    });

    // Leather Backpack
    const packMain = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.66, 0.74, 0.38)), packMat);
    packMain.position.set(0, 0.04, 0.44);
    addBoxOutline(packMain);
    this.torsoGroup.add(packMain);

    const packFlap = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.70, 0.26, 0.42)), strapMat);
    packFlap.position.set(0, 0.32, 0.44);
    addBoxOutline(packFlap);
    this.torsoGroup.add(packFlap);

    // Bedroll sleeping bag (with secondary motion)
    this.bedroll = new THREE.Mesh(this.trackDisposable(new THREE.CylinderGeometry(0.12, 0.12, 0.68, 6)), coatTrimMat);
    this.bedroll.rotation.z = Math.PI / 2;
    this.bedroll.position.set(0, 0.48, 0.44);
    addHullOutline(this.bedroll, 1.08);
    this.torsoGroup.add(this.bedroll);

    // Backpack shoulder straps
    [-0.24, 0.24].forEach((sx) => {
      const strap = new THREE.Mesh(this.trackDisposable(new THREE.BoxGeometry(0.10, 0.90, 0.06)), strapMat);
      strap.position.set(sx, 0.02, -0.46);
      this.torsoGroup.add(strap);
    });

    // Glowing cyan mini-shard clipped to backpack
    const shardClipMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#43D9F2',
      emissive: '#43D9F2',
      emissiveIntensity: 2.2,
      roughness: 0.1,
    }));
    const miniShard = new THREE.Mesh(this.trackDisposable(new THREE.OctahedronGeometry(0.14, 0)), shardClipMat);
    miniShard.position.set(0.24, -0.15, 0.68);
    this.torsoGroup.add(miniShard);

    this.root.add(this.torsoGroup);

    // ── HEAD & ROUNDED HOOD CAVITY ─────────────────────────────────
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.85, 0.02);

    // Faceted outer hood dome (8 segments)
    const hoodDomeGeo = this.trackDisposable(new THREE.SphereGeometry(0.56, 8, 8));
    const hoodDome = new THREE.Mesh(hoodDomeGeo, coatMat);
    hoodDome.scale.set(1.0, 1.08, 1.0);
    addHullOutline(hoodDome, 1.07);
    this.headGroup.add(hoodDome);

    // Hood opening rim
    const hoodRimGeo = this.trackDisposable(new THREE.TorusGeometry(0.48, 0.08, 6, 12));
    const hoodRim = new THREE.Mesh(hoodRimGeo, coatTrimMat);
    hoodRim.position.set(0, 0, -0.28);
    hoodRim.rotation.x = -0.15;
    addHullOutline(hoodRim, 1.08);
    this.headGroup.add(hoodRim);

    // Inner head box with front face
    const innerHeadGeo = this.trackDisposable(new THREE.BoxGeometry(0.72, 0.72, 0.72));
    const innerHeadMats = [
      coatMat,
      coatMat,
      coatMat,
      coatMat,
      coatMat,
      faceMat, // -Z facing front
    ];
    const innerHead = new THREE.Mesh(innerHeadGeo, innerHeadMats);
    innerHead.position.set(0, 0, -0.06);
    this.headGroup.add(innerHead);

    // Pointed animal ears (Fox/cub ears) with secondary follow-through motion
    this.earGroups = [];
    [-0.34, 0.34].forEach((earX) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(earX, 0.55, -0.04);

      const outerEarGeo = this.trackDisposable(new THREE.ConeGeometry(0.20, 0.54, 4));
      const outerEar = new THREE.Mesh(outerEarGeo, outerEarMat);
      outerEar.rotation.y = Math.PI / 4;
      addHullOutline(outerEar, 1.12);
      earGroup.add(outerEar);

      const innerEarGeo = this.trackDisposable(new THREE.BoxGeometry(0.14, 0.36, 0.06));
      const innerEar = new THREE.Mesh(innerEarGeo, innerEarMat);
      innerEar.position.set(0, 0, -0.11);
      earGroup.add(innerEar);

      earGroup.rotation.z = earX > 0 ? -0.32 : 0.32;
      earGroup.rotation.x = -0.18;
      this.headGroup.add(earGroup);
      this.earGroups.push({ group: earGroup, baseRotX: -0.18 });
    });

    this.torsoGroup.add(this.headGroup);

    // ── ARMS (Tapered Raincoat Sleeves & Paws) ──────────────────────
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

    const cuffGeo = this.trackDisposable(new THREE.TorusGeometry(0.16, 0.035, 6, 10));
    const cuffL = new THREE.Mesh(cuffGeo, coatTrimMat);
    cuffL.rotation.x = Math.PI / 2;
    cuffL.position.y = -0.62;
    this.leftArmPivot.add(cuffL);

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

    const cuffR = new THREE.Mesh(cuffGeo, coatTrimMat);
    cuffR.rotation.x = Math.PI / 2;
    cuffR.position.y = -0.62;
    this.rightArmPivot.add(cuffR);

    const rightHand = new THREE.Mesh(pawGeo, handMat);
    rightHand.position.y = -0.72;
    addHullOutline(rightHand, 1.1);
    this.rightArmPivot.add(rightHand);
    this.torsoGroup.add(this.rightArmPivot);

    // ── LEGS (Denim Shorts & Curved Rainboots) ────────────────────
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

  /**
   * Updates procedural running cycle, lane banking, jump tuck, damage flashing,
   * squash & stretch, and secondary overlapping follow-through.
   */
  update(deltaMs, { isRunning, isJumping, jumpProgress, laneDeltaX, invulnerableMs }) {
    const dt = deltaMs / 1000;

    // Detect landing impact
    if (this.wasJumping && !isJumping) {
      this.landingTimer = 0.12; // 120ms landing impact duration
    }
    this.wasJumping = isJumping;

    if (this.landingTimer > 0) {
      this.landingTimer -= dt;
    }

    // 1. Squash & Stretch on torsoGroup
    if (isJumping) {
      if (jumpProgress < 0.2) {
        // Jump takeoff stretch (0.88, 1.16, 0.88)
        const t = jumpProgress / 0.2;
        this.torsoGroup.scale.set(
          THREE.MathUtils.lerp(1.0, 0.88, t),
          THREE.MathUtils.lerp(1.0, 1.16, t),
          THREE.MathUtils.lerp(1.0, 0.88, t)
        );
      } else if (jumpProgress >= 0.4 && jumpProgress <= 0.6) {
        // Jump apex normalize (1.04, 0.95, 1.04)
        this.torsoGroup.scale.set(1.04, 0.95, 1.04);
      } else {
        // Transition back towards 1
        this.torsoGroup.scale.set(1.0, 1.0, 1.0);
      }
    } else if (this.landingTimer > 0) {
      // Landing impact squash (1.15, 0.84, 1.15) springing back to 1
      const progress = 1 - (this.landingTimer / 0.12);
      this.torsoGroup.scale.set(
        THREE.MathUtils.lerp(1.15, 1.0, progress),
        THREE.MathUtils.lerp(0.84, 1.0, progress),
        THREE.MathUtils.lerp(1.15, 1.0, progress)
      );
    } else {
      // Natural running scale
      this.torsoGroup.scale.set(1.0, 1.0, 1.0);
    }

    // 2. Running cycle animations
    if (isRunning) {
      this.runTime += dt * 14;

      if (!isJumping) {
        const swing = Math.sin(this.runTime) * 0.85;
        this.leftLegPivot.rotation.x = swing;
        this.rightLegPivot.rotation.x = -swing;

        this.leftArmPivot.rotation.x = -swing * 0.95;
        this.rightArmPivot.rotation.x = swing * 0.95;

        // Bobbing body
        this.torsoGroup.position.y = 1.05 + Math.abs(Math.sin(this.runTime * 2)) * 0.09;
        this.headGroup.position.y = 0.85 + Math.sin(this.runTime) * 0.04;
      }
    }

    if (isJumping) {
      // Arms up in panic/tuck
      this.leftArmPivot.rotation.x = -1.25;
      this.rightArmPivot.rotation.x = -1.25;

      // Legs tuck upward
      this.leftLegPivot.rotation.x = 0.55;
      this.rightLegPivot.rotation.x = 0.55;

      this.torsoGroup.position.y = 1.05;
      this.headGroup.position.y = 0.85;
    }

    // 3. Overlapping Secondary Motion (Follow-Through)
    // Left/right fox ears and backpack bedroll lag slightly behind torso bob
    const lagPhase = Math.sin(this.runTime * 2 - 0.65) * 0.12;
    this.earGroups.forEach((ear) => {
      ear.group.rotation.x = ear.baseRotX + lagPhase;
    });
    if (this.bedroll) {
      this.bedroll.rotation.x = lagPhase * 0.8;
      this.bedroll.position.y = 0.48 + lagPhase * 0.04;
    }

    // 4. Lane change banking roll
    const targetTilt = Math.max(-0.25, Math.min(0.25, -laneDeltaX * 1.8));
    this.tiltZ += (targetTilt - this.tiltZ) * Math.min(1, dt * 12);
    this.root.rotation.z = this.tiltZ;

    // 5. Damage invulnerability flashing
    if (invulnerableMs > 0) {
      this.root.visible = Math.floor(invulnerableMs / 80) % 2 === 0;
    } else {
      this.root.visible = true;
    }
  }

  dispose() {
    this.disposables.forEach((item) => {
      if (item.dispose) item.dispose();
    });
    this.disposables = [];
  }
}
