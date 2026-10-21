import * as THREE from 'three';
import { createPixelTexture } from '../createScene.js';
import { addBoxOutline, addHullOutline } from '../utils/outline.js';

/**
 * Creates authentic 256x256 hand-painted cel-shaded porcelain face texture for the Pennywise Deadlights villain.
 */
function createPennywiseFaceTexture() {
  return createPixelTexture((ctx, w, h) => {
    // 1. Ghostly cracked porcelain chalk-white skin base
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Subtle skin contour cel-shading on side cheeks & lower face
    const sideGrad = ctx.createLinearGradient(0, 0, w, 0);
    sideGrad.addColorStop(0, '#cbd5e1');
    sideGrad.addColorStop(0.18, '#e2e8f0');
    sideGrad.addColorStop(0.5, '#f8fafc');
    sideGrad.addColorStop(0.82, '#e2e8f0');
    sideGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = sideGrad;
    ctx.fillRect(0, 0, w, h);

    // Dark-ink cartoon border / contour outlines
    ctx.strokeStyle = '#120b1d';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    // 2. Bulbous Forehead Hairline Cracks
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(80, 24); ctx.lineTo(92, 40); ctx.lineTo(88, 52); ctx.lineTo(100, 60);
    ctx.moveTo(176, 28); ctx.lineTo(164, 42); ctx.lineTo(168, 56);
    ctx.moveTo(128, 16); ctx.lineTo(132, 32); ctx.lineTo(124, 44);
    ctx.stroke();

    // 3. Furrowed Menacing Brow Creases
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(60, 68); ctx.lineTo(110, 80);
    ctx.moveTo(196, 68); ctx.lineTo(146, 80);
    ctx.moveTo(116, 76); ctx.lineTo(128, 88); ctx.lineTo(140, 76);
    ctx.stroke();

    // 4. Dark Sunken Eye-Shadow Gradients
    const eyeShadowL = ctx.createRadialGradient(82, 98, 4, 82, 98, 32);
    eyeShadowL.addColorStop(0, '#090510');
    eyeShadowL.addColorStop(0.65, '#1e102d');
    eyeShadowL.addColorStop(1, 'transparent');
    ctx.fillStyle = eyeShadowL;
    ctx.beginPath(); ctx.arc(82, 98, 32, 0, Math.PI * 2); ctx.fill();

    const eyeShadowR = ctx.createRadialGradient(174, 98, 4, 174, 98, 32);
    eyeShadowR.addColorStop(0, '#090510');
    eyeShadowR.addColorStop(0.65, '#1e102d');
    eyeShadowR.addColorStop(1, 'transparent');
    ctx.fillStyle = eyeShadowR;
    ctx.beginPath(); ctx.arc(174, 98, 32, 0, Math.PI * 2); ctx.fill();

    // Sclera in texture (provides backing behind 3D eye)
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(82, 98, 16, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(174, 98, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Gaunt Cheek Hollows
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(48, 148, 18, 32, -0.2, 0, Math.PI * 2);
    ctx.ellipse(208, 148, 18, 32, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 6. Smooth Curved Crimson Makeup Lines
    ctx.fillStyle = '#b91c1c';
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.5;

    // Forehead points tapering upward toward crown
    // Left spear point
    ctx.beginPath();
    ctx.moveTo(82, 12); ctx.lineTo(89, 72); ctx.lineTo(75, 72); ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Right spear point
    ctx.beginPath();
    ctx.moveTo(174, 12); ctx.lineTo(181, 72); ctx.lineTo(167, 72); ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Curved cheek paint running from eyes down through gaunt cheek hollows toward mouth
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    // Left cheek curve
    ctx.moveTo(76, 120);
    ctx.quadraticCurveTo(68, 160, 52, 188);
    ctx.lineTo(62, 192);
    ctx.quadraticCurveTo(80, 160, 88, 120);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Right cheek curve
    ctx.beginPath();
    ctx.moveTo(180, 120);
    ctx.quadraticCurveTo(188, 160, 204, 188);
    ctx.lineTo(194, 192);
    ctx.quadraticCurveTo(176, 160, 168, 120);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Signature smile tips curling upward at mouth corners
    ctx.beginPath();
    ctx.arc(44, 178, 10, 0.5, Math.PI * 1.5, false);
    ctx.arc(212, 178, 10, -Math.PI * 0.5, Math.PI * 0.5, false);
    ctx.stroke();

    // 7. Glossy Crimson Clown Nose
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(128, 134, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(128, 131, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(133, 127, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 8. Dark Ink Cartoon Contour Lines for Mouth & Chin Base
    ctx.fillStyle = '#050208';
    ctx.beginPath();
    ctx.moveTo(52, 188);
    ctx.quadraticCurveTo(128, 240, 204, 188);
    ctx.quadraticCurveTo(128, 204, 52, 188);
    ctx.fill();
    ctx.strokeStyle = '#120b1d';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }, 256, 256);
}

/**
 * Creates authentic procedural Victorian doublet fabric texture
 * with woven linen weave, crimson pinstripes, and gold lace embroidery.
 */
function createVictorianDoubletTexture() {
  return createPixelTexture((ctx, w, h) => {
    // Pale ashen doublet slate base
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, w, h);

    // Subtle fabric grain
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        if ((x + y) % 4 === 0) {
          ctx.fillStyle = '#b0bec5';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Crimson vertical pinstripes with lace stitching
    for (let x = 8; x < w; x += 16) {
      // Crimson pinstripe
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(x, 0, 2, h);

      // Gold embroidery dots flanking the stripe
      ctx.fillStyle = '#d4a349';
      for (let y = 2; y < h; y += 4) {
        ctx.fillRect(x - 2, y, 1, 1);
        ctx.fillRect(x + 3, y, 1, 1);
      }
    }

    // Bottom shadow AO gradient
    for (let y = 0; y < h; y++) {
      const ao = Math.pow(y / h, 2.0) * 0.35;
      ctx.fillStyle = `rgba(15, 23, 42, ${ao.toFixed(3)})`;
      ctx.fillRect(0, y, w, 1);
    }
  }, 64, 64);
}

export class PursuerEntity {
  constructor() {
    this.root = new THREE.Group();
    this.time = 0;
    this.disposables = [];

    // Hovering framed at Y = 4.35 (clear of top HUD)
    this.targetZ = -19;
    this.currentZ = -19;
    this.baseHoverY = 4.35;

    // Uncanny Bill Skarsgård erratic twitch state
    this.headTwitchTimer = 0;
    this.targetHeadTilt = 0;
    this.targetHeadRotY = 0;
    this.currentHeadTilt = 0;
    this.breathePhase = 0;

    // Track animatable limbs
    this.shoeGroups = [];
    this.bloomerMeshes = [];
    this.fingersL = [];
    this.fingersR = [];

    this.buildPennywiseRig();
  }

  trackDisposable(item) {
    if (item) this.disposables.push(item);
    return item;
  }

  buildPennywiseRig() {
    const doubletGrey = '#cbd5e1';
    const doubletShadow = '#64748b';
    const stripeCrimson = '#b91c1c';
    const collarLace = '#f8fafc';
    const collarTrim = '#991b1b';
    const hairDark = '#9a3412';
    const hairMid = '#ea580c';
    const hairBright = '#f97316';
    const hairFlame = '#fbbf24';
    const balloonGloss = '#e11d48';
    const gloveWhite = '#f1f5f9';
    const clawDark = '#0f172a';

    // Doublet fabric texture
    const doubletTex = this.trackDisposable(createVictorianDoubletTexture());
    doubletTex.wrapS = THREE.RepeatWrapping;
    doubletTex.wrapT = THREE.RepeatWrapping;
    doubletTex.repeat.set(2, 2);

    // Faceted low-poly materials (flatShading: true)
    const doubletMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      map: doubletTex,
      color: doubletGrey,
      roughness: 0.65,
      metalness: 0.1,
      flatShading: true,
    }));
    const doubletShadowMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: doubletShadow,
      roughness: 0.7,
      flatShading: true,
    }));
    const stripeMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: stripeCrimson,
      roughness: 0.55,
      flatShading: true,
    }));
    const collarMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: collarLace,
      roughness: 0.5,
      flatShading: true,
    }));
    const collarTrimMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: collarTrim,
      roughness: 0.5,
      flatShading: true,
    }));
    const hairDarkMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: hairDark,
      roughness: 0.75,
      flatShading: true,
    }));
    const hairMidMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: hairMid,
      roughness: 0.7,
      flatShading: true,
    }));
    const hairBrightMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: hairBright,
      emissive: 0x441100,
      emissiveIntensity: 0.45,
      roughness: 0.65,
      flatShading: true,
    }));
    const hairFlameMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: hairFlame,
      emissive: 0x552200,
      emissiveIntensity: 0.6,
      roughness: 0.6,
      flatShading: true,
    }));
    const pomMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#dc2626',
      emissive: '#991b1b',
      emissiveIntensity: 0.8,
      roughness: 0.4,
      flatShading: true,
    }));
    const balloonMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: balloonGloss,
      emissive: 0x550015,
      emissiveIntensity: 0.55,
      roughness: 0.25,
      metalness: 0.2,
      flatShading: true,
    }));
    const stringMat = this.trackDisposable(new THREE.MeshBasicMaterial({ color: '#f8fafc' }));
    const gloveMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: gloveWhite,
      roughness: 0.6,
      flatShading: true,
    }));
    const clawMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: clawDark,
      roughness: 0.35,
      metalness: 0.4,
      flatShading: true,
    }));

    // Face Material with glowing deadlights eyes
    const faceTex = this.trackDisposable(createPennywiseFaceTexture());
    this.faceMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.45,
      emissive: '#f59e0b',
      emissiveIntensity: 1.8,
      flatShading: true,
    }));

    // ── MAIN FLOATING BODY GROUP ───────────────────────────────────
    this.bodyGroup = new THREE.Group();

    // Rotund Victorian clown doublet (8-segment faceted sphere)
    const torsoGeo = this.trackDisposable(new THREE.SphereGeometry(0.85, 8, 8));
    const torso = new THREE.Mesh(torsoGeo, doubletMat);
    torso.scale.set(1.15, 1.15, 0.95);
    torso.position.y = 0.75;
    addHullOutline(torso, 1.07);
    this.bodyGroup.add(torso);

    // 3 Fuzzy Crimson Pom-Poms down the center belly
    [1.18, 0.75, 0.32].forEach((py) => {
      const pom = new THREE.Mesh(this.trackDisposable(new THREE.SphereGeometry(0.18, 6, 6)), pomMat);
      pom.position.set(0, py, 0.78);
      addHullOutline(pom, 1.15);
      this.bodyGroup.add(pom);
    });

    // Flared Peplum Skirt at waist
    const peplumGeo = this.trackDisposable(new THREE.CylinderGeometry(0.95, 1.30, 0.38, 8));
    const peplum = new THREE.Mesh(peplumGeo, doubletShadowMat);
    peplum.position.set(0, -0.05, 0);
    addHullOutline(peplum, 1.07);
    this.bodyGroup.add(peplum);

    // Puffy Striped Bloomer Pantaloons & Pointed Clown Shoes
    [-0.38, 0.38].forEach((lx) => {
      const bloomer = new THREE.Mesh(
        this.trackDisposable(new THREE.SphereGeometry(0.36, 6, 6)),
        stripeMat
      );
      bloomer.scale.set(1.0, 1.25, 1.0);
      bloomer.position.set(lx, -0.42, 0);
      addHullOutline(bloomer, 1.08);
      this.bodyGroup.add(bloomer);

      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(lx, -0.85, 0);

      const shoeHeel = new THREE.Mesh(
        this.trackDisposable(new THREE.CylinderGeometry(0.14, 0.16, 0.28, 6)),
        doubletShadowMat
      );
      addHullOutline(shoeHeel, 1.08);
      shoeGroup.add(shoeHeel);

      const shoeToe = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.16, 0.45, 6)),
        stripeMat
      );
      shoeToe.rotation.x = Math.PI / 2 + 0.35;
      shoeToe.position.set(0, -0.1, 0.18);
      addHullOutline(shoeToe, 1.08);
      shoeGroup.add(shoeToe);

      const shoePom = new THREE.Mesh(
        this.trackDisposable(new THREE.SphereGeometry(0.08, 6, 6)),
        pomMat
      );
      shoePom.position.set(0, -0.02, 0.38);
      shoeGroup.add(shoePom);

      this.shoeGroups.push(shoeGroup);
      this.bloomerMeshes.push(bloomer);
      this.bodyGroup.add(shoeGroup);
    });

    // ── DEADLIGHTS OCCULT AURA HALO BEHIND COLLAR ─────────────────
    const auraHaloGeo = this.trackDisposable(new THREE.RingGeometry(0.9, 1.6, 12));
    this.auraHaloMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      emissive: '#dc2626',
      emissiveIntensity: 2.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    }));
    this.auraHalo = new THREE.Mesh(auraHaloGeo, this.auraHaloMat);
    this.auraHalo.position.set(0, 1.85, -0.28);
    this.bodyGroup.add(this.auraHalo);

    // ── MULTI-TIERED PLEATED ELIZABETHAN CLOWN COLLAR ─────────────
    this.collarGroup = new THREE.Group();
    this.collarGroup.position.set(0, 1.58, 0);

    const collarTiers = [
      { radius: 0.72, y: 0.22, count: 12, w: 0.34, h: 0.12, d: 0.38 },
      { radius: 0.96, y: 0.08, count: 14, w: 0.40, h: 0.14, d: 0.44 },
      { radius: 1.22, y: -0.08, count: 18, w: 0.46, h: 0.16, d: 0.50 },
    ];

    collarTiers.forEach((tier) => {
      for (let r = 0; r < tier.count; r++) {
        const angle = (r / tier.count) * Math.PI * 2;
        const plate = new THREE.Mesh(
          this.trackDisposable(new THREE.BoxGeometry(tier.w, tier.h, tier.d)),
          r % 2 === 0 ? collarMat : collarTrimMat
        );
        plate.position.set(Math.cos(angle) * tier.radius, tier.y, Math.sin(angle) * (tier.radius * 0.85));
        plate.rotation.y = angle;
        plate.rotation.x = 0.30;
        addBoxOutline(plate);
        this.collarGroup.add(plate);
      }
    });
    this.bodyGroup.add(this.collarGroup);

    // ── HEAD: HIGH-ACCURACY 3D SCULPTED PENNYWISE (BILL SKARSGÅRD) ─────────
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 2.40, 0);

    const porcelainMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.25,
      flatShading: true,
    }));

    const socketMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#090510',
      roughness: 0.8,
      flatShading: true,
    }));

    const scleraMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#fef08a',
      roughness: 0.3,
      flatShading: true,
    }));

    const pupilMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#000000',
      roughness: 0.1,
      flatShading: true,
    }));

    const browMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.6,
      flatShading: true,
    }));

    const paintMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#dc2626',
      emissive: '#991b1b',
      emissiveIntensity: 1.2,
      roughness: 0.35,
      flatShading: true,
    }));

    // 1. Porcelain Cranium & Forehead Dome (Expanded upper skull)
    const craniumGeo = this.trackDisposable(new THREE.SphereGeometry(0.72, 16, 12));
    const cranium = new THREE.Mesh(craniumGeo, porcelainMat);
    cranium.scale.set(1.05, 1.24, 0.98);
    cranium.position.set(0, 0.10, -0.04);
    addHullOutline(cranium, 1.07);
    this.headGroup.add(cranium);

    // Front Facial Shell: Seamless curved frontal hemisphere mapped with 256x256 cel-shaded porcelain face texture
    this.faceTexture = this.trackDisposable(createPennywiseFaceTexture());
    const faceShellMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      map: this.faceTexture,
      roughness: 0.35,
      metalness: 0.05,
    }));
    const faceShellGeo = this.trackDisposable(new THREE.SphereGeometry(
      0.728,
      24,
      18,
      Math.PI * 0.05,
      Math.PI * 0.90,
      Math.PI * 0.06,
      Math.PI * 0.86
    ));
    const faceShell = new THREE.Mesh(faceShellGeo, faceShellMat);
    faceShell.scale.set(1.05, 1.24, 1.0);
    faceShell.position.set(0, 0.10, -0.04);
    this.headGroup.add(faceShell);

    // 2. 3D Sunken Eye Sockets & Glowing Deadlights Eyeballs with Horizontal Player-Lane Tracking
    this.eyeIrises = [];
    const deadlightsIrisMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#ffaa00',
      emissive: '#ffaa00',
      emissiveIntensity: 2.8,
      roughness: 0.15,
    }));
    this.faceMat = deadlightsIrisMat; // Linked for jumpscare emissive flares!

    [-0.22, 0.22].forEach((ex) => {
      // Dark eye socket cavity
      const socket = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.24, 0.22, 0.16)),
        socketMat
      );
      socket.position.set(ex, 0.08, 0.48);
      this.headGroup.add(socket);

      // Sclera sphere
      const sclera = new THREE.Mesh(
        this.trackDisposable(new THREE.SphereGeometry(0.10, 8, 8)),
        scleraMat
      );
      sclera.position.set(ex, 0.08, 0.51);
      this.headGroup.add(sclera);

      // 3D Glowing Deadlights Iris (#ffaa00)
      const iris = new THREE.Mesh(
        this.trackDisposable(new THREE.SphereGeometry(0.065, 8, 8)),
        deadlightsIrisMat
      );
      iris.position.set(ex, 0.08, 0.58);
      this.headGroup.add(iris);

      // Pinpoint demonic black pupil
      const pupil = new THREE.Mesh(
        this.trackDisposable(new THREE.SphereGeometry(0.026, 6, 6)),
        pupilMat
      );
      pupil.position.set(ex, 0.08, 0.63);
      this.headGroup.add(pupil);

      // Track references for horizontal lane tracking
      this.eyeIrises.push({
        iris,
        pupil,
        baseIrisX: ex,
        basePupilX: ex,
      });

      // High-arched sinister 3D eyebrow
      const eyebrow = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.26, 0.06, 0.08)),
        browMat
      );
      eyebrow.position.set(ex, 0.24, 0.57);
      eyebrow.rotation.z = ex > 0 ? 0.30 : -0.30;
      eyebrow.rotation.y = ex > 0 ? -0.15 : 0.15;
      this.headGroup.add(eyebrow);
    });

    // 3. Glossy 3D Red Clown Nose
    const nose = new THREE.Mesh(
      this.trackDisposable(new THREE.SphereGeometry(0.16, 10, 10)),
      pomMat
    );
    nose.position.set(0, -0.04, 0.73);
    addHullOutline(nose, 1.15);
    this.headGroup.add(nose);

    // 4. Contoured Crimson Upper Lip & Snarling Maw
    const teethMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.15,
      emissive: '#f8fafc',
      emissiveIntensity: 0.9,
    }));

    // Contoured 3D Crimson Upper Lip Arch
    const upperLipGeo = this.trackDisposable(new THREE.TorusGeometry(0.30, 0.045, 6, 12, Math.PI));
    const upperLip = new THREE.Mesh(upperLipGeo, paintMat);
    upperLip.position.set(0, -0.22, 0.50);
    upperLip.rotation.x = 0.2;
    this.headGroup.add(upperLip);

    // Two signature prominent front incisors (buck teeth)
    [-0.045, 0.045].forEach((ix) => {
      const buckTooth = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.075, 0.22, 0.05)),
        teethMat
      );
      buckTooth.position.set(ix, -0.29, 0.57);
      addBoxOutline(buckTooth);
      this.headGroup.add(buckTooth);
    });

    // Flanking curved side fangs
    [-0.24, -0.16, 0.16, 0.24].forEach((tx) => {
      const fang = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.042, 0.19, 4)),
        teethMat
      );
      fang.position.set(tx, -0.27, 0.52 - Math.abs(tx) * 0.2);
      fang.rotation.x = Math.PI;
      this.headGroup.add(fang);
    });

    // Unhinging Lower Jaw Group with Chin & Lower Razor Teeth
    this.jawGroup = new THREE.Group();
    this.jawGroup.position.set(0, -0.28, 0.22);

    const chinGeo = this.trackDisposable(new THREE.ConeGeometry(0.52, 0.52, 6));
    const chin = new THREE.Mesh(chinGeo, porcelainMat);
    chin.position.set(0, -0.26, -0.12);
    chin.rotation.x = Math.PI;
    addHullOutline(chin, 1.07);
    this.jawGroup.add(chin);

    // Contoured Crimson Lower Lip
    const lowerLipGeo = this.trackDisposable(new THREE.TorusGeometry(0.28, 0.04, 6, 12, Math.PI));
    const lowerLip = new THREE.Mesh(lowerLipGeo, paintMat);
    lowerLip.position.set(0, -0.04, 0.24);
    lowerLip.rotation.x = -Math.PI + 0.2;
    this.jawGroup.add(lowerLip);

    // Lower Razor Teeth
    for (let t = -0.30; t <= 0.30; t += 0.075) {
      const tooth = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.038, 0.17, 4)),
        teethMat
      );
      tooth.position.set(t, 0.02, 0.19 - Math.abs(t) * 0.2);
      this.jawGroup.add(tooth);
    }
    this.headGroup.add(this.jawGroup);

    // 5. 3D Inner Mouth Cavity & 3 Orbiting Glowing Deadlights Throat Orbs
    const mouthCavity = new THREE.Mesh(
      this.trackDisposable(new THREE.BoxGeometry(0.48, 0.32, 0.36)),
      socketMat
    );
    mouthCavity.position.set(0, -0.25, 0.26);
    this.headGroup.add(mouthCavity);

    this.deadlightsCore = new THREE.Group();
    this.deadlightsCore.position.set(0, -0.24, 0.22);

    this.deadlightsMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#ffea00',
      emissive: '#ffea00',
      emissiveIntensity: 3.5,
      roughness: 0.1,
    }));

    const coreGoldMat = this.deadlightsMat;
    const coreOrangeMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#f97316',
      emissive: '#f97316',
      emissiveIntensity: 3.2,
      roughness: 0.1,
    }));

    // 3 Orbiting Deadlights Throat Orbs
    this.throatOrbs = [];
    [coreGoldMat, coreOrangeMat, coreGoldMat].forEach((mat) => {
      const orb = new THREE.Mesh(
        this.trackDisposable(new THREE.SphereGeometry(0.085, 8, 8)),
        mat
      );
      this.throatOrbs.push(orb);
      this.deadlightsCore.add(orb);
    });
    this.headGroup.add(this.deadlightsCore);

    // ── GLORIOUS FIERY ORANGE HAIR MANE ────────────────────────────
    const crownSpikes = [
      { x: -0.36, y: 0.95, z: -0.08, scale: 0.9, rotZ: 0.28, color: hairDarkMat },
      { x: -0.18, y: 1.18, z: -0.05, scale: 1.1, rotZ: 0.12, color: hairMidMat },
      { x: 0.0, y: 1.35, z: 0.0, scale: 1.25, rotZ: 0.0, color: hairFlameMat },
      { x: 0.18, y: 1.18, z: -0.05, scale: 1.1, rotZ: -0.12, color: hairMidMat },
      { x: 0.36, y: 0.95, z: -0.08, scale: 0.9, rotZ: -0.28, color: hairDarkMat },
    ];

    crownSpikes.forEach((cs) => {
      const spike = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.38 * cs.scale, 1.1 * cs.scale, 4)),
        cs.color
      );
      spike.position.set(cs.x, cs.y, cs.z);
      spike.rotation.z = cs.rotZ;
      spike.rotation.x = -0.15;
      addHullOutline(spike, 1.08);
      this.headGroup.add(spike);
    });

    [-0.72, 0.72].forEach((hx) => {
      const flareHigh = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.44, 1.25, 4)),
        hairBrightMat
      );
      flareHigh.position.set(hx > 0 ? hx + 0.18 : hx - 0.18, 0.58, -0.06);
      flareHigh.rotation.z = hx > 0 ? -0.85 : 0.85;
      flareHigh.rotation.x = -0.22;
      addHullOutline(flareHigh, 1.08);
      this.headGroup.add(flareHigh);

      const flareMid = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.50, 1.45, 4)),
        hairFlameMat
      );
      flareMid.position.set(hx > 0 ? hx + 0.34 : hx - 0.34, 0.18, -0.12);
      flareMid.rotation.z = hx > 0 ? -1.25 : 1.25;
      addHullOutline(flareMid, 1.08);
      this.headGroup.add(flareMid);

      const flareLow = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.42, 1.15, 4)),
        hairDarkMat
      );
      flareLow.position.set(hx > 0 ? hx + 0.28 : hx - 0.28, -0.25, -0.16);
      flareLow.rotation.z = hx > 0 ? -1.55 : 1.55;
      addHullOutline(flareLow, 1.08);
      this.headGroup.add(flareLow);

      const maneBack = new THREE.Mesh(
        this.trackDisposable(new THREE.SphereGeometry(0.55, 6, 6)),
        hairDarkMat
      );
      maneBack.position.set(hx * 0.75, 0.25, -0.55);
      addHullOutline(maneBack, 1.08);
      this.headGroup.add(maneBack);
    });

    this.bodyGroup.add(this.headGroup);

    // ── PUFFED SLEEVES & MENACING REACHING CLAW ARMS ──────────────
    [-1.02, 1.02].forEach((shX) => {
      const puff = new THREE.Mesh(this.trackDisposable(new THREE.SphereGeometry(0.46, 6, 6)), doubletMat);
      puff.position.set(shX, 1.35, 0);
      addHullOutline(puff, 1.08);
      this.bodyGroup.add(puff);

      const ribbonRing = new THREE.Mesh(this.trackDisposable(new THREE.TorusGeometry(0.47, 0.05, 6, 10)), stripeMat);
      ribbonRing.position.set(shX, 1.35, 0);
      this.bodyGroup.add(ribbonRing);
    });

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-1.12, 1.25, 0);

    const upperArmL = new THREE.Mesh(
      this.trackDisposable(new THREE.CylinderGeometry(0.18, 0.24, 0.85, 6)),
      doubletMat
    );
    upperArmL.position.set(0, -0.35, 0.38);
    upperArmL.rotation.x = -0.75;
    addHullOutline(upperArmL, 1.08);
    this.leftArm.add(upperArmL);

    const cuffL = new THREE.Mesh(
      this.trackDisposable(new THREE.TorusGeometry(0.24, 0.08, 6, 10)),
      collarMat
    );
    cuffL.position.set(0, -0.68, 0.68);
    cuffL.rotation.x = -0.75;
    this.leftArm.add(cuffL);

    const clawGroupL = new THREE.Group();
    clawGroupL.position.set(0, -0.80, 0.78);
    clawGroupL.rotation.x = -0.55;

    const palmL = new THREE.Mesh(this.trackDisposable(new THREE.SphereGeometry(0.18, 6, 6)), gloveMat);
    addHullOutline(palmL, 1.08);
    clawGroupL.add(palmL);

    for (let c = -0.14; c <= 0.14; c += 0.14) {
      const finger = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.07, 0.52, 4)),
        clawMat
      );
      finger.position.set(c, 0, 0.28);
      finger.rotation.x = Math.PI / 2;
      addHullOutline(finger, 1.1);
      clawGroupL.add(finger);
      this.fingersL.push(finger);
    }
    this.leftArm.add(clawGroupL);
    this.bodyGroup.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(1.12, 1.25, 0);

    const upperArmR = new THREE.Mesh(
      this.trackDisposable(new THREE.CylinderGeometry(0.18, 0.24, 0.85, 6)),
      doubletMat
    );
    upperArmR.position.set(0, -0.35, 0.38);
    upperArmR.rotation.x = -0.65;
    addHullOutline(upperArmR, 1.08);
    this.rightArm.add(upperArmR);

    const cuffR = new THREE.Mesh(
      this.trackDisposable(new THREE.TorusGeometry(0.24, 0.08, 6, 10)),
      collarMat
    );
    cuffR.position.set(0, -0.68, 0.68);
    cuffR.rotation.x = -0.65;
    this.rightArm.add(cuffR);

    const clawGroupR = new THREE.Group();
    clawGroupR.position.set(0, -0.80, 0.78);
    clawGroupR.rotation.x = -0.45;

    const palmR = new THREE.Mesh(this.trackDisposable(new THREE.SphereGeometry(0.18, 6, 6)), gloveMat);
    addHullOutline(palmR, 1.08);
    clawGroupR.add(palmR);

    for (let c = -0.14; c <= 0.14; c += 0.14) {
      const finger = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.07, 0.52, 4)),
        clawMat
      );
      finger.position.set(c, 0, 0.28);
      finger.rotation.x = Math.PI / 2;
      addHullOutline(finger, 1.1);
      clawGroupR.add(finger);
      this.fingersR.push(finger);
    }
    this.rightArm.add(clawGroupR);
    this.bodyGroup.add(this.rightArm);

    this.root.add(this.bodyGroup);

    // ── 3 FLOATING ICONIC CRIMSON BALLOONS ────────────────────────
    this.balloons = [];
    const balloonOffsets = [
      { x: 1.8, y: 3.8, z: 0.3, phase: 0 },
      { x: -2.3, y: 4.2, z: -0.4, phase: 1.8 },
      { x: 0.3, y: 5.0, z: -1.0, phase: 3.4 },
    ];

    balloonOffsets.forEach((b) => {
      const balloonGroup = new THREE.Group();
      balloonGroup.position.set(b.x, b.y, b.z);

      const mainSphere = new THREE.Mesh(
        this.trackDisposable(new THREE.SphereGeometry(0.78, 8, 8)),
        balloonMat
      );
      mainSphere.scale.set(1.0, 1.28, 1.0);
      addHullOutline(mainSphere, 1.08);
      balloonGroup.add(mainSphere);

      const knot = new THREE.Mesh(this.trackDisposable(new THREE.ConeGeometry(0.16, 0.22, 6)), balloonMat);
      knot.position.y = -1.02;
      knot.rotation.x = Math.PI;
      balloonGroup.add(knot);

      const str = new THREE.Mesh(
        this.trackDisposable(new THREE.CylinderGeometry(0.016, 0.016, 2.6, 4)),
        stringMat
      );
      str.position.set(0, -2.3, 0);
      balloonGroup.add(str);

      this.root.add(balloonGroup);
      this.balloons.push({ group: balloonGroup, base: b, phase: b.phase });
    });

    // High-visibility attack key light
    this.faceLight = this.trackDisposable(new THREE.PointLight(0xfff6ec, 0, 12));
    this.faceLight.position.set(0, 2.5, 1.8);
    this.root.add(this.faceLight);

    this.root.scale.set(1.36, 1.36, 1.36);
    this.root.position.set(0, 0, this.currentZ);
  }

  triggerJumpscare() {
    this.isJumpscare = true;
    this.jumpscareElapsed = 0;
    this.jumpscareDuration = 1.35;
    this.startFaceX = this.root.position.x;
    this.startFaceY = this.bodyGroup.position.y + 2.40;
    this.startFaceZ = this.currentZ + 0.45;
    if (this.faceLight) {
      this.faceLight.intensity = 8.0;
    }
  }

  resetJumpscare() {
    this.isJumpscare = false;
    this.jumpscareElapsed = 0;
    this.root.scale.set(1.36, 1.36, 1.36);
    this.root.position.set(0, 0, this.currentZ);
    this.root.rotation.set(0, 0, 0);
    this.bodyGroup.position.set(0, this.baseHoverY, 0);
    this.bodyGroup.rotation.set(0, 0, 0);
    if (this.faceLight) this.faceLight.intensity = 0;
    if (this.jawGroup) this.jawGroup.rotation.x = 0;
    if (this.headGroup) {
      this.headGroup.position.set(0, 2.40, 0);
      this.headGroup.rotation.set(0, 0, 0);
    }
    if (this.leftArm) {
      this.leftArm.position.set(-1.12, 1.25, 0);
      this.leftArm.rotation.set(-0.55, 0, -0.15);
    }
    if (this.rightArm) {
      this.rightArm.position.set(1.12, 1.25, 0);
      this.rightArm.rotation.set(-0.70, 0.12, 0.10);
    }
    if (this.collarGroup) this.collarGroup.scale.set(1, 1, 1);
    this.shoeGroups?.forEach((sg) => sg.rotation.set(0, 0, 0));
  }

  triggerDefeatCollapse() {
    this.isDefeated = true;
    this.defeatElapsed = 0;
    this.defeatDuration = 5.2;
    this.yVel = 0;

    // Reset visual visibility and base transforms
    this.root.position.set(0, 0, -6.2);
    this.root.rotation.set(0, 0, 0);
    this.root.scale.set(1.36, 1.36, 1.36);
    this.root.visible = true;

    this.bodyGroup.visible = true;
    this.bodyGroup.position.set(0, 1.55, 0);
    this.bodyGroup.rotation.set(0, 0, 0);

    if (this.headGroup) {
      this.headGroup.position.set(0, 2.40, 0);
      this.headGroup.rotation.set(0, 0, 0);
    }
    if (this.jawGroup) this.jawGroup.rotation.x = 0;

    // Reset all 3 balloons
    this.balloons?.forEach((b) => {
      b.group.visible = true;
      b.group.scale.set(1, 1, 1);
      b.group.position.set(b.base.x, b.base.y, b.base.z);
      b.hasBurst = false;
    });

    if (this.faceLight) this.faceLight.intensity = 5.0;

    // Build Cutscene 3D VFX Group
    this.setupDefeatVfx();
  }

  setupDefeatVfx() {
    if (this.defeatVfxGroup) {
      this.root.remove(this.defeatVfxGroup);
      this.defeatVfxGroup = null;
    }

    const group = new THREE.Group();
    this.defeatVfxGroup = group;
    this.root.add(group);

    // 1. The 6 Purified Pokédex Seal Cards
    const elementColors = ['#10b981', '#f59e0b', '#38bdf8', '#c084fc', '#94a3b8', '#06b6d4'];
    this.sealCards = [];
    elementColors.forEach((colorHex, idx) => {
      const cardGroup = new THREE.Group();

      // Card Slab
      const slabGeo = this.trackDisposable(new THREE.BoxGeometry(0.52, 0.76, 0.04));
      const slabMat = this.trackDisposable(new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 1.2,
        roughness: 0.3,
        metalness: 0.2,
      }));
      const slab = new THREE.Mesh(slabGeo, slabMat);
      cardGroup.add(slab);

      // Dark Border
      const borderGeo = this.trackDisposable(new THREE.BoxGeometry(0.56, 0.80, 0.03));
      const borderMat = this.trackDisposable(new THREE.MeshBasicMaterial({ color: '#120b1d' }));
      const border = new THREE.Mesh(borderGeo, borderMat);
      border.position.z = -0.01;
      cardGroup.add(border);

      // Inner Symbol Emblem Dot
      const dotGeo = this.trackDisposable(new THREE.SphereGeometry(0.12, 8, 8));
      const dotMat = this.trackDisposable(new THREE.MeshBasicMaterial({ color: '#ffffff' }));
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.z = 0.03;
      cardGroup.add(dot);

      // Laser Beam connecting card to Pennywise chest (0, 1.55, 0)
      const beamGeo = this.trackDisposable(new THREE.CylinderGeometry(0.035, 0.035, 1, 6));
      const beamMat = this.trackDisposable(new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0,
      }));
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.visible = false;
      group.add(beam);

      group.add(cardGroup);
      this.sealCards.push({
        group: cardGroup,
        beam,
        colorHex,
        baseAngle: (idx * Math.PI) / 3,
        idx,
      });
    });

    // 2. The Abyssal Void Vortex Portal (at cobblestone surface Y = 0.06)
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0.06, 0);
    portalGroup.rotation.x = -Math.PI / 2;
    portalGroup.scale.set(0.01, 0.01, 0.01);

    // Multi-ringed portal
    const outerRingGeo = this.trackDisposable(new THREE.RingGeometry(1.6, 2.3, 32));
    const outerRingMat = this.trackDisposable(new THREE.MeshBasicMaterial({
      color: '#991b1b',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    }));
    this.portalOuterRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    portalGroup.add(this.portalOuterRing);

    const midRingGeo = this.trackDisposable(new THREE.RingGeometry(0.85, 1.6, 32));
    const midRingMat = this.trackDisposable(new THREE.MeshBasicMaterial({
      color: '#7c3aed',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    }));
    this.portalMidRing = new THREE.Mesh(midRingGeo, midRingMat);
    portalGroup.add(this.portalMidRing);

    const coreGeo = this.trackDisposable(new THREE.CircleGeometry(0.85, 32));
    const coreMat = this.trackDisposable(new THREE.MeshBasicMaterial({
      color: '#080210',
      side: THREE.DoubleSide,
    }));
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    portalGroup.add(coreMesh);

    // 16 Rising dark-void voxel shards around rim
    this.portalShards = [];
    const shardGeo = this.trackDisposable(new THREE.BoxGeometry(0.12, 0.32, 0.12));
    for (let i = 0; i < 16; i++) {
      const shardMat = this.trackDisposable(new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? '#ef4444' : '#a855f7',
      }));
      const shard = new THREE.Mesh(shardGeo, shardMat);
      const angle = (i / 16) * Math.PI * 2;
      shard.position.set(Math.cos(angle) * 1.9, Math.sin(angle) * 1.9, 0.15);
      portalGroup.add(shard);
      this.portalShards.push({ mesh: shard, angle, baseZ: 0.15 });
    }

    // Golden Purification Shockwave Ring
    const shockwaveGeo = this.trackDisposable(new THREE.RingGeometry(0.3, 0.65, 32));
    this.shockwaveMat = this.trackDisposable(new THREE.MeshBasicMaterial({
      color: '#facc15',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    }));
    this.shockwaveRing = new THREE.Mesh(shockwaveGeo, this.shockwaveMat);
    this.shockwaveRing.visible = false;
    portalGroup.add(this.shockwaveRing);

    group.add(portalGroup);
    this.abyssPortal = portalGroup;

    // 3. Voxel Shrapnel Confetti Bursts
    this.balloonVoxelBursts = [];
  }

  updateDefeat(deltaMs) {
    if (!this.isDefeated) return;
    const dt = deltaMs / 1000;
    this.defeatElapsed += dt;
    const t = this.defeatElapsed;

    // Update balloon burst voxel particles if any
    for (let i = this.balloonVoxelBursts.length - 1; i >= 0; i--) {
      const p = this.balloonVoxelBursts[i];
      p.mesh.position.x += p.vel.x * dt;
      p.mesh.position.y += p.vel.y * dt;
      p.mesh.position.z += p.vel.z * dt;
      p.vel.y -= 12 * dt;
      p.mesh.rotation.x += dt * 6;
      p.mesh.rotation.y += dt * 8;
      p.life -= dt * 1.5;
      p.mesh.scale.setScalar(Math.max(0.01, p.life));
      if (p.life <= 0) {
        if (this.defeatVfxGroup) this.defeatVfxGroup.remove(p.mesh);
        this.balloonVoxelBursts.splice(i, 1);
      }
    }

    const spawnBalloonBurst = (pos) => {
      if (!this.defeatVfxGroup) return;
      const cubeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
      const colors = ['#dc2626', '#facc15', '#ef4444', '#f59e0b'];
      for (let k = 0; k < 8; k++) {
        const mat = new THREE.MeshBasicMaterial({ color: colors[k % colors.length] });
        const mesh = new THREE.Mesh(cubeGeo, mat);
        mesh.position.copy(pos);
        this.defeatVfxGroup.add(mesh);
        this.balloonVoxelBursts.push({
          mesh,
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            Math.random() * 5 + 2,
            (Math.random() - 0.5) * 6
          ),
          life: 1.0,
        });
      }
    };

    // ── Phase 1 (0.0s to 1.4s): The 6-Card Hexedex Seal & Balloon Pop ──
    if (t < 1.4) {
      const popTimes = [0.35, 0.75, 1.15];
      if (this.balloons) {
        this.balloons.forEach((b, idx) => {
          const popT = popTimes[idx];
          if (t < popT) {
            const shake = Math.sin(t * 35 + idx) * 0.08;
            b.group.scale.set(1 + shake, 1 + shake, 1 + shake);
            b.group.visible = true;
          } else if (t < popT + 0.08) {
            const burstFrac = (t - popT) / 0.08;
            const s = 1.0 + burstFrac * 0.6;
            b.group.scale.set(s, s, s);
            b.group.visible = true;
            if (!b.hasBurst) {
              b.hasBurst = true;
              spawnBalloonBurst(b.group.position);
            }
          } else {
            b.group.visible = false;
          }
        });
      }

      if (this.leftArm) {
        this.leftArm.rotation.set(-2.2 + Math.sin(t * 35) * 0.25, 0.6, 0.8);
      }
      if (this.rightArm) {
        this.rightArm.rotation.set(-2.2 + Math.cos(t * 35) * 0.25, -0.6, -0.8);
      }
      if (this.headGroup) {
        this.headGroup.rotation.z = Math.sin(t * 45) * 0.4;
        this.headGroup.rotation.x = -0.3 + Math.sin(t * 35) * 0.2;
      }
      if (this.faceMat) {
        this.faceMat.emissiveIntensity = Math.random() > 0.3 ? 5.0 : 0.4;
      }
      if (this.deadlightsMat) {
        this.deadlightsMat.emissiveIntensity = Math.random() > 0.3 ? 6.0 : 0.6;
      }

      const spiralIn = Math.min(1, t / 0.7);
      const rad = 2.8 + (1 - spiralIn) * 3.5;
      const height = 1.55 + (1 - spiralIn) * 2.5;

      this.sealCards?.forEach((card) => {
        const angle = card.baseAngle + t * 4.2;
        const cx = Math.cos(angle) * rad;
        const cz = Math.sin(angle) * rad;
        const cy = height + Math.sin(t * 3.5 + card.idx) * 0.15;
        card.group.position.set(cx, cy, cz);
        card.group.lookAt(0, 1.55, 0);

        if (t >= 0.4) {
          card.beam.visible = true;
          const chestPos = new THREE.Vector3(0, 1.55, 0);
          const cardPos = card.group.position;
          const midPos = cardPos.clone().add(chestPos).multiplyScalar(0.5);
          card.beam.position.copy(midPos);
          card.beam.scale.set(1, cardPos.distanceTo(chestPos), 1);
          card.beam.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            cardPos.clone().sub(chestPos).normalize()
          );
          card.beam.material.opacity = 0.5 + Math.sin(t * 22 + card.idx) * 0.35;
        }
      });
    }

    // ── Phase 2 (1.4s to 2.8s): Deadlights Overload & Abyssal Portal ──
    else if (t < 2.8) {
      const p2 = (t - 1.4) / 1.4;

      if (this.abyssPortal) {
        const pScale = 0.1 + p2 * 3.5;
        this.abyssPortal.scale.set(pScale, pScale, pScale);
        if (this.portalOuterRing) this.portalOuterRing.rotation.z += dt * 3.8;
        if (this.portalMidRing) this.portalMidRing.rotation.z -= dt * 5.2;

        this.portalShards?.forEach((shard) => {
          shard.angle += dt * 3.0;
          const r = 1.8;
          shard.mesh.position.x = Math.cos(shard.angle) * r;
          shard.mesh.position.y = Math.sin(shard.angle) * r;
          shard.mesh.position.z = shard.baseZ + Math.sin(t * 10 + shard.angle) * 0.35;
        });
      }

      if (this.jawGroup) {
        this.jawGroup.rotation.x = -1.2 * Math.min(1, p2 * 2.0);
      }

      if (this.faceMat) {
        this.faceMat.emissive.setHex(Math.sin(t * 30) > 0 ? 0xff4400 : 0x7c3aed);
        this.faceMat.emissiveIntensity = 6.0 + Math.sin(t * 40) * 3.0;
      }
      if (this.deadlightsMat) {
        this.deadlightsMat.emissiveIntensity = 8.0 + Math.sin(t * 35) * 4.0;
      }

      this.bodyGroup.position.y = 1.55 - p2 * 0.90;
      this.bodyGroup.rotation.z = Math.sin(t * 30) * 0.15;

      this.sealCards?.forEach((card) => {
        const angle = card.baseAngle + t * 4.8;
        const cx = Math.cos(angle) * 2.6;
        const cz = Math.sin(angle) * 2.6;
        const cy = 1.25 + Math.sin(t * 4.0 + card.idx) * 0.2;
        card.group.position.set(cx, cy, cz);
        card.group.lookAt(0, this.bodyGroup.position.y, 0);

        const chestPos = new THREE.Vector3(0, this.bodyGroup.position.y, 0);
        const cardPos = card.group.position;
        const midPos = cardPos.clone().add(chestPos).multiplyScalar(0.5);
        card.beam.position.copy(midPos);
        card.beam.scale.set(1.4, cardPos.distanceTo(chestPos), 1.4);
        card.beam.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          cardPos.clone().sub(chestPos).normalize()
        );
        card.beam.material.opacity = 0.85 + Math.sin(t * 28 + card.idx) * 0.15;
      });
    }

    // ── Phase 3 (2.8s to 4.2s): Swallowed Into Darkness ──
    else if (t < 4.2) {
      const p3 = (t - 2.8) / 1.4;

      if (this.abyssPortal) {
        if (this.portalOuterRing) this.portalOuterRing.rotation.z += dt * 6.0;
        if (this.portalMidRing) this.portalMidRing.rotation.z -= dt * 8.0;

        if (t >= 4.05) {
          const swFrac = (t - 4.05) / 0.15;
          if (this.shockwaveRing) {
            this.shockwaveRing.visible = true;
            const swScale = 1.0 + swFrac * 12.0;
            this.shockwaveRing.scale.set(swScale, swScale, swScale);
            this.shockwaveMat.opacity = Math.max(0, 1.0 - swFrac);
          }
          const closeScale = Math.max(0, 3.6 * (1 - swFrac));
          this.abyssPortal.scale.set(closeScale, closeScale, closeScale);
        }
      }

      this.sealCards?.forEach((card) => {
        card.beam.visible = false;
        const angle = card.baseAngle + t * 3.5;
        card.group.position.set(Math.cos(angle) * 3.2, 2.0, Math.sin(angle) * 3.2);
        card.group.rotation.y += dt * 4;
      });

      this.bodyGroup.rotation.x = Math.max(-1.45, this.bodyGroup.rotation.x - dt * 2.8);
      this.bodyGroup.rotation.y += dt * 6.5;

      this.yVel = (this.yVel || 0) - 22 * dt;
      this.bodyGroup.position.y += this.yVel * dt;

      if (this.rightArm) {
        this.rightArm.rotation.set(-2.8, 0, 0);
      }

      const s = Math.max(0.08, 1.36 * (1 - p3 * 0.92));
      this.root.scale.set(s, s, s);

      if (t >= 4.1) {
        this.bodyGroup.visible = false;
        this.root.visible = false;
      }
    }

    // ── Phase 4 (4.2s to 5.2s): Champion's Triumph ──
    else {
      this.root.visible = false;

      const p4 = (t - 4.2) / 1.0;
      const fwdZ = 6.2 * Math.min(1, p4 * 1.5);
      const orbitRad = 1.8 + Math.sin(t * 3.5) * 0.2;

      this.sealCards?.forEach((card) => {
        card.group.visible = true;
        const angle = card.baseAngle + t * 3.6;
        const cx = Math.cos(angle) * orbitRad;
        const cz = fwdZ + Math.sin(angle) * orbitRad;
        const cy = 1.1 + Math.sin(t * 4.5 + card.idx) * 0.35;
        card.group.position.set(cx, cy, cz);
        card.group.rotation.y += dt * 4;
        card.group.rotation.x = Math.sin(t * 3 + card.idx) * 0.15;
      });
    }
  }

  update(deltaMs, playerHearts, targetLaneX = 0) {
    const dt = deltaMs / 1000;
    this.time += dt * 3.2;

    // ── CINEMATIC LOSS JUMPSCARE ANIMATION ─────────────────────────
    if (this.isJumpscare) {
      this.jumpscareElapsed += dt;
      const progress = Math.min(1, this.jumpscareElapsed / this.jumpscareDuration);

      if (progress < 0.16) {
        const p1 = progress / 0.16;
        if (this.headGroup) {
          this.headGroup.rotation.z = p1 * 0.44;
          this.headGroup.rotation.x = -p1 * 0.18;
          this.headGroup.rotation.y = p1 * 0.12;
        }
        if (this.faceMat) this.faceMat.emissiveIntensity = 2.0 + p1 * 5.0;
        if (this.deadlightsMat) this.deadlightsMat.emissiveIntensity = 3.5 + p1 * 8.0;

        this.root.position.x = this.startFaceX + (Math.random() - 0.5) * 0.08;
        return;
      }

      const flightProgress = (progress - 0.16) / 0.84;
      const ease = Math.pow(flightProgress, 2.7);

      const endFaceX = 0;
      const endFaceY = 4.65;
      const endFaceZ = 6.60;

      const currentFaceX = this.startFaceX + (endFaceX - this.startFaceX) * ease;
      const currentFaceY = this.startFaceY + (endFaceY - this.startFaceY) * ease;
      const currentFaceZ = this.startFaceZ + (endFaceZ - this.startFaceZ) * ease;

      this.bodyGroup.rotation.x = -ease * 0.45;
      this.bodyGroup.position.y = 1.0;
      this.headGroup.position.z = ease * 0.60;
      this.headGroup.position.y = 2.40 - ease * 0.10;
      this.headGroup.rotation.x = ease * 0.65;

      this.leftArm.position.z = ease * 0.50;
      this.leftArm.rotation.x = -0.75 - ease * 1.55;
      this.leftArm.rotation.y = -0.25 - ease * 0.70;
      this.leftArm.rotation.z = Math.sin(this.jumpscareElapsed * 40) * 0.12;

      this.rightArm.position.z = ease * 0.50;
      this.rightArm.rotation.x = -0.65 - ease * 1.65;
      this.rightArm.rotation.y = 0.25 + ease * 0.70;
      this.rightArm.rotation.z = -Math.sin(this.jumpscareElapsed * 40) * 0.12;

      this.fingersL?.forEach((f, idx) => {
        f.rotation.z = Math.sin(this.jumpscareElapsed * 38 + idx) * 0.32;
      });
      this.fingersR?.forEach((f, idx) => {
        f.rotation.z = -Math.sin(this.jumpscareElapsed * 38 + idx) * 0.32;
      });

      this.shoeGroups?.forEach((sg, idx) => {
        sg.rotation.x = ease * 1.25 + Math.sin(this.jumpscareElapsed * 24 + idx) * 0.15;
      });

      const currentScale = 1.36 + ease * 1.65;
      this.root.scale.set(currentScale, currentScale, currentScale);

      const localFaceY = this.bodyGroup.position.y + this.headGroup.position.y;
      const localFaceZ = this.headGroup.position.z + 0.45;

      this.root.position.x = currentFaceX;
      this.root.position.y = currentFaceY - localFaceY * currentScale;
      this.root.position.z = currentFaceZ - localFaceZ * currentScale;

      if (this.faceLight) {
        this.faceLight.intensity = 8.0 + ease * 4.0;
        this.faceLight.position.set(0, 2.5, 1.8 + ease * 0.6);
      }

      if (this.jawGroup) {
        if (flightProgress < 0.76) {
          const openFrac = flightProgress / 0.76;
          this.jawGroup.rotation.x = -openFrac * 1.38;
        } else if (flightProgress < 0.89) {
          const biteFrac = (flightProgress - 0.76) / 0.13;
          this.jawGroup.rotation.x = -1.38 * (1 - biteFrac) + (-0.10 * biteFrac);
        } else {
          const ripFrac = (flightProgress - 0.89) / 0.11;
          this.jawGroup.rotation.x = -0.10 - ripFrac * 1.25;
        }
      }

      if (this.deadlightsMat) {
        this.deadlightsMat.emissiveIntensity = 5.0 + ease * 25.0;
      }
      if (this.faceMat) {
        this.faceMat.emissiveIntensity = 3.5 + ease * 10.0;
      }

      if (this.headGroup) {
        const shudderAmp = 0.08 + ease * 0.35;
        this.headGroup.rotation.z = 0.44 * (1 - ease) + Math.sin(this.jumpscareElapsed * 48) * shudderAmp;
        this.headGroup.rotation.y = Math.cos(this.jumpscareElapsed * 42) * shudderAmp;
      }

      this.balloons.forEach((b) => {
        b.group.position.z = b.base.z - ease * 5.2;
        b.group.position.y = (this.bodyGroup.position.y + 0.2) + b.base.y * 0.45 - ease * 1.6;
        b.group.rotation.x = ease * 1.45;
      });
      return;
    }

    // ── IN-GAME AMBIENT STALKING ANIMATION ─────────────────────────
    this.headTwitchTimer += dt;
    if (this.headTwitchTimer > 2.6) {
      this.headTwitchTimer = 0;
      this.targetHeadTilt = (Math.random() > 0.5 ? 1 : -1) * (0.24 + Math.random() * 0.22);
      this.targetHeadRotY = (Math.random() - 0.5) * 0.38;
    }

    this.currentHeadTilt += (this.targetHeadTilt - this.currentHeadTilt) * Math.min(1, dt * 7.5);
    this.targetHeadTilt *= Math.max(0, 1 - dt * 1.9);

    if (this.headGroup) {
      const subtleWobble = Math.sin(this.time * 0.9) * 0.06;
      this.headGroup.rotation.z = this.currentHeadTilt + subtleWobble;
      this.headGroup.rotation.y = (this.targetHeadRotY || 0) * 0.85 + Math.cos(this.time * 0.6) * 0.09;
      this.headGroup.rotation.x = Math.sin(this.time * 1.1) * 0.05;
    }

    // Sinusoidal hover bobbing framed at Y = 4.35 (cleanly below top HUD)
    const targetHoverY = playerHearts <= 1 ? 4.05 : 4.35;
    this.baseHoverY += (targetHoverY - this.baseHoverY) * Math.min(1, dt * 2.5);

    const hoverY = this.baseHoverY + Math.sin(this.time) * 0.32;
    this.bodyGroup.position.y = hoverY;
    this.bodyGroup.rotation.z = Math.sin(this.time * 0.6) * 0.05;
    this.bodyGroup.rotation.y = Math.sin(this.time * 0.4) * 0.06;

    // 3D Eye Tracking: Rotate / shift pupils and glowing Deadlights irises toward player's lane!
    if (this.eyeIrises) {
      const lookOffset = Math.max(-0.032, Math.min(0.032, (targetLaneX / 2.5) * 0.032));
      this.eyeIrises.forEach((eye) => {
        eye.iris.position.x = eye.baseIrisX + lookOffset;
        eye.pupil.position.x = eye.basePupilX + lookOffset * 1.15;
      });
    }

    // 3 Orbiting Deadlights Throat Orbs inside snarling maw
    if (this.throatOrbs) {
      this.throatOrbs.forEach((orb, i) => {
        const angle = this.time * 2.8 + (i * Math.PI * 2) / 3;
        orb.position.x = Math.cos(angle) * 0.14;
        orb.position.y = Math.sin(angle) * 0.08;
        orb.position.z = Math.sin(angle * 2) * 0.06;
      });
    }

    // Slowly rotate occult Deadlights Aura Halo
    if (this.auraHalo) {
      this.auraHalo.rotation.z += dt * 0.6;
    }

    // Menacing rhythmic claw reach & finger twitch
    this.leftArm.rotation.x = -0.55 + Math.sin(this.time * 1.4) * 0.15;
    this.leftArm.rotation.z = -0.15 + Math.cos(this.time * 0.8) * 0.08;

    this.rightArm.rotation.x = -0.70 + Math.sin(this.time * 1.6) * 0.22;
    this.rightArm.rotation.y = 0.12 + Math.cos(this.time * 1.1) * 0.14;
    this.rightArm.rotation.z = 0.10 + Math.sin(this.time * 0.7) * 0.06;

    this.fingersL?.forEach((f, idx) => {
      f.rotation.z = Math.sin(this.time * 2.5 + idx * 0.7) * 0.18;
    });
    this.fingersR?.forEach((f, idx) => {
      f.rotation.z = Math.cos(this.time * 3.2 + idx * 0.8) * 0.24;
    });

    // Marionette leg dangle
    this.shoeGroups?.forEach((sg, idx) => {
      const legPhase = idx === 0 ? 0 : Math.PI * 0.75;
      sg.rotation.x = Math.sin(this.time * 1.2 + legPhase) * 0.18;
      sg.rotation.z = (idx === 0 ? -1 : 1) * 0.08 + Math.cos(this.time * 0.8 + legPhase) * 0.08;
    });

    // Breathing Elizabethan Collar
    this.breathePhase += dt * 2.2;
    const breathe = 1 + Math.sin(this.breathePhase) * 0.025;
    if (this.collarGroup) {
      this.collarGroup.scale.set(breathe, 1, breathe);
    }

    // Floating balloons
    this.balloons.forEach((b) => {
      b.group.position.y = (hoverY + 0.2) + b.base.y * 0.45 + Math.sin(this.time * 1.3 + b.phase) * 0.32;
      b.group.position.x = b.base.x + Math.cos(this.time * 0.85 + b.phase) * 0.22;
      b.group.position.z = b.base.z + Math.sin(this.time * 0.7 + b.phase) * 0.18;
      b.group.rotation.z = Math.sin(this.time * 0.9 + b.phase) * 0.14;
      b.group.rotation.x = Math.cos(this.time * 0.75 + b.phase) * 0.10;
    });

    // Distance reactivity
    this.targetZ = playerHearts <= 1 ? -13.2 : -19.0;
    this.currentZ += (this.targetZ - this.currentZ) * Math.min(1, dt * 2.5);
    this.root.position.z = this.currentZ;

    // Soft lateral tracking
    this.root.position.x += (targetLaneX * 0.78 - this.root.position.x) * Math.min(1, dt * 2.4);

    // Dynamic jaw drop
    if (this.jawGroup) {
      const targetJawOpen = playerHearts <= 1 ? -0.28 : -0.05;
      this.jawGroup.rotation.x += (targetJawOpen - this.jawGroup.rotation.x) * Math.min(1, dt * 3.0);
    }

    // Deadlights sulfur-yellow & amber emissive pulsing
    const baseEmissive = playerHearts <= 1 ? 3.8 : 1.8;
    const pulse = Math.abs(Math.sin(this.time * 3.5)) * 0.9;
    if (this.faceMat) {
      this.faceMat.emissiveIntensity = baseEmissive + pulse;
    }
    if (this.deadlightsMat) {
      this.deadlightsMat.emissiveIntensity = 3.0 + pulse * 2.0;
    }
    if (this.auraHaloMat) {
      this.auraHaloMat.emissiveIntensity = 2.0 + pulse * 1.5;
    }
  }

  /**
   * Projects Pennywise's 3D head position to screen percentages for dynamic HUD tracking.
   */
  getSpeechBubbleScreenCoords(camera) {
    if (!this.headGroup || !camera) return null;
    if (!this._tempBubbleVec) {
      this._tempBubbleVec = new THREE.Vector3();
    }
    this.headGroup.getWorldPosition(this._tempBubbleVec);
    this._tempBubbleVec.x += 2.35;
    this._tempBubbleVec.y += 0.35;
    this._tempBubbleVec.project(camera);

    // Screen coords: [-1, 1] -> [0, 100]%
    const rawX = (this._tempBubbleVec.x * 0.5 + 0.5) * 100;
    const rawY = (-this._tempBubbleVec.y * 0.5 + 0.5) * 100;

    const xPercent = Math.max(10, Math.min(84, rawX));
    const yPercent = Math.max(6, Math.min(74, rawY));

    return {
      xPercent,
      yPercent,
      tailSide: 'left',
    };
  }

  dispose() {
    this.disposables.forEach((item) => {
      if (item.dispose) item.dispose();
    });
    this.disposables = [];
  }
}
