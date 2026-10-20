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

  // Chunk 0: Initial track segment (Z = +14) with Route Signpost
  {
    const chunk0 = new THREE.Group();
    chunk0.position.z = 14;
    buildFenceSegment(chunk0, 0);

    const routeSign = new THREE.Group();
    routeSign.position.set(6.8, 0, 0);
    const signPost = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.6, 0.18), fenceMat);
    signPost.position.y = 1.3;
    addBoxOutline(signPost);
    routeSign.add(signPost);

    const plankMat = new THREE.MeshStandardMaterial({ color: '#d8c29d', roughness: 0.8 });
    const plank1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.32, 0.08), plankMat);
    plank1.position.set(0.65, 2.2, 0.1);
    plank1.rotation.z = -0.08;
    addBoxOutline(plank1);
    routeSign.add(plank1);
    chunk0.add(routeSign);

    scene.add(chunk0);
    scrollingProps.push(chunk0);
  }

  // Chunk 1: Trevenant Gnarled Ghost-Wood (Z = -6)
  {
    const chunk1 = new THREE.Group();
    chunk1.position.z = -6;
    buildFenceSegment(chunk1, 0);

    const tree = new THREE.Group();
    tree.position.set(-11.5, 0, 0);
    const deadWoodMat = new THREE.MeshStandardMaterial({ color: '#1a1820', roughness: 0.95 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.85, 4.8, 6), deadWoodMat);
    trunk.position.y = 2.4;
    addBoxOutline(trunk);
    tree.add(trunk);

    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.8, 5), deadWoodMat);
    branch.position.set(0.9, 4.4, 0);
    branch.rotation.z = -0.75;
    addBoxOutline(branch);
    tree.add(branch);

    const eyeKnot = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.12, 0.1),
      new THREE.MeshStandardMaterial({ color: '#ff1e42', emissive: '#ff1e42', emissiveIntensity: 2.8 })
    );
    eyeKnot.position.set(0, 2.8, 0.55);
    tree.add(eyeKnot);
    chunk1.add(tree);

    scene.add(chunk1);
    scrollingProps.push(chunk1);
  }

  // Chunk 2: PRIZES Carnival Game Booth & Mimikyu Decoy (Z = -26)
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

    // Mimikyu on counter
    const burlapMat = new THREE.MeshStandardMaterial({ color: '#c4ad7a', roughness: 0.9 });
    const mimikyuBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.85, 0.65), burlapMat);
    mimikyuBody.position.set(0, 1.58, 0);
    addBoxOutline(mimikyuBody);
    booth.add(mimikyuBody);

    chunk2.add(booth);
    scene.add(chunk2);
    scrollingProps.push(chunk2);
  }

  // Chunk 3: DRIFLOON GHOST-BALLOON KIOSK (Z = -46)
  {
    const chunk3 = new THREE.Group();
    chunk3.position.z = -46;
    buildFenceSegment(chunk3, 0);

    const kiosk = new THREE.Group();
    kiosk.position.set(12.5, 0, 0);

    const cartWoodMat = new THREE.MeshStandardMaterial({ color: '#271c19', roughness: 0.9 });
    const cartBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 2.2), cartWoodMat);
    cartBase.position.y = 0.6;
    addBoxOutline(cartBase);
    kiosk.add(cartBase);

    // Drifloon ghost balloons
    const drifloonPurpleMat = new THREE.MeshStandardMaterial({
      color: '#8b5cf6',
      emissive: '#4c1d95',
      emissiveIntensity: 0.6,
      roughness: 0.35,
    });
    [-0.8, 0.8].forEach((dx) => {
      const drifloon = new THREE.Group();
      drifloon.position.set(dx, 4.8, 0);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), drifloonPurpleMat);
      head.scale.set(1.0, 1.15, 1.0);
      addHullOutline(head, 1.08);
      drifloon.add(head);

      const tuft = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 6, 6),
        new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 })
      );
      tuft.position.y = 0.72;
      drifloon.add(tuft);
      kiosk.add(drifloon);
    });

    chunk3.add(kiosk);
    scene.add(chunk3);
    scrollingProps.push(chunk3);
  }

  // Chunk 4: GENGAR PHANTOM MANOR FACADE (Z = -66)
  {
    const chunk4 = new THREE.Group();
    chunk4.position.z = -66;
    buildFenceSegment(chunk4, 0);

    const manor = new THREE.Group();
    manor.position.set(-16.5, 0, 0);

    const manorWallMat = new THREE.MeshStandardMaterial({
      color: '#1a0d28',
      roughness: 0.8,
      flatShading: true,
    });
    const mainFacade = new THREE.Mesh(new THREE.BoxGeometry(9.5, 7.5, 5.0), manorWallMat);
    mainFacade.position.y = 3.75;
    addBoxOutline(mainFacade);
    manor.add(mainFacade);

    // Glowing Gengar red eyes
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
      manor.add(eye);
    });

    // Dark tunnel mouth
    const tunnel = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 3.2, 3.5),
      new THREE.MeshBasicMaterial({ color: '#030206' })
    );
    tunnel.position.set(0, 1.6, 1.5);
    addBoxOutline(tunnel);
    manor.add(tunnel);

    chunk4.add(manor);
    scene.add(chunk4);
    scrollingProps.push(chunk4);
  }

  // Chunk 5: BALLOONS CARNIVAL TARGET BOOTH (Z = -86)
  {
    const chunk5 = new THREE.Group();
    chunk5.position.z = -86;
    buildFenceSegment(chunk5, 0);

    const booth = new THREE.Group();
    booth.position.set(9.8, 0, 0);
    booth.rotation.y = -Math.PI / 2;

    const baseBooth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 2.4), fenceMat);
    baseBooth.position.y = 0.55;
    addBoxOutline(baseBooth);
    booth.add(baseBooth);

    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.22, 2.8),
      new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.65 })
    );
    awning.position.set(0, 3.4, 0);
    awning.rotation.x = 0.12;
    addBoxOutline(awning);
    booth.add(awning);

    chunk5.add(booth);
    scene.add(chunk5);
    scrollingProps.push(chunk5);
  }

  // Chunk 6: POKÉ-AID & TICKETS BOOTHS (Z = -106)
  {
    const chunk6 = new THREE.Group();
    chunk6.position.z = -106;
    buildFenceSegment(chunk6, 0);

    const aidBooth = new THREE.Group();
    aidBooth.position.set(-10.2, 0, 0);
    aidBooth.rotation.y = Math.PI / 2;

    const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 2.4), fenceMat);
    base.position.y = 0.55;
    addBoxOutline(base);
    aidBooth.add(base);

    // Glowing cyan vitality tube
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.7, 8),
      new THREE.MeshStandardMaterial({
        color: '#43D9F2',
        emissive: '#43D9F2',
        emissiveIntensity: 2.5,
      })
    );
    tube.position.set(0, 1.65, 0);
    addBoxOutline(tube);
    aidBooth.add(tube);

    chunk6.add(aidBooth);
    scene.add(chunk6);
    scrollingProps.push(chunk6);
  }

  // ─────────────────────────────────────────────────────────────────
  // LAYER 2: DISTANT LANDMARKS (Deep parallax horizon layer)
  // ─────────────────────────────────────────────────────────────────
  const distantLandmarks = new THREE.Group();

  // 1. Illuminated Rotating Ferris Wheel at (X = 23, Y = 14, Z = -82)
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

  for (let g = 0; g < 6; g++) {
    const angle = (g / 6) * Math.PI * 2;
    const gondola = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.4, 1.2),
      new THREE.MeshStandardMaterial({ color: g % 2 === 0 ? '#ef4444' : '#3b82f6', roughness: 0.5 })
    );
    gondola.position.set(Math.cos(angle) * 13, Math.sin(angle) * 13 - 0.7, 0);
    addBoxOutline(gondola);
    ferrisWheelGroup.add(gondola);
  }

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

  // 2. Rotating Carousel at (X = -21, Z = -68)
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

  carouselRig.add(carouselGroup);
  distantLandmarks.add(carouselRig);

  // 3. Distant Roller Coaster Trestle at (X = -22, Z = -95)
  const coasterGroup = new THREE.Group();
  coasterGroup.position.set(-22, 0, -95);
  const coasterMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.7, metalness: 0.4 });
  const coasterTrackCyan = new THREE.MeshStandardMaterial({
    color: '#43D9F2',
    emissive: '#43D9F2',
    emissiveIntensity: 1.8,
  });

  [
    { x: -5, y: 7, z: 20 },
    { x: 0, y: 13, z: 8 },
    { x: 6, y: 9, z: -6 },
    { x: 11, y: 15, z: -20 },
  ].forEach((tp) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.2, tp.y, 1.2), coasterMat);
    tower.position.set(tp.x, tp.y / 2, tp.z);
    addBoxOutline(tower);
    coasterGroup.add(tower);

    const trackRail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 14), coasterTrackCyan);
    trackRail.position.set(tp.x, tp.y + 0.15, tp.z);
    coasterGroup.add(trackRail);
  });
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
