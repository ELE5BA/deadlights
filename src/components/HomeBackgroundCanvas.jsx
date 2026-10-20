import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createScene } from '../game/createScene.js';
import { PlayerCharacter } from '../game/entities/PlayerCharacter.js';
import { PursuerEntity } from '../game/entities/PursuerEntity.js';

/**
 * Lightweight 60FPS Three.js Animated Carnival Track for HEXEDEX Title/Menu Screens.
 * Runs an infinite optical-flow background with the active selected runner sprinting
 * and Pennywise floating in the distance.
 * Properly disposes all WebGL resources on unmount when entering gameplay.
 */
export default function HomeBackgroundCanvas({ runnerId = 'pika-georgie' }) {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);

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
    let t = 0;
    const speed = 11.5;

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
      t += dt;

      // Infinite road chunk scrolling
      if (world.scrollingProps) {
        for (const chunk of world.scrollingProps) {
          chunk.position.z += speed * dt;
          if (chunk.position.z > 18) {
            chunk.position.z -= 140;
          }
        }
      }

      // Ground fog drift
      if (world.groundFogTex) {
        world.groundFogTex.offset.y -= speed * dt * 0.055;
      }

      // Cobblestone drift
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

      // Animate player rig
      player.update(deltaMs, {
        isRunning: true,
        isJumping: false,
        jumpProgress: 0,
        laneDeltaX: 0,
        invulnerableMs: 0,
      });

      // Animate pursuer
      pursuer.update(deltaMs, 3, 0);

      // Low-angle cinematic camera sway
      world.camera.position.x = Math.sin(t * 0.5) * 1.8;
      world.camera.position.y = 4.4 + Math.cos(t * 0.35) * 0.15;
      world.camera.position.z = 7.5;
      world.camera.lookAt(Math.sin(t * 0.5) * 0.4, 1.6, -3);

      world.renderer.render(world.scene, world.camera);
      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
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
