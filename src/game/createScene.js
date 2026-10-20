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
    ctx.fillStyle = '#070b12';
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
        const tone = 34 + Math.floor(Math.sin(r * 2 + c * 3) * 6);
        ctx.fillStyle = `rgb(${tone - 4}, ${tone}, ${tone + 8})`;
        ctx.fillRect(x + 1, y + 1, cw - 2, rh - 2);

        // Top brick highlight
        ctx.fillStyle = `rgb(${tone + 20}, ${tone + 24}, ${tone + 32})`;
        ctx.fillRect(x + 1, y + 1, cw - 2, 1);

        // Bottom shadow line
        ctx.fillStyle = '#05070a';
        ctx.fillRect(x, y + rh - 1, cw, 1);
        ctx.fillRect(x + cw - 1, y, 1, rh);

        // Subtle cyan rift specular speckle
        if ((r + c) % 5 === 0) {
          ctx.fillStyle = 'rgba(67, 217, 242, 0.28)';
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
 * Procedural dithered ground fog drift ribbon texture.
 */
function createGroundFogTexture() {
  return createPixelTexture((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y++) {
      const normY = y / h;
      const density = Math.sin(normY * Math.PI) * 0.85;
      for (let x = 0; x < w; x++) {
        const dither = ((x * 11 + y * 17) % 7) / 7;
        if (density > dither) {
          ctx.fillStyle = 'rgba(67, 217, 242, 0.22)';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, 64, 128);
}

/**
 * Builds the Three.js scene, camera, lights, track, scrolling environment chunks,
 * and deep parallax horizon landmarks.
 */
export function createScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0A1622');
  scene.fog = new THREE.FogExp2('#0A1622', 0.022);

  // Perspective camera
  const camera = new THREE.PerspectiveCamera(53, 16 / 9, 0.1, 180);
  camera.position.set(0, 5.2, 8.5);
  camera.lookAt(0, 1.2, -6);

  // High performance renderer configured for sRGB & ACES Filmic Tone Mapping
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

  // Scene lighting
  const hemiLight = new THREE.HemisphereLight(0x6be8ff, 0x121829, 0.95);
  scene.add(hemiLight);

  const moonLight = new THREE.DirectionalLight(0xd8f0ff, 1.4);
  moonLight.position.set(8, 18, 12);
  scene.add(moonLight);

  // Dedicated Player Key / Rim Light (moves with player)
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

  // Ground Fog Drift Ribbon (Y = 0.08)
  const groundFogTex = createGroundFogTexture();
  groundFogTex.wrapS = THREE.RepeatWrapping;
  groundFogTex.wrapT = THREE.RepeatWrapping;
  groundFogTex.repeat.set(2, 8);

  const groundFogMat = new THREE.MeshBasicMaterial({
    map: groundFogTex,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const groundFogRibbon = new THREE.Mesh(new THREE.PlaneGeometry(10.8, 150), groundFogMat);
  groundFogRibbon.rotation.x = -Math.PI / 2;
  groundFogRibbon.position.set(0, 0.08, -55);
  scene.add(groundFogRibbon);

  // Fairground Peat/Moss Terrain Verges flanking the road
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

  // Glowing Lane Rails (NOTE: addBoxOutline removed so rails glow purely!)
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
    scene.add(rail);
    rails.push(rail);
  });

  // Common materials for environment props
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

  // ─────────────────────────────────────────────────────────────────
  // LAYER 1: MODULAR SCROLLING PROPS (Trackside chunks across 140-unit loop)
  // Spanned from Z = +14 down to Z = -126. Wrapped in GameEngine.frame().
  // ─────────────────────────────────────────────────────────────────
  const scrollingProps = [];
  const CHUNK_SPAN = 20;
  const NUM_CHUNKS = 7; // 7 * 20 = 140 units loop!

  function buildFenceSegment(parent, zLocal) {
    [-5.6, 5.6].forEach((sideX) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.45, 0.26), fenceMat);
      post.position.set(sideX, 0.72, zLocal);
      addBoxOutline(post);
      parent.add(post);

      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, CHUNK_SPAN), fenceMat);
      rail1.position.set(sideX, 1.05, 0);
      addBoxOutline(rail1);
      parent.add(rail1);

      // Litwick lantern post at center of chunk
      const pole = new THREE.Mesh(new THREE.BoxGeometry(0.30, 4.4, 0.30), lampPostMat);
      pole.position.set(sideX > 0 ? sideX + 1.2 : sideX - 1.2, 2.2, zLocal);
      addBoxOutline(pole);
      parent.add(pole);

      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.18), lampPostMat);
      bracket.position.set(sideX > 0 ? sideX + 0.8 : sideX - 0.8, 4.2, zLocal);
      parent.add(bracket);

      const lanternBox = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.6, 0.48), lampPostMat);
      lanternBox.position.set(sideX > 0 ? sideX + 0.45 : sideX - 0.45, 3.9, zLocal);
      addBoxOutline(lanternBox);
      parent.add(lanternBox);

      // Spirit candle inside lantern
      const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.10, 0.12, 0.22, 6),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.5 })
      );
      candle.position.set(sideX > 0 ? sideX + 0.45 : sideX - 0.45, 3.76, zLocal);
      addBoxOutline(candle);
      parent.add(candle);

      const soulFlameMat = new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 3.4,
      });
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 5), soulFlameMat);
      flame.position.set(sideX > 0 ? sideX + 0.45 : sideX - 0.45, 4.02, zLocal);
      addHullOutline(flame, 1.15);
      parent.add(flame);

      // Festoon bulb catenary
      const stringBulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), goldBulbMat);
      stringBulb.position.set(sideX, 2.35, zLocal - 5);
      addHullOutline(stringBulb, 1.12);
      parent.add(stringBulb);
    });
  }

  // Chunk 0: Haunted Carnival Entrance Archway & Route Signpost with Litwick Lamps (Z = +14)
  {
    const chunk0 = new THREE.Group();
    chunk0.position.z = 14;
    buildFenceSegment(chunk0, 0);

    // Roadside Litwick Streetlamps & Pokéball Pennant Flags strictly outside the fences (X = -7.2 and X = +7.2)
    const roadsideDecor = new THREE.Group();
    const stonePillarMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.75, flatShading: true });
    const flagRedMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.5, flatShading: true });
    const flagWhiteMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.5, flatShading: true });

    [-7.2, 7.2].forEach((px) => {
      // Litwick Streetlamp Base & Wax Pillar
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 1.4, 6), stonePillarMat);
      lampBase.position.set(px, 0.7, 0);
      addBoxOutline(lampBase);
      roadsideDecor.add(lampBase);

      const litwickWax = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.28, 0.9, 8),
        new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.3, flatShading: true })
      );
      litwickWax.position.set(px, 1.85, 0);
      addHullOutline(litwickWax, 1.1);
      roadsideDecor.add(litwickWax);

      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.14, 0.42, 6),
        new THREE.MeshStandardMaterial({ color: '#c084fc', emissive: '#a855f7', emissiveIntensity: 3.2 })
      );
      flame.position.set(px, 2.45, 0);
      addHullOutline(flame, 1.15);
      roadsideDecor.add(flame);

      // Pokéball Pennant Flagstaff
      const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.2, 6), lampPostMat);
      flagPole.position.set(px > 0 ? px + 1.2 : px - 1.2, 2.1, -1.8);
      addBoxOutline(flagPole);
      roadsideDecor.add(flagPole);

      // Dual-color triangular pennant flag (Red top, white bottom)
      const flagTop = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.0, 3), flagRedMat);
      flagTop.position.set(px > 0 ? px + 1.6 : px - 1.6, 3.6, -1.8);
      flagTop.rotation.z = px > 0 ? -Math.PI / 2 : Math.PI / 2;
      roadsideDecor.add(flagTop);

      const flagBtm = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.9, 3), flagWhiteMat);
      flagBtm.position.set(px > 0 ? px + 1.6 : px - 1.6, 3.0, -1.8);
      flagBtm.rotation.z = px > 0 ? -Math.PI / 2 : Math.PI / 2;
      roadsideDecor.add(flagBtm);
    });

    chunk0.add(roadsideDecor);

    // Route Signpost
    const routeSign = new THREE.Group();
    routeSign.position.set(7.2, 0, -2);
    const signPost = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.6, 0.18), fenceMat);
    signPost.position.y = 1.3;
    addBoxOutline(signPost);
    routeSign.add(signPost);

    const plankMat = new THREE.MeshStandardMaterial({ color: '#d8c29d', roughness: 0.8 });
    const plank1 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.36, 0.08), plankMat);
    plank1.position.set(0.7, 2.2, 0.1);
    plank1.rotation.z = -0.06;
    addBoxOutline(plank1);
    routeSign.add(plank1);
    chunk0.add(routeSign);

    scene.add(chunk0);
    scrollingProps.push(chunk0);
  }

  // Chunk 1: Trevenant & Pumpkaboo Haunted Grove (Z = -6)
  {
    const chunk1 = new THREE.Group();
    chunk1.position.z = -6;
    buildFenceSegment(chunk1, 0);

    const grove = new THREE.Group();
    grove.position.set(-11.5, 0, 0);

    // Gnarled spooky Trevenant tree
    const deadWoodMat = new THREE.MeshStandardMaterial({ color: '#1c1917', roughness: 0.95, flatShading: true });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.9, 4.8, 6), deadWoodMat);
    trunk.position.y = 2.4;
    addBoxOutline(trunk);
    grove.add(trunk);

    const branchL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.3, 2.6, 5), deadWoodMat);
    branchL.position.set(-0.8, 4.2, 0);
    branchL.rotation.z = 0.65;
    addBoxOutline(branchL);
    grove.add(branchL);

    const branchR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.8, 5), deadWoodMat);
    branchR.position.set(0.9, 4.4, 0);
    branchR.rotation.z = -0.75;
    addBoxOutline(branchR);
    grove.add(branchR);

    const eyeKnot = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.14, 0.12),
      new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 3.2 })
    );
    eyeKnot.position.set(0, 2.8, 0.55);
    grove.add(eyeKnot);
    chunk1.add(grove);

    // Carved Glowing Pumpkaboo Jack-o'-Lanterns along the fence
    const pumpkinOrangeMat = new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.7, flatShading: true });
    const pumpkinVioletMat = new THREE.MeshStandardMaterial({ color: '#7c3aed', roughness: 0.7, flatShading: true });
    const pumpkinGlowMat = new THREE.MeshStandardMaterial({ color: '#facc15', emissive: '#eab308', emissiveIntensity: 3.0 });
    const batEarMat = new THREE.MeshStandardMaterial({ color: '#18181b', flatShading: true });

    [
      { x: -5.5, z: -3.5, mat: pumpkinOrangeMat },
      { x: -5.4, z: 3.5, mat: pumpkinVioletMat },
      { x: 5.4, z: -1.0, mat: pumpkinOrangeMat },
    ].forEach((p) => {
      const pumpkaboo = new THREE.Group();
      pumpkaboo.position.set(p.x, 0.4, p.z);

      // Segmented pumpkin body
      const pBody = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 8), p.mat);
      pBody.scale.set(1.15, 0.85, 1.15);
      addHullOutline(pBody, 1.1);
      pumpkaboo.add(pBody);

      // Glowing carved eyes
      [-0.12, 0.12].forEach((ex) => {
        const pEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.06), pumpkinGlowMat);
        pEye.position.set(ex, 0.05, 0.36);
        pumpkaboo.add(pEye);
      });

      // Cute Bat-Ear Stems on top
      [-0.16, 0.16].forEach((bx) => {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 4), batEarMat);
        ear.position.set(bx, 0.42, 0);
        ear.rotation.z = bx > 0 ? -0.4 : 0.4;
        pumpkaboo.add(ear);
      });

      chunk1.add(pumpkaboo);
    });

    scene.add(chunk1);
    scrollingProps.push(chunk1);
  }

  // Chunk 2: Mimikyu Prize Booth (Z = -26)
  {
    const chunk2 = new THREE.Group();
    chunk2.position.z = -26;
    buildFenceSegment(chunk2, 0);

    const booth = new THREE.Group();
    booth.position.set(-9.5, 0, 0);
    booth.rotation.y = Math.PI / 2;

    const baseBooth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 2.4), fenceMat);
    baseBooth.position.y = 0.55;
    addBoxOutline(baseBooth);
    booth.add(baseBooth);

    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.15, 2.6),
      new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.6 })
    );
    counter.position.y = 1.15;
    addBoxOutline(counter);
    booth.add(counter);

    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.22, 2.8),
      new THREE.MeshStandardMaterial({ color: '#9e1b32', roughness: 0.65 })
    );
    awning.position.set(0, 3.4, 0);
    awning.rotation.x = 0.12;
    addBoxOutline(awning);
    booth.add(awning);

    // Mimikyu on counter: tilted head, 2 ears (one bent), crayoned belly face, glowing eyes under hem
    const mimikyu = new THREE.Group();
    mimikyu.position.set(0, 1.25, 0);

    const burlapMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.85, flatShading: true });
    const earTipMat = new THREE.MeshStandardMaterial({ color: '#18181b', flatShading: true });
    const crayonFaceMat = new THREE.MeshStandardMaterial({ color: '#09090b', flatShading: true });
    const hemGlowEyeMat = new THREE.MeshStandardMaterial({ color: '#c084fc', emissive: '#9333ea', emissiveIntensity: 3.5 });

    const mBody = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.85, 6), burlapMat);
    mBody.position.y = 0.42;
    addHullOutline(mBody, 1.08);
    mimikyu.add(mBody);

    // Crayoned eyes & mouth on belly
    [-0.10, 0.10].forEach((cx) => {
      const cEye = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), crayonFaceMat);
      cEye.position.set(cx, 0.42, 0.32);
      mimikyu.add(cEye);
    });
    const cMouth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), crayonFaceMat);
    cMouth.position.set(0, 0.30, 0.34);
    mimikyu.add(cMouth);

    // Glowing purple eyes under its hem!
    [-0.10, 0.10].forEach((hx) => {
      const hEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), hemGlowEyeMat);
      hEye.position.set(hx, 0.06, 0.32);
      mimikyu.add(hEye);
    });

    // Tilted Head with 2 ears (one bent)
    const mHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 6, 6), burlapMat);
    mHead.position.set(0.04, 0.95, 0);
    mHead.rotation.z = -0.22;
    addHullOutline(mHead, 1.08);
    mimikyu.add(mHead);

    const earStraight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), earTipMat);
    earStraight.position.set(-0.16, 1.30, 0);
    earStraight.rotation.z = 0.15;
    addBoxOutline(earStraight);
    mimikyu.add(earStraight);

    const earBent = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.08), earTipMat);
    earBent.position.set(0.20, 1.25, 0);
    earBent.rotation.z = -0.65;
    addBoxOutline(earBent);
    mimikyu.add(earBent);

    booth.add(mimikyu);

    chunk2.add(booth);
    scene.add(chunk2);
    scrollingProps.push(chunk2);
  }

  // Chunk 3: Drifloon & Pikachu Balloon Cart (Z = -46)
  {
    const chunk3 = new THREE.Group();
    chunk3.position.z = -46;
    buildFenceSegment(chunk3, 0);

    const wagon = new THREE.Group();
    wagon.position.set(12.5, 0, 0);

    const wagonWoodMat = new THREE.MeshStandardMaterial({ color: '#271c19', roughness: 0.9, flatShading: true });
    const wagonBase = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.2, 2.2), wagonWoodMat);
    wagonBase.position.y = 0.6;
    addBoxOutline(wagonBase);
    wagon.add(wagonBase);

    // 4 Wagon wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#78350f', metalness: 0.4, roughness: 0.6 });
    [[-1.4, -0.9], [1.4, -0.9], [-1.4, 0.9], [1.4, 0.9]].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 8), wheelMat);
      wheel.position.set(wx, 0.42, wz);
      wheel.rotation.z = Math.PI / 2;
      wagon.add(wheel);
    });

    // Complete Drifloon Balloons
    const drifloonPurpleMat = new THREE.MeshStandardMaterial({ color: '#7e22ce', roughness: 0.35, flatShading: true });
    const drifloonCloudMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.6, flatShading: true });
    const drifloonYellowMat = new THREE.MeshStandardMaterial({ color: '#facc15', emissive: '#eab308', emissiveIntensity: 1.8 });

    [-0.8, 0.8].forEach((dx) => {
      const drifloon = new THREE.Group();
      drifloon.position.set(dx, 4.6, dx > 0 ? 0.3 : -0.3);

      const dBody = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), drifloonPurpleMat);
      dBody.scale.set(1.0, 1.15, 1.0);
      addHullOutline(dBody, 1.08);
      drifloon.add(dBody);

      const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 6), drifloonCloudMat);
      cloud.position.y = 0.62;
      drifloon.add(cloud);

      // Yellow X tape mouth
      const xTapeH = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.04), drifloonYellowMat);
      xTapeH.position.set(0, 0, 0.54);
      drifloon.add(xTapeH);

      const xTapeV = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.04), drifloonYellowMat);
      xTapeV.position.set(0, 0, 0.54);
      drifloon.add(xTapeV);

      // Dangling string & heart feet
      [-0.18, 0.18].forEach((fx) => {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.06), drifloonYellowMat);
        foot.position.set(fx, -0.85, 0);
        foot.rotation.z = Math.PI / 4;
        drifloon.add(foot);
      });

      wagon.add(drifloon);
    });

    // Pikachu Balloon
    const pikaYellowMat = new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.3, flatShading: true });
    const pikaRedMat = new THREE.MeshStandardMaterial({ color: '#ef4444', flatShading: true });
    const pikaBlackMat = new THREE.MeshStandardMaterial({ color: '#18181b', flatShading: true });

    const pikaBalloon = new THREE.Group();
    pikaBalloon.position.set(0, 5.1, 0);

    const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.62, 8, 8), pikaYellowMat);
    addHullOutline(pHead, 1.08);
    pikaBalloon.add(pHead);

    // Red cheeks
    [-0.38, 0.38].forEach((cx) => {
      const cheek = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 6), pikaRedMat);
      cheek.position.set(cx, -0.1, 0.56);
      cheek.rotation.x = Math.PI / 2;
      pikaBalloon.add(cheek);
    });

    // Black-tipped pointed ears
    [-0.32, 0.32].forEach((ex) => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.55, 5), pikaYellowMat);
      ear.position.set(ex, 0.65, 0);
      ear.rotation.z = ex > 0 ? -0.45 : 0.45;
      addHullOutline(ear, 1.1);
      pikaBalloon.add(ear);

      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 5), pikaBlackMat);
      tip.position.set(ex > 0 ? ex + 0.12 : ex - 0.12, 0.88, 0);
      tip.rotation.z = ex > 0 ? -0.45 : 0.45;
      pikaBalloon.add(tip);
    });

    wagon.add(pikaBalloon);

    chunk3.add(wagon);
    scene.add(chunk3);
    scrollingProps.push(chunk3);
  }

  // Chunk 4: Open-Air Giant Cartoon Gengar Balloon-Totem & Ghost Lantern Shrine (Z = -66, X = -13.5)
  {
    const chunk4 = new THREE.Group();
    chunk4.position.z = -66;
    buildFenceSegment(chunk4, 0);

    const gengarShrine = new THREE.Group();
    gengarShrine.position.set(-13.5, 0, 0);

    const stoneShrineMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.8,
      flatShading: true,
    });
    const gengarPurpleMat = new THREE.MeshStandardMaterial({
      color: '#4c1d95',
      roughness: 0.45,
      flatShading: true,
    });
    const gengarEyeMat = new THREE.MeshStandardMaterial({
      color: '#ff1e42',
      emissive: '#ff1e42',
      emissiveIntensity: 3.8,
    });
    const gengarGrinMat = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.2,
      flatShading: true,
    });
    const soulFlameMat = new THREE.MeshStandardMaterial({
      color: '#c084fc',
      emissive: '#a855f7',
      emissiveIntensity: 3.2,
    });

    // 1. Ancient Stone Altar Base (Open-air, zero tunnel)
    const altar = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.9, 3.8), stoneShrineMat);
    altar.position.y = 0.45;
    addBoxOutline(altar);
    gengarShrine.add(altar);

    // 4 Ghost Lantern Pedestals surrounding the shrine
    [[-1.8, -1.4], [1.8, -1.4], [-1.8, 1.4], [1.8, 1.4]].forEach(([px, pz]) => {
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.4, 0.45), stoneShrineMat);
      ped.position.set(px, 1.15, pz);
      addBoxOutline(ped);
      gengarShrine.add(ped);

      const lampWax = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.18, 0.5, 6),
        new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.3 })
      );
      lampWax.position.set(px, 2.05, pz);
      addHullOutline(lampWax, 1.1);
      gengarShrine.add(lampWax);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.35, 5), soulFlameMat);
      flame.position.set(px, 2.45, pz);
      addHullOutline(flame, 1.15);
      gengarShrine.add(flame);
    });

    // 2. Giant Floating Cartoon Gengar Balloon-Totem (Open-air at Y = 4.6)
    const totem = new THREE.Group();
    totem.position.set(0, 4.6, 0);

    const totemBody = new THREE.Mesh(new THREE.SphereGeometry(1.65, 8, 8), gengarPurpleMat);
    totemBody.scale.set(1.15, 1.05, 1.1);
    addHullOutline(totemBody, 1.08);
    totem.add(totemBody);

    // Pointed 3D Gengar Ears
    [-1.2, 1.2].forEach((ex) => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.4, 5), gengarPurpleMat);
      ear.position.set(ex, 1.45, 0);
      ear.rotation.z = ex > 0 ? -0.42 : 0.42;
      addHullOutline(ear, 1.1);
      totem.add(ear);
    });

    // Spiky Dorsal Crest
    [-0.55, 0, 0.55].forEach((sy) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 4), gengarPurpleMat);
      spike.position.set(0, sy + 0.6, 1.4);
      spike.rotation.x = Math.PI / 2;
      totem.add(spike);
    });

    // Slanted Crimson Gengar Eyes
    [-0.62, 0.62].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.28, 0.15), gengarEyeMat);
      eye.position.set(ex, 0.35, -1.62);
      eye.rotation.z = ex > 0 ? -0.32 : 0.32;
      addBoxOutline(eye);
      totem.add(eye);
    });

    // Wide Mischievous Cartoon Grin
    const grin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.38, 0.12), gengarGrinMat);
    grin.position.set(0, -0.45, -1.62);
    addBoxOutline(grin);
    totem.add(grin);

    // Tethers tying the totem to the stone altar
    [-1.2, 1.2].forEach((tx) => {
      const tether = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 3.8, 4),
        new THREE.MeshBasicMaterial({ color: '#120b1d' })
      );
      tether.position.set(tx, -1.9, 0);
      totem.add(tether);
    });

    gengarShrine.add(totem);

    chunk4.add(gengarShrine);
    scene.add(chunk4);
    scrollingProps.push(chunk4);
  }

  // Chunk 5: Voltorb & Pokéball Target Gallery (Z = -86)
  {
    const chunk5 = new THREE.Group();
    chunk5.position.z = -86;
    buildFenceSegment(chunk5, 0);

    const gallery = new THREE.Group();
    gallery.position.set(9.8, 0, 0);
    gallery.rotation.y = -Math.PI / 2;

    const baseBooth = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 2.4), fenceMat);
    baseBooth.position.y = 0.55;
    addBoxOutline(baseBooth);
    gallery.add(baseBooth);

    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.22, 2.8),
      new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.65 })
    );
    awning.position.set(0, 3.4, 0);
    awning.rotation.x = 0.12;
    addBoxOutline(awning);
    gallery.add(awning);

    // Tiered target shelf with Pokéball and Voltorb targets
    const targetRedMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4 });
    const targetWhiteMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 });
    const targetCenterMat = new THREE.MeshStandardMaterial({ color: '#18181b' });
    const starGoldMat = new THREE.MeshStandardMaterial({ color: '#facc15', emissive: '#eab308', emissiveIntensity: 2.2 });

    [-1.2, 0, 1.2].forEach((tx, idx) => {
      const targetGroup = new THREE.Group();
      targetGroup.position.set(tx, 1.6 + (idx === 1 ? 0.35 : 0), 0.2);

      // Pokéball target sphere
      const topHemi = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), targetRedMat);
      targetGroup.add(topHemi);

      const btmHemi = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), targetWhiteMat);
      targetGroup.add(btmHemi);

      const centerBand = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 6, 12), targetCenterMat);
      centerBand.rotation.x = Math.PI / 2;
      targetGroup.add(centerBand);

      // Star target above
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), starGoldMat);
      star.position.y = 0.52;
      targetGroup.add(star);

      gallery.add(targetGroup);
    });

    chunk5.add(gallery);
    scene.add(chunk5);
    scrollingProps.push(chunk5);
  }

  // Chunk 6: Poké-Aid Haunted Healing Pavilion (Z = -106)
  {
    const chunk6 = new THREE.Group();
    chunk6.position.z = -106;
    buildFenceSegment(chunk6, 0);

    const pavilion = new THREE.Group();
    pavilion.position.set(-10.2, 0, 0);
    pavilion.rotation.y = Math.PI / 2;

    const pavilionMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.7, flatShading: true });
    const base = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 2.6), pavilionMat);
    base.position.y = 0.55;
    addBoxOutline(base);
    pavilion.add(base);

    // Striped pavilion roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.2, 2.2, 8), tentMat);
    roof.position.y = 3.2;
    addHullOutline(roof, 1.05);
    pavilion.add(roof);

    // Glowing 3D Pokéball Neon Emblem on roof
    const emblemGroup = new THREE.Group();
    emblemGroup.position.set(0, 4.4, 0);

    const ballRed = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 2.5 })
    );
    emblemGroup.add(ballRed);

    const ballWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 8, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: '#f8fafc', emissive: '#e2e8f0', emissiveIntensity: 1.5 })
    );
    emblemGroup.add(ballWhite);

    pavilion.add(emblemGroup);

    // Glowing cyan healing vitality capsules
    [-1.2, 1.2].forEach((cx) => {
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.85, 8),
        new THREE.MeshStandardMaterial({
          color: '#43D9F2',
          emissive: '#43D9F2',
          emissiveIntensity: 2.8,
          transparent: true,
          opacity: 0.9,
        })
      );
      tube.position.set(cx, 1.65, 0);
      addBoxOutline(tube);
      pavilion.add(tube);
    });

    chunk6.add(pavilion);
    scene.add(chunk6);
    scrollingProps.push(chunk6);
  }

  // ─────────────────────────────────────────────────────────────────
  // LAYER 2: DISTANT LANDMARKS (Deep parallax horizon layer)
  // ─────────────────────────────────────────────────────────────────
  const distantLandmarks = new THREE.Group();

  // 1. Illuminated Rotating Poké-Ferris Wheel at (X = 23, Y = 14, Z = -82)
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

  for (let s = 0; s < 8; s++) {
    const angle = (s / 8) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.24, 26, 0.24), ferrisMetalMat);
    spoke.rotation.z = angle;
    ferrisWheelGroup.add(spoke);
  }

  for (let b = 0; b < 16; b++) {
    const angle = (b / 16) * Math.PI * 2;
    const bulbCube = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.55, 0.55),
      b % 2 === 0 ? goldBulbMat : redBulbMat
    );
    bulbCube.position.set(Math.cos(angle) * 13, Math.sin(angle) * 13, 0);
    ferrisWheelGroup.add(bulbCube);
  }

  // 8 Outlined passenger gondolas
  for (let g = 0; g < 8; g++) {
    const angle = (g / 8) * Math.PI * 2;
    const gondola = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.4, 1.2),
      new THREE.MeshStandardMaterial({ color: g % 2 === 0 ? '#ef4444' : '#3b82f6', roughness: 0.5 })
    );
    gondola.position.set(Math.cos(angle) * 13, Math.sin(angle) * 13 - 0.7, 0);
    addBoxOutline(gondola);
    ferrisWheelGroup.add(gondola);
  }

  // Glowing 3D Pokéball Center Hub
  const ferrisHub = new THREE.Group();
  const hubRed = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 2.2 })
  );
  hubRed.rotation.x = Math.PI / 2;
  ferrisHub.add(hubRed);

  const hubWhite = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 10, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: '#f8fafc', emissive: '#cbd5e1', emissiveIntensity: 1.2 })
  );
  hubWhite.rotation.x = Math.PI / 2;
  ferrisHub.add(hubWhite);

  const hubCenterButton = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.65, 0.4, 8),
    new THREE.MeshStandardMaterial({ color: '#f8fafc', emissive: '#ffffff', emissiveIntensity: 3.0 })
  );
  hubCenterButton.rotation.x = Math.PI / 2;
  hubCenterButton.position.z = 2.0;
  ferrisHub.add(hubCenterButton);
  ferrisWheelGroup.add(ferrisHub);

  const ferrisRig = new THREE.Group();
  ferrisWheelGroup.position.y = 14;
  ferrisRig.add(ferrisWheelGroup);

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 18, 0.7), ferrisMetalMat);
  legL.position.set(-5.5, 8, 0);
  legL.rotation.z = 0.26;
  ferrisRig.add(legL);

  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 18, 0.7), ferrisMetalMat);
  legR.position.set(5.5, 8, 0);
  legR.rotation.z = -0.26;
  ferrisRig.add(legR);

  ferrisRig.position.set(23, 0, -82);
  distantLandmarks.add(ferrisRig);

  // 2. Rotating Carousel with Ponyta & Pikachu Mounts at (X = -21, Z = -68)
  const carouselRig = new THREE.Group();
  carouselRig.position.set(-21, 0, -68);

  const carouselPlatform = new THREE.Mesh(
    new THREE.CylinderGeometry(6.2, 6.5, 0.7, 14),
    new THREE.MeshStandardMaterial({ color: '#241a22', roughness: 0.8 })
  );
  carouselPlatform.position.y = 0.35;
  addBoxOutline(carouselPlatform);
  carouselRig.add(carouselPlatform);

  const carouselGroup = new THREE.Group();
  carouselGroup.position.y = 0.7;

  const centerPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 4.6, 10),
    new THREE.MeshStandardMaterial({ color: '#1a1f30', metalness: 0.8, roughness: 0.2 })
  );
  centerPillar.position.y = 2.3;
  addBoxOutline(centerPillar);
  carouselGroup.add(centerPillar);

  const carouselRoof = new THREE.Mesh(new THREE.ConeGeometry(6.6, 3.2, 12), tentMat);
  carouselRoof.position.y = 5.2;
  addHullOutline(carouselRoof, 1.05);
  carouselGroup.add(carouselRoof);

  const starFinial = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), goldBulbMat);
  starFinial.position.y = 7.1;
  carouselGroup.add(starFinial);

  // 6 Brass poles holding recognizable Ponyta & Pikachu mounts
  const brassPoleMat = new THREE.MeshStandardMaterial({ color: '#d97706', metalness: 0.8, roughness: 0.2 });
  const ponytaBodyMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 });
  const ponytaManeMat = new THREE.MeshStandardMaterial({ color: '#f97316', emissive: '#ea580c', emissiveIntensity: 2.2 });
  const pikaMountMat = new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.4 });

  for (let m = 0; m < 6; m++) {
    const angle = (m / 6) * Math.PI * 2;
    const px = Math.cos(angle) * 4.4;
    const pz = Math.sin(angle) * 4.4;

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.6, 6), brassPoleMat);
    pole.position.set(px, 2.3, pz);
    carouselGroup.add(pole);

    if (m % 2 === 0) {
      // Ponyta mount (white body + fiery orange mane)
      const ponyta = new THREE.Group();
      ponyta.position.set(px, 1.8, pz);
      ponyta.rotation.y = angle + Math.PI / 2;

      const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 1.1), ponytaBodyMat);
      addBoxOutline(pBody);
      ponyta.add(pBody);

      const pNeck = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.35), ponytaBodyMat);
      pNeck.position.set(0, 0.4, 0.4);
      pNeck.rotation.x = -0.3;
      ponyta.add(pNeck);

      const pMane = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.5), ponytaManeMat);
      pMane.position.set(0, 0.55, 0.3);
      ponyta.add(pMane);

      carouselGroup.add(ponyta);
    } else {
      // Pikachu mount (yellow body + ears)
      const pika = new THREE.Group();
      pika.position.set(px, 1.8, pz);
      pika.rotation.y = angle + Math.PI / 2;

      const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.75), pikaMountMat);
      addBoxOutline(pBody);
      pika.add(pBody);

      [-0.18, 0.18].forEach((ex) => {
        const pEar = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 4), pikaMountMat);
        pEar.position.set(ex, 0.45, 0.2);
        pEar.rotation.z = ex > 0 ? -0.3 : 0.3;
        pika.add(pEar);
      });

      carouselGroup.add(pika);
    }
  }

  carouselRig.add(carouselGroup);
  distantLandmarks.add(carouselRig);

  // 3. Continuous Ghost-Coaster Track & Haunter Coaster Train at (X = -22, Z = -95)
  const coasterGroup = new THREE.Group();
  coasterGroup.position.set(-22, 0, -95);
  const coasterMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.7, metalness: 0.4 });
  const coasterTrackCyan = new THREE.MeshStandardMaterial({
    color: '#43D9F2',
    emissive: '#43D9F2',
    emissiveIntensity: 2.2,
  });

  const trestles = [
    { x: -5, y: 7, z: 20 },
    { x: 0, y: 13, z: 8 },
    { x: 6, y: 9, z: -6 },
    { x: 11, y: 15, z: -20 },
  ];

  trestles.forEach((tp) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.2, tp.y, 1.2), coasterMat);
    tower.position.set(tp.x, tp.y / 2, tp.z);
    addBoxOutline(tower);
    coasterGroup.add(tower);
  });

  // Continuous connected angled track beams between towers
  for (let i = 0; i < trestles.length - 1; i++) {
    const t1 = trestles[i];
    const t2 = trestles[i + 1];
    const dx = t2.x - t1.x;
    const dy = t2.y - t1.y;
    const dz = t2.z - t1.z;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const trackBeam = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, len), coasterTrackCyan);
    trackBeam.position.set((t1.x + t2.x) / 2, (t1.y + t2.y) / 2 + 0.15, (t1.z + t2.z) / 2);
    trackBeam.lookAt(t2.x, t2.y + 0.15, t2.z);
    coasterGroup.add(trackBeam);
  }

  // Multi-car Haunter Coaster Train riding along the first incline
  const haunterPurpleMat = new THREE.MeshStandardMaterial({ color: '#581c87', roughness: 0.5, flatShading: true });
  const haunterEyeMat = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 3.5 });

  const trainLead = new THREE.Group();
  trainLead.position.set(-1.8, 10.8, 12.5);
  trainLead.rotation.x = -0.45;
  trainLead.rotation.y = 0.35;

  const leadCar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.75, 1.4), haunterPurpleMat);
  addBoxOutline(leadCar);
  trainLead.add(leadCar);

  // Haunter face spikes and glowing eyes
  [-0.3, 0.3].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.08), haunterEyeMat);
    eye.position.set(ex, 0.15, 0.72);
    trainLead.add(eye);
  });
  coasterGroup.add(trainLead);

  // Second coaster car
  const trainCar2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.65, 1.2), coasterMat);
  trainCar2.position.set(-3.2, 9.2, 15.6);
  trainCar2.rotation.x = -0.45;
  trainCar2.rotation.y = 0.35;
  addBoxOutline(trainCar2);
  coasterGroup.add(trainCar2);

  distantLandmarks.add(coasterGroup);

  // 4. Grand Big Top Circus Tent at (X = -12, Z = -122)
  const bigTopGroup = new THREE.Group();
  bigTopGroup.position.set(-12, 0, -122);
  const bigConeL = new THREE.Mesh(new THREE.ConeGeometry(9.0, 12.0, 12), tentMat);
  bigConeL.position.set(-6, 10.0, 0);
  addHullOutline(bigConeL, 1.04);
  bigTopGroup.add(bigConeL);

  const bigConeR = new THREE.Mesh(new THREE.ConeGeometry(9.0, 12.0, 12), tentMat);
  bigConeR.position.set(6, 10.0, 0);
  addHullOutline(bigConeR, 1.04);
  bigTopGroup.add(bigConeR);
  distantLandmarks.add(bigTopGroup);

  // 5. Lavender Pagoda Spire at (X = 22, Z = -138)
  const lavenderTower = new THREE.Group();
  lavenderTower.position.set(22, 0, -138);
  const towerStoneMat = new THREE.MeshStandardMaterial({ color: '#161426', roughness: 0.85 });
  const towerSpireMat = new THREE.MeshStandardMaterial({
    color: '#a855f7',
    emissive: '#7c3aed',
    emissiveIntensity: 1.8,
  });

  [
    { baseW: 9.0, h: 5.5, y: 0 },
    { baseW: 7.5, h: 5.0, y: 5.5 },
    { baseW: 6.0, h: 4.5, y: 10.5 },
    { baseW: 4.8, h: 4.0, y: 15.0 },
  ].forEach((tr) => {
    const block = new THREE.Mesh(new THREE.BoxGeometry(tr.baseW, tr.h, tr.baseW), towerStoneMat);
    block.position.y = tr.y + tr.h / 2;
    addBoxOutline(block);
    lavenderTower.add(block);
  });
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.35, 6.0, 6), towerSpireMat);
  spire.position.y = 22.0;
  lavenderTower.add(spire);
  distantLandmarks.add(lavenderTower);

  scene.add(distantLandmarks);

  // Ambient dust particles
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
    groundFogRibbon.visible = !enabled;
  }

  return {
    scene,
    camera,
    renderer,
    road,
    groundFogRibbon,
    groundFogTex,
    playerRimLight,
    scrollingProps,
    distantLandmarks,
    ferrisWheelGroup,
    carouselGroup,
    particles,
    cobbleTex,
    applyAtmosphere,
    setLowEffectsMode,
  };
}
