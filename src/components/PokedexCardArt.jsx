import { useEffect, useRef } from 'react';

/**
 * Draws bespoke 32x32 16-bit pixel art sprite & habitat for each creature.
 */
function drawCreaturePixelArt(ctx, artKey, isOwned) {
  const w = 32;
  const h = 32;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, w, h);

  // ── BACKGROUND HABITATS ──────────────────────────────────────────
  switch (artKey) {
    case 'mossbyte': {
      // Twilight mossy forest
      ctx.fillStyle = '#0a1622';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#102d38';
      ctx.fillRect(0, 20, w, 12);
      // Glowing cyan mushrooms
      ctx.fillStyle = '#43D9F2';
      ctx.fillRect(4, 22, 2, 3);
      ctx.fillRect(26, 24, 2, 2);
      ctx.fillStyle = '#164e63';
      ctx.fillRect(4, 25, 2, 2);
      break;
    }
    case 'lantern-hare': {
      // Amber hollow grove
      ctx.fillStyle = '#201506';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, 22, w, 10);
      // Floating golden embers
      ctx.fillStyle = '#F7C56B';
      ctx.fillRect(6, 8, 1, 1);
      ctx.fillRect(25, 12, 1, 1);
      ctx.fillRect(28, 6, 2, 2);
      break;
    }
    case 'static-moth': {
      // Crimson electric night sky
      ctx.fillStyle = '#2a0812';
      ctx.fillRect(0, 0, w, h);
      // Lightning arcs
      ctx.fillStyle = '#43D9F2';
      ctx.fillRect(4, 4, 1, 6);
      ctx.fillRect(5, 10, 2, 1);
      ctx.fillRect(26, 6, 2, 4);
      break;
    }
    case 'velvet-wisp': {
      // Glitch purple void
      ctx.fillStyle = '#1d0b2b';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#581c87';
      ctx.fillRect(2, 6, 12, 1);
      ctx.fillRect(18, 26, 12, 1);
      break;
    }
    case 'clockwork-crow': {
      // Abyssal industrial clockwork sky
      ctx.fillStyle = '#070a12';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 22, w, 10);
      // Gear outline
      ctx.fillStyle = '#b45309';
      ctx.fillRect(24, 4, 6, 6);
      ctx.fillStyle = '#070a12';
      ctx.fillRect(26, 6, 2, 2);
      break;
    }
    case 'grinfin': {
      // Deep dark rift ocean
      ctx.fillStyle = '#081726';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#0f2942';
      ctx.fillRect(0, 18, w, 14);
      ctx.fillStyle = '#38bdf844';
      ctx.fillRect(0, 12, w, 2);
      break;
    }
    case 'moonjaw': {
      // Lunar crater terrain
      ctx.fillStyle = '#10121a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1e2230';
      ctx.fillRect(0, 20, w, 12);
      ctx.fillStyle = '#F7C56B';
      ctx.fillRect(24, 4, 5, 5); // Distant gold moon
      break;
    }
    case 'the-tethered': {
      // Carnival silhouette with Ferris wheel in the crimson mist
      ctx.fillStyle = '#220014';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#4a044e';
      ctx.fillRect(2, 14, 8, 18); // Tent silhouette
      ctx.fillStyle = '#F7C56B';
      ctx.fillRect(22, 6, 8, 8);  // Distant carnival wheel
      ctx.fillStyle = '#220014';
      ctx.fillRect(24, 8, 4, 4);
      break;
    }
    default: {
      ctx.fillStyle = '#171e32';
      ctx.fillRect(0, 0, w, h);
    }
  }

  // ── CREATURE SPRITES ─────────────────────────────────────────────
  if (!isOwned) {
    // Mysterious dark silhouette with glowing eyes
    ctx.fillStyle = '#0a0d17';
    ctx.fillRect(10, 8, 12, 16);
    ctx.fillRect(8, 12, 16, 10);

    ctx.fillStyle = '#F7C56B';
    ctx.fillRect(13, 13, 2, 2);
    ctx.fillRect(17, 13, 2, 2);
    return;
  }

  switch (artKey) {
    case 'mossbyte': {
      // Stone sprite body
      ctx.fillStyle = '#64748b';
      ctx.fillRect(10, 10, 12, 14);
      // Moss overlay
      ctx.fillStyle = '#10b981';
      ctx.fillRect(9, 8, 14, 5);
      ctx.fillRect(11, 13, 3, 3);
      // Pointed stone ears
      ctx.fillStyle = '#475569';
      ctx.fillRect(8, 6, 3, 4);
      ctx.fillRect(21, 6, 3, 4);
      // Glowing cyan eyes
      ctx.fillStyle = '#43D9F2';
      ctx.fillRect(12, 14, 3, 2);
      ctx.fillRect(17, 14, 3, 2);
      break;
    }
    case 'lantern-hare': {
      // Shadow rabbit body
      ctx.fillStyle = '#1e1b2e';
      ctx.fillRect(11, 12, 10, 12);
      // Long bunny ears
      ctx.fillStyle = '#2e2744';
      ctx.fillRect(11, 4, 3, 8);
      ctx.fillRect(18, 4, 3, 8);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(12, 6, 1, 5);
      ctx.fillRect(19, 6, 1, 5);
      // Glowing golden lantern belly
      ctx.fillStyle = '#F7C56B';
      ctx.fillRect(13, 15, 6, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(15, 17, 2, 2);
      // Red eye
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(12, 11, 2, 2);
      break;
    }
    case 'static-moth': {
      // Indigo body
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(15, 8, 3, 14);
      // Electric cyan wings
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(6, 8, 9, 7);
      ctx.fillRect(18, 8, 9, 7);
      ctx.fillRect(8, 15, 7, 6);
      ctx.fillRect(18, 15, 7, 6);
      // Wing veins
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, 10, 5, 2);
      ctx.fillRect(19, 10, 5, 2);
      // Antennae
      ctx.fillStyle = '#43D9F2';
      ctx.fillRect(14, 5, 1, 3);
      ctx.fillRect(18, 5, 1, 3);
      break;
    }
    case 'velvet-wisp': {
      // Flowing ghost shroud
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(10, 8, 12, 14);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(11, 7, 10, 5);
      // Flowing silk tails
      ctx.fillStyle = '#6b21a8';
      ctx.fillRect(9, 21, 3, 5);
      ctx.fillRect(14, 21, 4, 6);
      ctx.fillRect(20, 21, 3, 5);
      // Glowing magenta core
      ctx.fillStyle = '#E94462';
      ctx.fillRect(13, 12, 6, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(15, 14, 2, 2);
      break;
    }
    case 'clockwork-crow': {
      // Brass & iron body
      ctx.fillStyle = '#334155';
      ctx.fillRect(10, 10, 12, 12);
      // Brass wings
      ctx.fillStyle = '#d97706';
      ctx.fillRect(6, 12, 4, 8);
      ctx.fillRect(22, 12, 4, 8);
      // Beak
      ctx.fillStyle = '#F7C56B';
      ctx.fillRect(6, 13, 4, 3);
      // Rotating clockwork eye
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(11, 11, 3, 3);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(12, 12, 1, 1);
      break;
    }
    case 'grinfin': {
      // Dark aquatic predator
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, 10, 16, 11);
      // Dorsal & tail fins
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(14, 6, 4, 4);
      ctx.fillRect(4, 13, 4, 5);
      // Crescent neon smile
      ctx.fillStyle = '#43D9F2';
      ctx.fillRect(16, 16, 7, 2);
      ctx.fillRect(22, 15, 2, 2);
      ctx.fillRect(18, 17, 4, 1);
      // Sharp eye
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(18, 11, 2, 2);
      break;
    }
    case 'moonjaw': {
      // Massive moon-stone beast
      ctx.fillStyle = '#475569';
      ctx.fillRect(8, 8, 16, 16);
      // Gold fissure cracks
      ctx.fillStyle = '#F7C56B';
      ctx.fillRect(10, 10, 4, 1);
      ctx.fillRect(13, 11, 1, 4);
      ctx.fillRect(18, 12, 3, 1);
      // Huge jaw & teeth
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(8, 17, 16, 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 17, 2, 3);
      ctx.fillRect(14, 17, 2, 3);
      ctx.fillRect(18, 17, 2, 3);
      break;
    }
    case 'the-tethered': {
      // Menacing Pennywise Clown Face
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(10, 10, 12, 12);
      // Spiky flame orange hair
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(7, 8, 4, 9);
      ctx.fillRect(21, 8, 4, 9);
      ctx.fillRect(12, 6, 8, 4);
      // Demonic red eyes
      ctx.fillStyle = '#ff1744';
      ctx.fillRect(12, 12, 2, 3);
      ctx.fillRect(18, 12, 2, 3);
      // Red clown nose
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(15, 14, 2, 2);
      // Wide razor grin
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(11, 18, 10, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12, 18, 2, 2);
      ctx.fillRect(15, 18, 2, 2);
      ctx.fillRect(18, 18, 2, 2);
      // 3 Red Balloons overhead
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(6, 2, 4, 4);
      ctx.fillRect(22, 2, 4, 4);
      ctx.fillRect(14, 0, 4, 4);
      break;
    }
  }
}

export default function PokedexCardArt({ artKey, isOwned, creatureName }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawCreaturePixelArt(ctx, artKey, isOwned);
  }, [artKey, isOwned]);

  return (
    <div className="pokedex-art-frame">
      <canvas
        ref={canvasRef}
        width={32}
        height={32}
        className="pokedex-pixel-canvas"
        style={{
          imageRendering: 'pixelated',
          width: '100%',
          height: '100%',
          display: 'block',
        }}
        title={creatureName}
      />
    </div>
  );
}
