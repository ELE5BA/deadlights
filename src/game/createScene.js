import * as THREE from 'three';
import { addBoxOutline, addHullOutline } from './utils/outline.js';

/**
 * Creates a canvas-backed pixel art texture with NearestFilter (crisp voxels/pixels, no blurring).
 */
export function createPixelTexture(drawFn, width = 64, height = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  drawFn(ctx, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Procedural pixelated cobblestone road with dark-slate bricks and cyan mortar lines.
 */
function createCobblestoneTexture() {
  return createPixelTexture((ctx, w, h) => {
    // Dark mortar background with subtle cyan rift tint
    ctx.fillStyle = '#0a1017';
    ctx.fillRect(0, 0, w, h);

    const rows = 16;
    const cols = 8;
    const rh = h / rows;
    const cw = w / cols;

    for (let r = 0; r < rows; r++) {
      const offsetX = (r % 2) * (cw / 2);
      for (let c = -1; c <= cols; c++) {
        const x = c * cw + offsetX;
        const y = r * rh;

        // Brick body: dark charcoal/slate
        const tone = 36 + Math.floor(Math.sin(r * 2 + c * 3) * 6);
        ctx.fillStyle = `rgb(${tone - 4}, ${tone}, ${tone + 8})`;
        ctx.fillRect(x + 1, y + 1, cw - 2, rh - 2);

        // Top brick highlight
        ctx.fillStyle = `rgb(${tone + 22}, ${tone + 26}, ${tone + 36})`;
        ctx.fillRect(x + 1, y + 1, cw - 2, 1);

        // Bottom shadow line
        ctx.fillStyle = '#06080d';
        ctx.fillRect(x, y + rh - 1, cw, 1);
        ctx.fillRect(x + cw - 1, y, 1, rh);

        // Subtle cyan rift specular speckle
        if ((r + c) % 5 === 0) {
          ctx.fillStyle = '#43d9f244';
          ctx.fillRect(x + 3, y + 3, 2, 1);
        }
      }
    }
  }, 128, 256);
}

/**
 * Procedural striped circus tent texture (crimson and warm cream stripes).
 */
function createTentTexture() {
  return createPixelTexture((ctx, w, h) => {
    const stripes = 8;
    const sw = w / stripes;
    for (let s = 0; s < stripes; s++) {
      ctx.fillStyle = s % 2 === 0 ? '#9e1b32' : '#d9c5a0';
      ctx.fillRect(s * sw, 0, sw, h);

      // Subtle shadow gradient at bottom
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(s * sw, h * 0.7, sw, h * 0.3);
    }
  }, 64, 64);
}

/**
 * Builds the Three.js scene, camera, lights, track, and illuminated carnival background props.
 */
export function createScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0A1622');
  scene.fog = new THREE.FogExp2('#0A1622', 0.022);

  // Perspective camera
  const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 160);
  camera.position.set(0, 5.2, 8.5);
  camera.lookAt(0, 1.2, -6);

  // High performance renderer configured for sRGB & ACES Filmic Tone Mapping (Fixes olive-green color wash!)
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(canvas.clientWidth || 1280, canvas.clientHeight || 720, false);

  // Three-point scene lighting
  // 1. Hemisphere Light (cool cyan sky, deep indigo ground so shadows are never pitch black)
  const hemiLight = new THREE.HemisphereLight(0x6be8ff, 0x121829, 0.95);
  scene.add(hemiLight);

  // 2. Directional Moonlight
  const moonLight = new THREE.DirectionalLight(0xd8f0ff, 1.4);
  moonLight.position.set(8, 18, 12);
  scene.add(moonLight);

  // 3. Dedicated Player Key / Rim Light (moves with the player so yellow raincoat stays bright #FFD000!)
  const playerRimLight = new THREE.PointLight(0xfff4d6, 2.2, 14);
  playerRimLight.position.set(0, 3.2, 2.5);
  scene.add(playerRimLight);

  // Warm Carnival Ambience Light
  const warmCarnivalLight = new THREE.PointLight(0xf7c56b, 1.8, 55);
  warmCarnivalLight.position.set(-8, 7, -12);
  scene.add(warmCarnivalLight);

  // Cobblestone 3-Lane Track
  const cobbleTex = createCobblestoneTexture();
  cobbleTex.wrapS = THREE.RepeatWrapping;
  cobbleTex.wrapT = THREE.RepeatWrapping;
  cobbleTex.repeat.set(3, 24);

  const roadGeo = new THREE.PlaneGeometry(10.6, 150);
  const roadMat = new THREE.MeshStandardMaterial({
    map: cobbleTex,
    roughness: 0.8,
    metalness: 0.15,
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.z = -55;
  scene.add(road);

  // Dark Fairground Peat/Moss Terrain Verges flanking the cobblestone road
  [-21, 21].forEach((gx) => {
    const groundVerge = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 150),
      new THREE.MeshStandardMaterial({
        color: '#080d14',
        roughness: 0.95,
      })
    );
    groundVerge.rotation.x = -Math.PI / 2;
    groundVerge.position.set(gx, -0.02, -55);
    scene.add(groundVerge);
  });

  // Glowing Shard Cyan Lane Rails
  const rails = [];
  [-4.8, -1.6, 1.6, 4.8].forEach((x) => {
    const railMat = new THREE.MeshStandardMaterial({
      color: '#43D9F2',
      emissive: '#43D9F2',
      emissiveIntensity: 1.6,
      roughness: 0.2,
    });
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.06, 150), railMat);
    rail.position.set(x, 0.04, -55);
    addBoxOutline(rail);
    scene.add(rail);
    rails.push(rail);
  });

  // Carnival Props Group: Fences, Lamp Posts with Catenary Festoon Lights, Striped Tents, Ferris Wheel
  const sidePropsGroup = new THREE.Group();
  const fenceMat = new THREE.MeshStandardMaterial({ color: '#241a20', roughness: 0.9 });
  const lampPostMat = new THREE.MeshStandardMaterial({ color: '#1a1f30', roughness: 0.75, metalness: 0.3 });
  const goldBulbMat = new THREE.MeshStandardMaterial({
    color: '#F7C56B',
    emissive: '#F7C56B',
    emissiveIntensity: 2.2,
  });
  const redBulbMat = new THREE.MeshStandardMaterial({
    color: '#E94462',
    emissive: '#E94462',
    emissiveIntensity: 2.0,
  });

  // Fence posts and roadside lantern posts
  for (let z = 6; z >= -114; z -= 12) {
    [-5.6, 5.6].forEach((sideX) => {
      // Voxel fence posts with cartoon black outlines
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.45, 0.26), fenceMat);
      post.position.set(sideX, 0.72, z);
      addBoxOutline(post);
      sidePropsGroup.add(post);

      const fenceRail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 12), fenceMat);
      fenceRail.position.set(sideX, 1.05, z - 6);
      addBoxOutline(fenceRail);
      sidePropsGroup.add(fenceRail);

      // Lamp posts every 24 units with warm voxel lanterns
      if (Math.abs(z % 24) < 1) {
        const pole = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.6, 0.32), lampPostMat);
        pole.position.set(sideX > 0 ? sideX + 1.2 : sideX - 1.2, 2.3, z);
        addBoxOutline(pole);
        sidePropsGroup.add(pole);

        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.2, 0.2), lampPostMat);
        bracket.position.set(sideX > 0 ? sideX + 0.8 : sideX - 0.8, 4.3, z);
        sidePropsGroup.add(bracket);

        // Voxel lantern box with glowing bulb inside
        const lanternBox = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.6, 0.48), lampPostMat);
        lanternBox.position.set(sideX > 0 ? sideX + 0.45 : sideX - 0.45, 4.0, z);
        addBoxOutline(lanternBox);
        sidePropsGroup.add(lanternBox);

        // Eerie Litwick-style spirit candle inside the lantern box
        const candleWax = new THREE.Mesh(
          new THREE.CylinderGeometry(0.10, 0.12, 0.22, 6),
          new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.5 })
        );
        candleWax.position.set(sideX > 0 ? sideX + 0.45 : sideX - 0.45, 3.86, z);
        addBoxOutline(candleWax);
        sidePropsGroup.add(candleWax);

        const soulFlameMat = new THREE.MeshStandardMaterial({
          color: z % 48 === 0 ? '#ff1e42' : '#38bdf8',
          emissive: z % 48 === 0 ? '#b91c1c' : '#0284c7',
          emissiveIntensity: 3.4,
          roughness: 0.2,
        });
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 5), soulFlameMat);
        flame.position.set(sideX > 0 ? sideX + 0.45 : sideX - 0.45, 4.12, z);
        addHullOutline(flame, 1.15);
        sidePropsGroup.add(flame);
      }
    });

    // Catenary side fence festoon bulbs with bold cartoon outlines
    if (z > -100 && z % 12 === 0) {
      [-5.6, 5.6].forEach((sideX) => {
        const stringBulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), (z % 24 === 0) ? redBulbMat : goldBulbMat);
        stringBulb.position.set(sideX, 2.4 + Math.sin(z) * 0.25, z - 6);
        addHullOutline(stringBulb, 1.12);
        sidePropsGroup.add(stringBulb);
      });
    }
  }

  // Striped Carnival Circus Tents in the Mid-Ground
  const tentTex = createTentTexture();
  tentTex.wrapS = THREE.RepeatWrapping;
  tentTex.wrapT = THREE.RepeatWrapping;
  tentTex.repeat.set(2, 1);

  const tentMat = new THREE.MeshStandardMaterial({
    map: tentTex,
    roughness: 0.65,
    emissive: 0x221508,
    emissiveIntensity: 0.45,
    flatShading: true,
  });

  const tentPositions = [
    { x: -18, z: -30 }, // Left foreground
    { x: 17, z: -32 },  // Right foreground (completely clear of Ferris Wheel at Z = -74!)
    { x: -25, z: -88 }, // Left background
    { x: 26, z: -108 }, // Right background
  ];

  tentPositions.forEach((tp) => {
    const tentGroup = new THREE.Group();

    // Cone tent top with bold cartoon outline
    const cone = new THREE.Mesh(new THREE.ConeGeometry(5.2, 6.8, 10), tentMat);
    cone.position.y = 5.8;
    addHullOutline(cone, 1.05);
    tentGroup.add(cone);

    // Tent cylindrical base with bold cartoon outline
    const base = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 2.4, 10), tentMat);
    base.position.y = 1.2;
    addHullOutline(base, 1.05);
    tentGroup.add(base);

    // Glowing pennant flag on top
    const pennantMat = new THREE.MeshStandardMaterial({
      color: '#F7C56B',
      emissive: '#F7C56B',
      emissiveIntensity: 1.5,
    });
    const pennant = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.08), pennantMat);
    pennant.position.set(0.35, 9.4, 0);
    addBoxOutline(pennant);
    tentGroup.add(pennant);

    tentGroup.position.set(tp.x, 0, tp.z);
    sidePropsGroup.add(tentGroup);
  });

  // Illuminated Rotating Ferris Wheel at (X = 23, Y = 14, Z = -74) - In clear open plaza!
  const ferrisWheelGroup = new THREE.Group();
  const ferrisMetalMat = new THREE.MeshStandardMaterial({
    color: '#26344d',
    roughness: 0.6,
    metalness: 0.4,
  });

  const outerRim = new THREE.Mesh(new THREE.TorusGeometry(13, 0.38, 8, 24), ferrisMetalMat);
  ferrisWheelGroup.add(outerRim);

  const innerRim = new THREE.Mesh(new THREE.TorusGeometry(6.5, 0.28, 8, 24), ferrisMetalMat);
  ferrisWheelGroup.add(innerRim);

  // 16 Glowing Gold/Crimson Bulb Cubes around the rim and 8 structural spokes
  const numSpokes = 8;
  for (let s = 0; s < numSpokes; s++) {
    const angle = (s / numSpokes) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.24, 26, 0.24), ferrisMetalMat);
    spoke.rotation.z = angle;
    ferrisWheelGroup.add(spoke);
  }

  const numBulbs = 16;
  for (let b = 0; b < numBulbs; b++) {
    const angle = (b / numBulbs) * Math.PI * 2;
    const bulbCube = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.55, 0.55),
      b % 2 === 0 ? goldBulbMat : redBulbMat
    );
    bulbCube.position.set(Math.cos(angle) * 13, Math.sin(angle) * 13, 0);
    ferrisWheelGroup.add(bulbCube);
  }

  // 6 Hanging Passenger Gondolas around the rim
  const numGondolas = 6;
  for (let g = 0; g < numGondolas; g++) {
    const angle = (g / numGondolas) * Math.PI * 2;
    const gx = Math.cos(angle) * 13;
    const gy = Math.sin(angle) * 13;

    const gondola = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.4, 1.2),
      new THREE.MeshStandardMaterial({
        color: g % 2 === 0 ? '#ef4444' : '#3b82f6',
        roughness: 0.5,
      })
    );
    gondola.position.set(gx, gy - 0.7, 0);
    addBoxOutline(gondola);
    ferrisWheelGroup.add(gondola);
  }

  const ferrisRig = new THREE.Group();
  ferrisWheelGroup.position.y = 14;
  ferrisRig.add(ferrisWheelGroup);

  // Sturdy A-frame support legs
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 18, 0.7), ferrisMetalMat);
  legL.position.set(-5.5, 8, 0);
  legL.rotation.z = 0.26;
  ferrisRig.add(legL);

  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 18, 0.7), ferrisMetalMat);
  legR.position.set(5.5, 8, 0);
  legR.rotation.z = -0.26;
  ferrisRig.add(legR);

  ferrisRig.position.set(23, 0, -74);
  sidePropsGroup.add(ferrisRig);

  // ── ILLUMINATED ROTATING CAROUSEL (MERRY-GO-ROUND) AT (X = -22, Z = -62) ──
  const carouselRig = new THREE.Group();
  carouselRig.position.set(-21, 0, -62);

  // Carousel base platform with black comic outline
  const carouselPlatform = new THREE.Mesh(
    new THREE.CylinderGeometry(6.2, 6.5, 0.7, 14),
    new THREE.MeshStandardMaterial({ color: '#241a22', roughness: 0.8 })
  );
  carouselPlatform.position.y = 0.35;
  addBoxOutline(carouselPlatform);
  carouselRig.add(carouselPlatform);

  // Rotating carousel turntable
  const carouselGroup = new THREE.Group();
  carouselGroup.position.y = 0.7;

  // Center mirrored core column with warm vertical light lines
  const centerPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 4.6, 10),
    new THREE.MeshStandardMaterial({ color: '#1a1f30', metalness: 0.8, roughness: 0.2 })
  );
  centerPillar.position.y = 2.3;
  addBoxOutline(centerPillar);
  carouselGroup.add(centerPillar);

  // Conical striped carousel roof canopy with bold cartoon outline
  const carouselRoof = new THREE.Mesh(new THREE.ConeGeometry(6.6, 3.2, 12), tentMat);
  carouselRoof.position.y = 5.2;
  addHullOutline(carouselRoof, 1.05);
  carouselGroup.add(carouselRoof);

  // Glowing finial star on top with cartoon outline
  const starFinial = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), goldBulbMat);
  starFinial.position.y = 7.1;
  addHullOutline(starFinial, 1.08);
  carouselGroup.add(starFinial);

  // 6 Brass poles with miniature voxel carousel mount Pokémon!
  const numPoles = 6;
  const pokemonMountDefs = [
    { name: 'Ponyta', bodyColor: '#fef08a', featureColor: '#f97316' }, // Flame mane
    { name: 'Pikachu', bodyColor: '#eab308', featureColor: '#dc2626' }, // Red cheeks / lightning
    { name: 'Haunter', bodyColor: '#7c3aed', featureColor: '#a855f7' }, // Spectral claws
    { name: 'Eevee', bodyColor: '#92400e', featureColor: '#fef3c7' }, // Cream fluffy ruff
    { name: 'Drifloon', bodyColor: '#8b5cf6', featureColor: '#facc15' }, // Yellow X mouth tape
    { name: 'Litwick', bodyColor: '#f1f5f9', featureColor: '#38bdf8' }, // Blue flame
  ];

  for (let p = 0; p < numPoles; p++) {
    const angle = (p / numPoles) * Math.PI * 2;
    const px = Math.cos(angle) * 4.4;
    const pz = Math.sin(angle) * 4.4;
    const pDef = pokemonMountDefs[p];

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 4.2, 6),
      new THREE.MeshStandardMaterial({ color: '#eab308', metalness: 0.6, roughness: 0.3 })
    );
    pole.position.set(px, 2.4, pz);
    carouselGroup.add(pole);

    // Voxel Pokémon Carousel Mount Group
    const mountGroup = new THREE.Group();
    mountGroup.position.set(px, 1.6 + Math.sin(p * 1.2) * 0.45, pz);
    mountGroup.rotation.y = angle + Math.PI / 2;

    const bodyMat = new THREE.MeshStandardMaterial({ color: pDef.bodyColor, roughness: 0.5 });
    const featMat = new THREE.MeshStandardMaterial({
      color: pDef.featureColor,
      emissive: pDef.featureColor,
      emissiveIntensity: 0.8,
      roughness: 0.4,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 1.1), bodyMat);
    addBoxOutline(body);
    mountGroup.add(body);

    // Pokémon-specific head/mane features
    if (pDef.name === 'Ponyta') {
      const mane = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.45, 0.8), featMat);
      mane.position.set(0, 0.45, 0);
      addBoxOutline(mane);
      mountGroup.add(mane);
    } else if (pDef.name === 'Pikachu') {
      [-0.2, 0.2].forEach((ex) => {
        const ear = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.12), bodyMat);
        ear.position.set(ex, 0.45, -0.2);
        ear.rotation.z = ex > 0 ? -0.25 : 0.25;
        addBoxOutline(ear);
        mountGroup.add(ear);
      });
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.45, 0.08), featMat);
      tail.position.set(0, 0.3, 0.6);
      tail.rotation.x = -0.4;
      mountGroup.add(tail);
    } else if (pDef.name === 'Haunter') {
      [-0.45, 0.45].forEach((hx) => {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 3), featMat);
        claw.position.set(hx, 0.1, -0.1);
        claw.rotation.x = Math.PI / 2;
        mountGroup.add(claw);
      });
    } else if (pDef.name === 'Litwick') {
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 5), featMat);
      flame.position.set(0, 0.48, 0);
      addHullOutline(flame, 1.12);
      mountGroup.add(flame);
    }

    carouselGroup.add(mountGroup);
  }

  carouselRig.add(carouselGroup);
  sidePropsGroup.add(carouselRig);

  // ── CARNIVAL GAME BOOTHS & PRIZE STALLS ALONG TRACK SIDES ──────
  const boothConfigs = [
    { x: -9.8, z: -26, name: 'PRIZES', roofColor: '#9e1b32', side: 'left' },
    { x: 9.8, z: -36, name: 'BALLOONS', roofColor: '#1d4ed8', side: 'right' },
    { x: -10.5, z: -64, name: 'POKÉ-AID', roofColor: '#dc2626', side: 'left' },
    { x: 10.5, z: -76, name: 'TICKETS', roofColor: '#6d28d9', side: 'right' },
  ];

  boothConfigs.forEach((cfg) => {
    const booth = new THREE.Group();
    booth.position.set(cfg.x, 0, cfg.z);
    booth.rotation.y = cfg.side === 'left' ? Math.PI / 2 : -Math.PI / 2;

    // Timber frame base
    const baseBooth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 2.4), fenceMat);
    baseBooth.position.y = 0.55;
    addBoxOutline(baseBooth);
    booth.add(baseBooth);

    // Countertop
    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.15, 2.6),
      new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.6 })
    );
    counter.position.y = 1.15;
    addBoxOutline(counter);
    booth.add(counter);

    // 4 Corner support posts
    [-1.6, 1.6].forEach((cx) => {
      [-1.0, 1.0].forEach((cz) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.5, 0.18), lampPostMat);
        post.position.set(cx, 2.3, cz);
        addBoxOutline(post);
        booth.add(post);
      });
    });

    // Striped slanted awning roof
    const roofMat = new THREE.MeshStandardMaterial({ color: cfg.roofColor, roughness: 0.65 });
    const awning = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.22, 2.8), roofMat);
    awning.position.set(0, 3.4, 0);
    awning.rotation.x = 0.12;
    addBoxOutline(awning);
    booth.add(awning);

    // Glowing warm booth interior lantern bulb
    const interiorBulb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), goldBulbMat);
    interiorBulb.position.set(0, 2.8, 0);
    booth.add(interiorBulb);

    // Poké-Aid Station Center Machine
    if (cfg.name === 'POKÉ-AID') {
      const machineBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.3, 0.9),
        new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.3 })
      );
      machineBase.position.set(0, 1.35, 0);
      addBoxOutline(machineBase);
      booth.add(machineBase);

      // 6 Pokéball Healing Slots
      [-0.6, -0.25, 0.1, 0.45].forEach((mx) => {
        const ball = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 6, 6),
          new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 1.5 })
        );
        ball.position.set(mx, 1.55, 0);
        booth.add(ball);
      });

      // Glowing Cyan Vitality Tube
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.7, 8),
        new THREE.MeshStandardMaterial({
          color: '#43D9F2',
          emissive: '#43D9F2',
          emissiveIntensity: 2.5,
          transparent: true,
          opacity: 0.85,
        })
      );
      tube.position.set(0.65, 1.65, 0);
      addBoxOutline(tube);
      booth.add(tube);
    }

    // Pokémon Carnival Target Shoot Cutouts on booth counter
    if (cfg.name === 'BALLOONS') {
      const targetColors = ['#eab308', '#a855f7', '#f472b6']; // Pikachu yellow, Gengar purple, Clefairy pink
      [-0.85, 0, 0.85].forEach((tx, i) => {
        const targetPlank = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.65, 0.08),
          new THREE.MeshStandardMaterial({ color: targetColors[i], roughness: 0.7 })
        );
        targetPlank.position.set(tx, 1.55, 0);
        addBoxOutline(targetPlank);
        booth.add(targetPlank);

        // Bullseye target circle
        const bullseye = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.16, 0.09, 8),
          new THREE.MeshBasicMaterial({ color: '#dc2626' })
        );
        bullseye.rotation.x = Math.PI / 2;
        bullseye.position.set(tx, 1.55, 0.02);
        booth.add(bullseye);
      });
    }

    // Glowing Sign Board on top
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.5, 0.12),
      new THREE.MeshStandardMaterial({ color: '#f8fafc', emissive: cfg.roofColor, emissiveIntensity: 0.6 })
    );
    signBoard.position.set(0, 3.8, 1.2);
    addBoxOutline(signBoard);
    booth.add(signBoard);

    sidePropsGroup.add(booth);
  });

  // ── DISTANT ROLLER COASTER TRESTLE SILHOUETTE (X = -26 to -14, Z = -72 to -108) ──
  const coasterGroup = new THREE.Group();
  coasterGroup.position.set(-22, 0, -85);

  const coasterMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.7, metalness: 0.4 });
  const coasterTrackCyan = new THREE.MeshStandardMaterial({
    color: '#43D9F2',
    emissive: '#43D9F2',
    emissiveIntensity: 1.8,
  });
  const coasterTrackRed = new THREE.MeshStandardMaterial({
    color: '#E94462',
    emissive: '#E94462',
    emissiveIntensity: 1.8,
  });

  // Trestle vertical lattice towers
  const trestlePoints = [
    { x: -5, y: 7, z: 20 },
    { x: 0, y: 13, z: 8 }, // Peak
    { x: 6, y: 9, z: -6 },
    { x: 11, y: 15, z: -20 }, // High swoop
  ];

  trestlePoints.forEach((tp) => {
    // Upright leg tower
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.2, tp.y, 1.2), coasterMat);
    tower.position.set(tp.x, tp.y / 2, tp.z);
    addBoxOutline(tower);
    coasterGroup.add(tower);

    // Cross brace
    const brace = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 2.4), coasterMat);
    brace.position.set(tp.x, tp.y * 0.65, tp.z);
    addBoxOutline(brace);
    coasterGroup.add(brace);

    // Glowing track segment atop tower
    const trackRailL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 14), coasterTrackCyan);
    trackRailL.position.set(tp.x - 0.45, tp.y + 0.15, tp.z);
    coasterGroup.add(trackRailL);

    const trackRailR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 14), coasterTrackRed);
    trackRailR.position.set(tp.x + 0.45, tp.y + 0.15, tp.z);
    coasterGroup.add(trackRailR);
  });

  // Coaster cart with glowing headlights sitting at peak (tp = { x: 0, y: 13, z: 8 })
  const cartMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4 });
  const coasterCart = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 2.4), cartMat);
  coasterCart.position.set(0, 13.6, 8);
  addBoxOutline(coasterCart);

  // Headlights
  [-0.55, 0.55].forEach((hx) => {
    const headlight = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), goldBulbMat);
    headlight.position.set(hx, 0, 1.25);
    coasterCart.add(headlight);
  });
  coasterGroup.add(coasterCart);

  sidePropsGroup.add(coasterGroup);

  // ── GRAND BIG TOP CIRCUS TENT SILHOUETTE IN DEEP BACKGROUND (Z = -120, X = -12) ──
  const bigTopGroup = new THREE.Group();
  bigTopGroup.position.set(-12, 0, -118);

  const bigTopMat = new THREE.MeshStandardMaterial({
    map: tentTex,
    roughness: 0.7,
    emissive: 0x221508,
    emissiveIntensity: 0.5,
  });

  const bigConeL = new THREE.Mesh(new THREE.ConeGeometry(9.0, 12.0, 12), bigTopMat);
  bigConeL.position.set(-6, 10.0, 0);
  addHullOutline(bigConeL, 1.04);
  bigTopGroup.add(bigConeL);

  const bigConeR = new THREE.Mesh(new THREE.ConeGeometry(9.0, 12.0, 12), bigTopMat);
  bigConeR.position.set(6, 10.0, 0);
  addHullOutline(bigConeR, 1.04);
  bigTopGroup.add(bigConeR);

  // Glowing high spires
  [-6, 6].forEach((sx) => {
    const spire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.22, 6.0, 6),
      new THREE.MeshStandardMaterial({ color: '#f59e0b', emissive: '#f59e0b', emissiveIntensity: 2.0 })
    );
    spire.position.set(sx, 17.5, 0);
    bigTopGroup.add(spire);

    const bannerFlag = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 0.08), goldBulbMat);
    bannerFlag.position.set(sx + 0.8, 19.5, 0);
    addBoxOutline(bannerFlag);
    bigTopGroup.add(bannerFlag);
  });

  // ── POKÉMON EERIE PROP 1: "GENGAR PHANTOM MANOR" CARNIVAL DARK RIDE FACADE (X = -18, Z = -52) ──
  const phantomManor = new THREE.Group();
  phantomManor.position.set(-18.5, 0, -52);

  const manorWallMat = new THREE.MeshStandardMaterial({
    color: '#1a0d28',
    roughness: 0.8,
    flatShading: true,
  });
  const manorTrimMat = new THREE.MeshStandardMaterial({
    color: '#3b1259',
    roughness: 0.6,
  });

  // Main funhouse facade building
  const mainFacade = new THREE.Mesh(new THREE.BoxGeometry(9.5, 7.5, 5.0), manorWallMat);
  mainFacade.position.y = 3.75;
  addBoxOutline(mainFacade);
  phantomManor.add(mainFacade);

  // Arched dark entrance tunnel (Gengar's open mouth ride tunnel)
  const tunnelCavity = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 3.4, 4.0),
    new THREE.MeshBasicMaterial({ color: '#030206' })
  );
  tunnelCavity.position.set(0, 1.7, 1.5);
  addBoxOutline(tunnelCavity);
  phantomManor.add(tunnelCavity);

  // Jagged glowing razor teeth around the tunnel entrance
  const teethMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#ff1e42',
    emissiveIntensity: 1.5,
  });
  const topTeeth = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.45, 0.2), teethMat);
  topTeeth.position.set(0, 3.25, 2.6);
  addBoxOutline(topTeeth);
  phantomManor.add(topTeeth);

  const botTeeth = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.45, 0.2), teethMat);
  botTeeth.position.set(0, 0.35, 2.6);
  addBoxOutline(botTeeth);
  phantomManor.add(botTeeth);

  // Glowing sinister red eyes above entrance (#FF1E42)
  const eyeMat = new THREE.MeshStandardMaterial({
    color: '#ff1e42',
    emissive: '#ff1e42',
    emissiveIntensity: 3.8,
  });
  [-1.8, 1.8].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.2), eyeMat);
    eye.position.set(ex, 5.2, 2.6);
    eye.rotation.z = ex > 0 ? 0.35 : -0.35;
    addBoxOutline(eye);
    phantomManor.add(eye);
  });

  // Towering Gothic Spooky Spikes on the roof
  [-3.8, 0, 3.8].forEach((sx, i) => {
    const roofSpire = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.6, 4), manorTrimMat);
    roofSpire.position.set(sx, 8.8, 0);
    roofSpire.rotation.z = (i - 1) * 0.25;
    addHullOutline(roofSpire, 1.08);
    phantomManor.add(roofSpire);
  });

  // Neon Marquee Sign on top: "PHANTOM MANOR"
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 0.9, 0.2),
    new THREE.MeshStandardMaterial({
      color: '#0f0518',
      emissive: '#b843f2',
      emissiveIntensity: 0.9,
    })
  );
  signBoard.position.set(0, 7.8, 2.65);
  addBoxOutline(signBoard);
  phantomManor.add(signBoard);

  // Flanking lantern sconces
  [-2.8, 2.8].forEach((lx) => {
    const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.4), goldBulbMat);
    lantern.position.set(lx, 3.2, 2.7);
    addBoxOutline(lantern);
    phantomManor.add(lantern);
  });

  sidePropsGroup.add(phantomManor);

  // ── POKÉMON EERIE PROP 2: "DRIFLOON GHOST-BALLOON KIOSK" (X = 14.5, Z = -32) ──
  const drifloonStation = new THREE.Group();
  drifloonStation.position.set(14.5, 0, -32);

  // Dilapidated wooden balloon cart base
  const cartWoodMat = new THREE.MeshStandardMaterial({ color: '#271c19', roughness: 0.9 });
  const cartBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 2.2), cartWoodMat);
  cartBase.position.y = 0.6;
  addBoxOutline(cartBase);
  drifloonStation.add(cartBase);

  // Balloon cart wooden post
  const cartPole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 4.2, 0.18), cartWoodMat);
  cartPole.position.set(0, 2.5, 0);
  addBoxOutline(cartPole);
  drifloonStation.add(cartPole);

  // Hand-painted sign: "LOST WINDS BALLOONS"
  const cartSign = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.6, 0.1),
    new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.6 })
  );
  cartSign.position.set(0, 4.3, 0);
  addBoxOutline(cartSign);
  drifloonStation.add(cartSign);

  // 3 Tethered Drifloon Ghost-Balloons floating overhead!
  const drifloonOffsets = [
    { x: -0.9, y: 5.4, z: 0.3, phase: 0 },
    { x: 0.8, y: 5.8, z: -0.2, phase: 1.8 },
    { x: 0.0, y: 6.4, z: 0.4, phase: 3.2 },
  ];

  const drifloonPurpleMat = new THREE.MeshStandardMaterial({
    color: '#8b5cf6',
    emissive: '#4c1d95',
    emissiveIntensity: 0.6,
    roughness: 0.35,
  });
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 });
  const yellowTapeMat = new THREE.MeshBasicMaterial({ color: '#eab308' });

  drifloonOffsets.forEach((df) => {
    const drifloon = new THREE.Group();
    drifloon.position.set(df.x, df.y, df.z);

    // Purple balloon head sphere
    const balloonHead = new THREE.Mesh(new THREE.SphereGeometry(0.68, 12, 12), drifloonPurpleMat);
    balloonHead.scale.set(1.0, 1.15, 1.0);
    addHullOutline(balloonHead, 1.08);
    drifloon.add(balloonHead);

    // Fluffy cloud tuft on top of head
    const cloudTuft = new THREE.Mesh(new THREE.SphereGeometry(0.36, 8, 8), cloudMat);
    cloudTuft.position.y = 0.78;
    addHullOutline(cloudTuft, 1.1);
    drifloon.add(cloudTuft);

    // Yellow cross "X" tape on mouth
    const tape1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.05), yellowTapeMat);
    tape1.position.set(0, -0.15, 0.65);
    tape1.rotation.z = Math.PI / 4;
    drifloon.add(tape1);

    const tape2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.05), yellowTapeMat);
    tape2.position.set(0, -0.15, 0.65);
    tape2.rotation.z = -Math.PI / 4;
    drifloon.add(tape2);

    // 2 String legs with little yellow heart pads hanging down
    [-0.2, 0.2].forEach((lx) => {
      const legString = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 1.2, 4),
        new THREE.MeshBasicMaterial({ color: '#cbd5e1' })
      );
      legString.position.set(lx, -0.85, 0);
      drifloon.add(legString);

      const heartFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.08), yellowTapeMat);
      heartFoot.position.set(lx, -1.45, 0);
      drifloon.add(heartFoot);
    });

    drifloonStation.add(drifloon);
  });

  sidePropsGroup.add(drifloonStation);

  // ── POKÉMON EERIE PROP 3: SPOOKY TREVENANT GHOST-WOODS FRAMING CARNIVAL ──
  const treePositions = [
    { x: -13, z: -18, scale: 1.1 },
    { x: 13, z: -46, scale: 1.2 },
    { x: -14, z: -80, scale: 1.3 },
    { x: 14, z: -98, scale: 1.25 },
  ];

  const deadWoodMat = new THREE.MeshStandardMaterial({ color: '#1a1820', roughness: 0.95 });

  treePositions.forEach((tp) => {
    const tree = new THREE.Group();
    tree.position.set(tp.x, 0, tp.z);
    tree.scale.set(tp.scale, tp.scale, tp.scale);

    // Gnarled trunk
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.85, 4.8, 6), deadWoodMat);
    trunk.position.y = 2.4;
    addBoxOutline(trunk);
    tree.add(trunk);

    // Spooky twisted branches reaching into the fog
    const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.8, 5), deadWoodMat);
    branch1.position.set(0.9, 4.4, 0);
    branch1.rotation.z = -0.75;
    addBoxOutline(branch1);
    tree.add(branch1);

    const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.28, 2.4, 5), deadWoodMat);
    branch2.position.set(-0.85, 4.6, 0.2);
    branch2.rotation.z = 0.85;
    addBoxOutline(branch2);
    tree.add(branch2);

    // Eerie glowing hollow eye knot (#FF1E42)
    const eyeKnot = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.12, 0.1),
      new THREE.MeshStandardMaterial({ color: '#ff1e42', emissive: '#ff1e42', emissiveIntensity: 2.8 })
    );
    eyeKnot.position.set(0, 2.8, 0.55);
    tree.add(eyeKnot);

    sidePropsGroup.add(tree);
  });

  // ── POKÉMON EERIE PROP 4: LAVENDER TOWN WEATHERED ROUTE SIGNPOST (X = 6.8, Z = -14) ──
  const routeSign = new THREE.Group();
  routeSign.position.set(6.8, 0, -14);

  const signPost = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.6, 0.18), cartWoodMat);
  signPost.position.y = 1.3;
  addBoxOutline(signPost);
  routeSign.add(signPost);

  // Directional Planks
  const plankMat = new THREE.MeshStandardMaterial({ color: '#d8c29d', roughness: 0.8 });
  const plank1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.32, 0.08), plankMat);
  plank1.position.set(0.65, 2.2, 0.1);
  plank1.rotation.z = -0.08;
  addBoxOutline(plank1);
  routeSign.add(plank1);

  const plank2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.32, 0.08), plankMat);
  plank2.position.set(-0.6, 1.7, 0.1);
  plank2.rotation.z = 0.06;
  addBoxOutline(plank2);
  routeSign.add(plank2);

  // Small Litwick spirit candle at base of signpost
  const signCandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.22, 6),
    new THREE.MeshStandardMaterial({ color: '#e0e7ff', roughness: 0.5 })
  );
  signCandle.position.set(0.35, 0.11, 0.25);
  addBoxOutline(signCandle);
  routeSign.add(signCandle);

  const signFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.28, 5),
    new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#0284c7', emissiveIntensity: 3.5 })
  );
  signFlame.position.set(0.35, 0.32, 0.25);
  addHullOutline(signFlame, 1.15);
  routeSign.add(signFlame);

  sidePropsGroup.add(routeSign);

  // ── POKÉMON EERIE PROP 5: CREEPY ABANDONED MIMIKYU VOXEL DECOY (ON BOOTH COUNTER) ──
  const mimikyu = new THREE.Group();
  mimikyu.position.set(-8.8, 1.25, -26);
  mimikyu.rotation.y = Math.PI / 3;

  const burlapMat = new THREE.MeshStandardMaterial({ color: '#c4ad7a', roughness: 0.9 });
  const mimikyuBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.85, 0.65), burlapMat);
  mimikyuBody.position.y = 0.42;
  addBoxOutline(mimikyuBody);
  mimikyu.add(mimikyuBody);

  // Floppy burlap ears (one pointed up, one drooping down)
  const earUp = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.85, 4), burlapMat);
  earUp.position.set(-0.25, 1.25, 0);
  earUp.rotation.z = 0.22;
  addHullOutline(earUp, 1.1);
  mimikyu.add(earUp);

  const earDown = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.75, 4), burlapMat);
  earDown.position.set(0.28, 1.05, 0);
  earDown.rotation.z = -1.35;
  addHullOutline(earDown, 1.1);
  mimikyu.add(earDown);

  // Black scribbled face dots & red cheeks
  const scribbleMat = new THREE.MeshBasicMaterial({ color: '#09080e' });
  const scribbleL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.05), scribbleMat);
  scribbleL.position.set(-0.16, 0.52, 0.34);
  mimikyu.add(scribbleL);

  const scribbleR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.05), scribbleMat);
  scribbleR.position.set(0.16, 0.52, 0.34);
  mimikyu.add(scribbleR);

  // Glowing violet eyes peering through disguise slit (#C084FC)
  const trueEyeMat = new THREE.MeshStandardMaterial({
    color: '#a855f7',
    emissive: '#a855f7',
    emissiveIntensity: 3.5,
  });
  [-0.12, 0.12].forEach((tx) => {
    const trueEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.05), trueEyeMat);
    trueEye.position.set(tx, 0.14, 0.34);
    mimikyu.add(trueEye);
  });

  sidePropsGroup.add(mimikyu);

  // ── POKÉMON EERIE PROP 6: BLINKING CREATURE EYES IN THE MISTY SHADOWS ──
  const eerieEyeConfigs = [
    { x: -14, y: 1.6, z: -34, color: '#ffea00' }, // Amber
    { x: 15, y: 1.3, z: -58, color: '#ff1e42' },  // Crimson
    { x: -16, y: 2.2, z: -76, color: '#38bdf8' }, // Spectral Cyan
    { x: 16, y: 1.8, z: -92, color: '#c084fc' },  // Void Purple
  ];

  eerieEyeConfigs.forEach((ec) => {
    const eyePair = new THREE.Group();
    eyePair.position.set(ec.x, ec.y, ec.z);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: ec.color,
      emissive: ec.color,
      emissiveIntensity: 3.2,
    });
    [-0.18, 0.18].forEach((gx) => {
      const gEye = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.08), eyeMat);
      gEye.position.set(gx, 0, 0);
      addBoxOutline(gEye);
      eyePair.add(gEye);
    });
    sidePropsGroup.add(eyePair);
  });

  // ── POKÉMON EERIE PROP 7: LAVENDER TOWER PAGODA SPIRE IN DISTANT FOG (X = 22, Z = -135) ──
  const lavenderTower = new THREE.Group();
  lavenderTower.position.set(22, 0, -135);

  const towerStoneMat = new THREE.MeshStandardMaterial({ color: '#161426', roughness: 0.85 });
  const towerRoofMat = new THREE.MeshStandardMaterial({ color: '#2d1b4e', roughness: 0.6 });
  const towerSpireMat = new THREE.MeshStandardMaterial({
    color: '#a855f7',
    emissive: '#7c3aed',
    emissiveIntensity: 1.8,
  });

  // 5 Tiered Pagoda levels
  const tiers = [
    { baseW: 9.0, h: 5.5, roofW: 11.0, y: 0 },
    { baseW: 7.5, h: 5.0, roofW: 9.5, y: 5.5 },
    { baseW: 6.0, h: 4.5, roofW: 8.0, y: 10.5 },
    { baseW: 4.8, h: 4.0, roofW: 6.5, y: 15.0 },
    { baseW: 3.6, h: 3.5, roofW: 5.0, y: 19.0 },
  ];

  tiers.forEach((tr) => {
    // Stone level block
    const block = new THREE.Mesh(new THREE.BoxGeometry(tr.baseW, tr.h, tr.baseW), towerStoneMat);
    block.position.y = tr.y + tr.h / 2;
    addBoxOutline(block);
    lavenderTower.add(block);

    // Glowing violet window slit on front & side
    [-1.2, 1.2].forEach((wx) => {
      const windowSlit = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.2, 0.1),
        towerSpireMat
      );
      windowSlit.position.set(wx, tr.y + tr.h * 0.55, tr.baseW / 2 + 0.05);
      lavenderTower.add(windowSlit);
    });

    // Overhanging pagoda roof eaves
    const eave = new THREE.Mesh(new THREE.BoxGeometry(tr.roofW, 0.45, tr.roofW), towerRoofMat);
    eave.position.y = tr.y + tr.h;
    addBoxOutline(eave);
    lavenderTower.add(eave);
  });

  // Tower finial spire
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.35, 6.0, 6), towerSpireMat);
  spire.position.y = 25.5;
  addHullOutline(spire, 1.1);
  lavenderTower.add(spire);

  sidePropsGroup.add(lavenderTower);

  scene.add(sidePropsGroup);

  // Floating ambient dust particles
  const particleCount = 180;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 32;
    particlePositions[i + 1] = Math.random() * 9 + 0.5;
    particlePositions[i + 2] = -Math.random() * 95;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: '#43D9F2',
    size: 0.20,
    transparent: true,
    opacity: 0.75,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // 6-Stage Atmosphere Controller
  const STAGE_ATMOSPHERES = {
    1: { bg: '#0A1622', fogDensity: 0.022, railColor: '#43D9F2', light: '#43D9F2' },
    2: { bg: '#201506', fogDensity: 0.024, railColor: '#F7C56B', light: '#F7C56B' },
    3: { bg: '#2A0812', fogDensity: 0.025, railColor: '#E94462', light: '#E94462' },
    4: { bg: '#1D0B2B', fogDensity: 0.026, railColor: '#B843F2', light: '#B843F2' },
    5: { bg: '#070A12', fogDensity: 0.028, railColor: '#43D9F2', light: '#43D9F2' },
    6: { bg: '#220014', fogDensity: 0.030, railColor: '#FF2A55', light: '#FF2A55' },
  };

  function applyAtmosphere(theme, stageNumber = 1) {
    const config = STAGE_ATMOSPHERES[stageNumber] || STAGE_ATMOSPHERES[1];
    const targetBg = new THREE.Color(config.bg);
    scene.background.copy(targetBg);
    scene.fog.color.copy(targetBg);
    scene.fog.density = config.fogDensity;

    rails.forEach((r) => {
      r.material.color.set(config.railColor);
      r.material.emissive.set(config.railColor);
    });

    hemiLight.color.set(config.light);
    particleMat.color.set(config.railColor);
  }

  function setLowEffectsMode(enabled) {
    renderer.setPixelRatio(enabled ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    particles.visible = !enabled;
  }

  return {
    scene,
    camera,
    renderer,
    road,
    playerRimLight,
    sidePropsGroup,
    ferrisWheelGroup,
    carouselGroup,
    particles,
    cobbleTex,
    applyAtmosphere,
    setLowEffectsMode,
  };
}
