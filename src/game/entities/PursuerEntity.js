import * as THREE from 'three';
import { createPixelTexture } from '../createScene.js';
import { addBoxOutline, addHullOutline } from '../utils/outline.js';

/**
 * Creates authentic pixel-art face texture for the Pennywise Deadlights villain.
 */
function createPennywiseFaceTexture() {
  return createPixelTexture((ctx, w, h) => {
    // 1. Ghostly cracked porcelain chalk-white skin base
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Subtle skin contour shading
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 16, h);
    ctx.fillRect(w - 16, 0, 16, h);
    ctx.fillRect(0, h - 14, w, 14);

    // Fine porcelain forehead hairline cracks
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(38, 10, 2, 14);
    ctx.fillRect(40, 20, 14, 2);
    ctx.fillRect(82, 12, 2, 12);
    ctx.fillRect(74, 18, 10, 2);

    // 2. High-arched sinister black brows
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(24, 28, 26, 4);
    ctx.fillRect(78, 28, 26, 4);
    ctx.fillRect(20, 31, 6, 4);
    ctx.fillRect(102, 31, 6, 4);

    // 3. Dark sunken eye sockets with deep charcoal shadow
    ctx.fillStyle = '#090510';
    ctx.fillRect(26, 34, 26, 26);
    ctx.fillRect(76, 34, 26, 26);

    // Sclera: Jaundiced yellow-white
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(29, 37, 20, 20);
    ctx.fillRect(79, 37, 20, 20);

    // Sulfur-yellow / amber predatory Deadlights iris
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(32, 40, 14, 14);
    ctx.fillRect(82, 40, 14, 14);

    // Blazing gold inner iris core
    ctx.fillStyle = '#ffea00';
    ctx.fillRect(35, 43, 8, 8);
    ctx.fillRect(85, 43, 8, 8);

    // Tiny dilated demonic black pupil
    ctx.fillStyle = '#000000';
    ctx.fillRect(37, 45, 4, 4);
    ctx.fillRect(87, 45, 4, 4);

    // Eyelid crease shadow
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(28, 35, 22, 3);
    ctx.fillRect(78, 35, 22, 3);

    // 4. Iconic Pennywise Crimson Red Paint Lines
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(37, 10, 6, 18);
    ctx.fillRect(85, 10, 6, 18);
    ctx.fillRect(38, 4, 4, 6);
    ctx.fillRect(86, 4, 4, 6);

    // Lines slicing straight through center of both eyes
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(37, 34, 6, 26);
    ctx.fillRect(85, 34, 6, 26);

    // Curved cheek paint running toward mouth corners
    ctx.fillRect(34, 60, 8, 14);
    ctx.fillRect(86, 60, 8, 14);
    ctx.fillRect(28, 72, 8, 12);
    ctx.fillRect(92, 72, 8, 12);
    ctx.fillRect(20, 80, 10, 12);
    ctx.fillRect(98, 80, 10, 12);

    // Extended curved smile tips curling upward
    ctx.fillRect(16, 76, 8, 12);
    ctx.fillRect(104, 76, 8, 12);

    // 5. Bulbous crimson clown nose
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(54, 56, 20, 16);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(57, 58, 14, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(59, 60, 4, 4);

    // 6. Maniacal wide razor-toothed smile
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(16, 86, 96, 36);

    ctx.fillStyle = '#050206';
    ctx.fillRect(20, 92, 88, 24);

    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(22, 90, 84, 4);
    ctx.fillRect(22, 112, 84, 4);

    // Jagged white razor teeth rows
    ctx.fillStyle = '#f8fafc';
    for (let x = 24; x <= 100; x += 6) {
      const isFront = x >= 56 && x <= 66;
      const toothHeight = isFront ? 12 : 8;
      ctx.fillRect(x, 92, 4, toothHeight);
    }
    for (let x = 26; x <= 98; x += 6) {
      ctx.fillRect(x, 108, 4, 7);
    }

    ctx.fillStyle = '#0f172a';
    for (let x = 28; x <= 100; x += 6) {
      ctx.fillRect(x, 92, 2, 8);
    }
  }, 128, 128);
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
    const craniumGeo = this.trackDisposable(new THREE.SphereGeometry(0.72, 10, 8));
    const cranium = new THREE.Mesh(craniumGeo, porcelainMat);
    cranium.scale.set(1.05, 1.24, 0.98);
    cranium.position.set(0, 0.10, -0.04);
    addHullOutline(cranium, 1.07);
    this.headGroup.add(cranium);

    // Sculpted 3D Menacing Brow Ridges
    [-0.22, 0.22].forEach((bx) => {
      const browRidge = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.32, 0.12, 0.16)),
        porcelainMat
      );
      browRidge.position.set(bx, 0.20, 0.52);
      browRidge.rotation.z = bx > 0 ? 0.20 : -0.20;
      browRidge.rotation.x = -0.15;
      addBoxOutline(browRidge);
      this.headGroup.add(browRidge);
    });

    // Sculpted 3D Tapered Cheekbones
    [-0.34, 0.34].forEach((cx) => {
      const cheek = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.24, 0.24, 0.22)),
        porcelainMat
      );
      cheek.position.set(cx, -0.06, 0.44);
      cheek.rotation.z = cx > 0 ? -0.18 : 0.18;
      addBoxOutline(cheek);
      this.headGroup.add(cheek);
    });

    // Upper Muzzle & Snout Base
    const muzzle = new THREE.Mesh(
      this.trackDisposable(new THREE.BoxGeometry(0.58, 0.20, 0.34)),
      porcelainMat
    );
    muzzle.position.set(0, -0.18, 0.44);
    addBoxOutline(muzzle);
    this.headGroup.add(muzzle);

    // 2. 3D Sunken Eye Sockets & Glowing Deadlights Eyeballs
    [-0.22, 0.22].forEach((ex) => {
      // Dark eye socket cavity
      const socket = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.25, 0.23, 0.16)),
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

      // Blazing Deadlights Iris (Linked to this.faceMat for jumpscare emissive flares!)
      const iris = new THREE.Mesh(
        this.trackDisposable(new THREE.SphereGeometry(0.065, 6, 6)),
        this.faceMat
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

      // High-arched sinister 3D eyebrow
      const eyebrow = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.28, 0.06, 0.08)),
        browMat
      );
      eyebrow.position.set(ex, 0.25, 0.57);
      eyebrow.rotation.z = ex > 0 ? 0.30 : -0.30;
      eyebrow.rotation.y = ex > 0 ? -0.15 : 0.15;
      this.headGroup.add(eyebrow);
    });

    // 3. 3D Sculpted Crimson Face-Paint Lines
    // Forehead vertical paint points slicing straight down through each eye
    [-0.22, 0.22].forEach((px) => {
      // Forehead spearhead
      const foreheadStrip = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.05, 0.38, 4)),
        paintMat
      );
      foreheadStrip.position.set(px, 0.44, 0.48);
      foreheadStrip.rotation.x = 0.25;
      this.headGroup.add(foreheadStrip);

      // Eye-slice vertical strip
      const eyeStrip = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.055, 0.40, 0.08)),
        paintMat
      );
      eyeStrip.position.set(px, 0.10, 0.59);
      this.headGroup.add(eyeStrip);

      // Curved cheek paint slicing toward mouth corners
      const cheekStrip = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.06, 0.28, 0.08)),
        paintMat
      );
      cheekStrip.position.set(px > 0 ? px + 0.12 : px - 0.12, -0.18, 0.51);
      cheekStrip.rotation.z = px > 0 ? -0.42 : 0.42;
      this.headGroup.add(cheekStrip);

      // Extended smile tips curling upward
      const curl = new THREE.Mesh(
        this.trackDisposable(new THREE.BoxGeometry(0.06, 0.14, 0.06)),
        paintMat
      );
      curl.position.set(px > 0 ? px + 0.20 : px - 0.20, -0.14, 0.46);
      curl.rotation.z = px > 0 ? 0.35 : -0.35;
      this.headGroup.add(curl);
    });

    // 4. Glossy 3D Red Clown Nose
    const nose = new THREE.Mesh(
      this.trackDisposable(new THREE.SphereGeometry(0.16, 8, 8)),
      pomMat
    );
    nose.position.set(0, -0.04, 0.73);
    addHullOutline(nose, 1.15);
    this.headGroup.add(nose);

    // 5. Signature Buck-Toothed Maw with Two Prominent Front Incisors + Razor Fangs
    const teethMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.15,
      emissive: '#f8fafc',
      emissiveIntensity: 0.9,
    }));

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

    // Flanking upper razor fangs
    [-0.26, -0.19, -0.12, 0.12, 0.19, 0.26].forEach((tx) => {
      const fang = new THREE.Mesh(
        this.trackDisposable(new THREE.ConeGeometry(0.04, 0.18, 4)),
        teethMat
      );
      fang.position.set(tx, -0.27, 0.52 - Math.abs(tx) * 0.22);
      fang.rotation.x = Math.PI;
      this.headGroup.add(fang);
    });

    // Unhinging Lower Jaw Group
    this.jawGroup = new THREE.Group();
    this.jawGroup.position.set(0, -0.28, 0.22);

    const chinGeo = this.trackDisposable(new THREE.ConeGeometry(0.52, 0.52, 6));
    const chin = new THREE.Mesh(chinGeo, porcelainMat);
    chin.position.set(0, -0.26, -0.12);
    chin.rotation.x = Math.PI;
    addHullOutline(chin, 1.07);
    this.jawGroup.add(chin);

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

    // Inner Glowing Deadlights Core (Throat cavity)
    this.deadlightsCore = new THREE.Group();
    this.deadlightsCore.position.set(0, -0.24, 0.16);

    this.deadlightsMat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#ffea00',
      emissive: '#ffea00',
      emissiveIntensity: 3.5,
      roughness: 0.1,
    }));
    const core1 = new THREE.Mesh(this.trackDisposable(new THREE.SphereGeometry(0.18, 6, 6)), this.deadlightsMat);
    this.deadlightsCore.add(core1);

    const core2Mat = this.trackDisposable(new THREE.MeshStandardMaterial({
      color: '#f97316',
      emissive: '#f97316',
      emissiveIntensity: 3.0,
      roughness: 0.1,
    }));
    [-0.14, 0.14].forEach((cx) => {
      const subCore = new THREE.Mesh(this.trackDisposable(new THREE.SphereGeometry(0.11, 6, 6)), core2Mat);
      subCore.position.set(cx, -0.05, -0.05);
      this.deadlightsCore.add(subCore);
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

  dispose() {
    this.disposables.forEach((item) => {
      if (item.dispose) item.dispose();
    });
    this.disposables = [];
  }
}
