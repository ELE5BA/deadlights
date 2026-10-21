import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createScene } from '../game/createScene.js';
import { PlayerCharacter } from '../game/entities/PlayerCharacter.js';
import { PursuerEntity } from '../game/entities/PursuerEntity.js';
import {
  createBlockerCrate,
  createShadowWave,
  createSwayingSpecter,
  createRiftShard,
} from '../game/entities/SpawnVisuals.js';
import { GAME_STAGES, GAME_CONFIG } from '../../shared/gameConfig.js';

const STAGE_THEMES = [
  {
    stage: 1,
    name: 'The Twilight Mist',
    bg: new THREE.Color('#0A1622'),
    fog: new THREE.Color('#0A1622'),
    rail: new THREE.Color('#43D9F2'),
    light: new THREE.Color('#43D9F2'),
  },
  {
    stage: 2,
    name: 'The Amber Hollow',
    bg: new THREE.Color('#201506'),
    fog: new THREE.Color('#201506'),
    rail: new THREE.Color('#F7C56B'),
    light: new THREE.Color('#F7C56B'),
  },
  {
    stage: 3,
    name: 'The Crimson Mire',
    bg: new THREE.Color('#2A0812'),
    fog: new THREE.Color('#2A0812'),
    rail: new THREE.Color('#E94462'),
    light: new THREE.Color('#E94462'),
  },
  {
    stage: 4,
    name: 'The Glitch Rift',
    bg: new THREE.Color('#1D0B2B'),
    fog: new THREE.Color('#1D0B2B'),
    rail: new THREE.Color('#B843F2'),
    light: new THREE.Color('#B843F2'),
  },
  {
    stage: 5,
    name: 'The Abyssal Void',
    bg: new THREE.Color('#070A12'),
    fog: new THREE.Color('#070A12'),
    rail: new THREE.Color('#43D9F2'),
    light: new THREE.Color('#43D9F2'),
  },
  {
    stage: 6,
    name: 'The Deadlights Core',
    bg: new THREE.Color('#220014'),
    fog: new THREE.Color('#220014'),
    rail: new THREE.Color('#FF2A55'),
    light: new THREE.Color('#FF2A55'),
  },
];

/**
 * High-Octane 60FPS Three.js Animated Attract-Mode Background for HEXEDEX.
 * Cycles smoothly through all 6 Stages every 6.5 seconds, dynamically morphing
 * lighting, fog, and neon rails. Spawns stage-matched obstacles and has the
 * runner weave lanes and jump obstacles in live gameplay demonstration!
 */
export default function HomeBackgroundCanvas({ runnerId = 'pika-georgie', onStageChange }) {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);
  const onStageChangeRef = useRef(onStageChange);

  useEffect(() => {
    onStageChangeRef.current = onStageChange;
  }, [onStageChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const world = createScene(canvas);
    const clock = new THREE.Clock();

    const player = new PlayerCharacter(runnerId);
    player.root.position.set(0, 0, 1.2);
    world.scene.add(player.root);
    playerRef.current = player;

    const pursuer = new PursuerEntity();
    world.scene.add(pursuer.root);

    world.camera.fov = 50;
    world.camera.position.set(0, 4.4, 7.5);
    world.camera.lookAt(0, 1.6, -3);
    world.camera.updateProjectionMatrix();

    let animId = null;
    let elapsed = 0;
    let currentStageIndex = 0;
    const speed = 11.5;

    // Decorative trackside obstacles & shards
    const decorObjects = [];
    let spawnTimer = 0;

    // Attract runner AI movement
    const lanes = GAME_CONFIG.laneCenters || [-3, 0, 3];
    let targetLaneIndex = 1;
    let laneChangeTimer = 2.0;
    let isJumping = false;
    let jumpTime = 0;
    const jumpDuration = 0.55;

    // Initial stage announce
    onStageChangeRef.current?.({
      stage: STAGE_THEMES[0].stage,
      name: STAGE_THEMES[0].name,
    });

    function resize() {
      if (!canvas) return;
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      if (!width || !height) return;
      world.renderer.setSize(width, height, false);
      world.camera.aspect = width / height;
      world.camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    function frame() {
      const dt = Math.min(clock.getDelta(), 0.05);
      const deltaMs = dt * 1000;
      elapsed += dt;

      // 1. Cycle 6 Stages every 6.5 seconds
      const nextStageIndex = Math.floor(elapsed / 6.5) % 6;
      if (nextStageIndex !== currentStageIndex) {
        currentStageIndex = nextStageIndex;
        const currentTheme = STAGE_THEMES[currentStageIndex];
        onStageChangeRef.current?.({
          stage: currentTheme.stage,
          name: currentTheme.name,
        });
      }

      // 2. Smoothly lerp atmosphere colors toward target stage theme
      const targetTheme = STAGE_THEMES[currentStageIndex];
      const lerpSpeed = Math.min(1, dt * 2.8);

      if (world.scene.background) {
        world.scene.background.lerp(targetTheme.bg, lerpSpeed);
      }
      if (world.scene.fog) {
        world.scene.fog.color.lerp(targetTheme.fog, lerpSpeed);
      }
      if (world.hemiLight) {
        world.hemiLight.color.lerp(targetTheme.light, lerpSpeed);
      }
      if (world.particles?.material) {
        world.particles.material.color.lerp(targetTheme.rail, lerpSpeed);
      }
      if (world.rails) {
        for (const rail of world.rails) {
          rail.material.color.lerp(targetTheme.rail, lerpSpeed);
          rail.material.emissive.lerp(targetTheme.rail, lerpSpeed);
        }
      }

      // 3. Infinite road chunk scrolling
      if (world.scrollingProps) {
        for (const chunk of world.scrollingProps) {
          chunk.position.z += speed * dt;
          if (chunk.position.z > 18) {
            chunk.position.z -= 140;
          }
        }
      }

      // Ground fog & Cobblestone drift
      if (world.groundFogTex) {
        world.groundFogTex.offset.y -= speed * dt * 0.055;
      }
      if (world.cobbleTex) {
        world.cobbleTex.offset.y -= speed * dt * 0.055;
      }

      // Distant carnival attractions
      if (world.ferrisWheelGroup) {
        world.ferrisWheelGroup.rotation.z += deltaMs * 0.00035;
      }
      if (world.carouselGroup) {
        world.carouselGroup.rotation.y += deltaMs * 0.00045;
      }

      // Floating spores & carnival particles
      if (world.particles) {
        const positions = world.particles.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
          positions[i] += speed * dt * 0.45;
          if (positions[i] > 6) {
            positions[i] = -85;
          }
        }
        world.particles.geometry.attributes.position.needsUpdate = true;
      }

      // 4. Periodically spawn stage-matched decorative obstacles & shards
      spawnTimer += dt;
      if (spawnTimer > 2.4) {
        spawnTimer = 0;
        const stageNum = targetTheme.stage;
        const spawnLane = Math.floor(Math.random() * 3);
        const spawnX = lanes[spawnLane];
        const spawnZ = -65;

        const roll = Math.random();
        let mesh = null;
        let isWave = false;

        if (roll < 0.35) {
          mesh = createBlockerCrate(stageNum);
          mesh.position.set(spawnX, 0.75, spawnZ);
        } else if (roll < 0.65) {
          mesh = createShadowWave(stageNum);
          mesh.position.set(spawnX, 0.05, spawnZ);
          isWave = true;
        } else if (roll < 0.85) {
          mesh = createRiftShard();
          mesh.position.set(spawnX, 1.05, spawnZ);
        } else {
          mesh = createSwayingSpecter(stageNum);
          mesh.position.set(spawnX, 1.35, spawnZ);
        }

        if (mesh) {
          world.scene.add(mesh);
          decorObjects.push({ mesh, lane: spawnLane, isWave });
        }
      }

      // Move decorative objects forward
      for (let i = decorObjects.length - 1; i >= 0; i--) {
        const item = decorObjects[i];
        item.mesh.position.z += speed * dt;

        // Check if approaching runner to react with AI jump or lane weave!
        const distZ = item.mesh.position.z - player.root.position.z;
        if (item.lane === targetLaneIndex && distZ > -10 && distZ < -1.5) {
          if (item.isWave && !isJumping) {
            // Jump over the wave!
            isJumping = true;
            jumpTime = 0;
          } else if (!item.isWave) {
            // Weave away from tall blocker
            const alternatives = [0, 1, 2].filter((l) => l !== targetLaneIndex);
            targetLaneIndex = alternatives[Math.floor(Math.random() * alternatives.length)];
          }
        }

        if (item.mesh.position.z > 14) {
          world.scene.remove(item.mesh);
          decorObjects.splice(i, 1);
        }
      }

      // 5. Attract Runner Movement (Lane weaving & jump kinematics)
      laneChangeTimer -= dt;
      if (laneChangeTimer <= 0) {
        laneChangeTimer = 2.2 + Math.random() * 1.5;
        const choices = [0, 1, 2].filter((l) => l !== targetLaneIndex);
        targetLaneIndex = choices[Math.floor(Math.random() * choices.length)];
      }

      const targetX = lanes[targetLaneIndex];
      const prevX = player.root.position.x;
      player.root.position.x += (targetX - player.root.position.x) * Math.min(1, dt * 6.5);
      const laneDeltaX = player.root.position.x - prevX;

      let jumpProgress = 0;
      if (isJumping) {
        jumpTime += dt;
        jumpProgress = Math.min(1, jumpTime / jumpDuration);
        const jumpH = Math.sin(jumpProgress * Math.PI) * 1.6;
        player.root.position.y = jumpH;
        if (jumpProgress >= 1) {
          isJumping = false;
          player.root.position.y = 0;
        }
      } else {
        player.root.position.y = 0;
      }

      player.update(deltaMs, {
        isRunning: true,
        isJumping,
        jumpProgress,
        laneDeltaX,
        invulnerableMs: 0,
      });

      // Animate pursuer in background
      pursuer.update(deltaMs, 3, player.root.position.x);

      // Low-angle cinematic camera sway
      world.camera.position.x = Math.sin(elapsed * 0.45) * 1.8;
      world.camera.position.y = 4.4 + Math.cos(elapsed * 0.35) * 0.15;
      world.camera.position.z = 7.5;
      world.camera.lookAt(Math.sin(elapsed * 0.45) * 0.4, 1.6, -3);

      world.renderer.render(world.scene, world.camera);
      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      // Clean up decor objects
      decorObjects.forEach((d) => {
        world.scene.remove(d.mesh);
      });
      player.dispose();
      pursuer.dispose();
      world.cobbleTex?.dispose();
      world.groundFogTex?.dispose();
      world.renderer?.dispose();
      playerRef.current = null;
    };
  }, []);

  // Update runner type dynamically on selection without rebuilding WebGL context
  useEffect(() => {
    playerRef.current?.setRunnerType?.(runnerId);
  }, [runnerId]);

  return <canvas ref={canvasRef} className="home-background-canvas" aria-hidden="true" />;
}
