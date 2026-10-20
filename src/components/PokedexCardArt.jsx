import { useEffect, useRef } from 'react';

/**
 * Draws bespoke 48x48 16-bit pixel art sprite & habitat for each creature,
 * supporting idle micro-animations (blinking eyes, floating embers/spores, sprite bobbing).
 */
function drawCreaturePixelArt(ctx, artKey, isOwned, animFrame = 0) {
  const w = 48;
  const h = 48;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, w, h);

  // Bobbing offset for owned creatures
  const bobY = isOwned ? (animFrame === 1 || animFrame === 2 ? 1 : 0) : 0;
  const blink = isOwned && animFrame === 2; // Eyes blink shut on frame 2

  // ── BACKGROUND HABITATS (Dithered 16-bit Gradients) ──────────────
  switch (artKey) {
    case 'mossbyte': {
      // Twilight mossy forest
      ctx.fillStyle = '#060e17';
      ctx.fillRect(0, 0, w, h);
      // Dithered canopy
      for (let y = 0; y < 18; y++) {
        for (let x = 0; x < w; x++) {
          if ((x * 7 + y * 13) % 4 === 0) {
            ctx.fillStyle = '#0f2430';
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
      // Peat ground
      ctx.fillStyle = '#0a1d24';
      ctx.fillRect(0, 32, w, 16);
      ctx.fillStyle = '#0e313d';
      ctx.fillRect(0, 36, w, 12);

      // Glowing cyan mushrooms
      ctx.fillStyle = '#43d9f2';
      ctx.fillRect(4, 34, 4, 3);
      ctx.fillRect(38, 36, 3, 3);
      ctx.fillStyle = '#164e63';
      ctx.fillRect(5, 37, 2, 3);
      ctx.fillRect(39, 39, 1, 3);

      // Floating spores
      if (isOwned) {
        ctx.fillStyle = '#34d399';
        const s1 = (animFrame * 3) % 12;
        const s2 = (animFrame * 4) % 16;
        ctx.fillRect(10, 16 - s1, 1, 1);
        ctx.fillRect(34, 22 - s2, 1, 1);
      }
      break;
    }

    case 'lantern-hare': {
      // Amber hollow grove
      ctx.fillStyle = '#1a0e04';
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < w; x++) {
          if ((x * 5 + y * 11) % 4 === 0) {
            ctx.fillStyle = '#381604';
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
      ctx.fillStyle = '#3d1602';
      ctx.fillRect(0, 34, w, 14);

      // Floating golden embers
      if (isOwned) {
        ctx.fillStyle = '#f3c86b';
        const e1 = (animFrame * 2) % 10;
        const e2 = (animFrame * 3) % 14;
        ctx.fillRect(8, 20 - e1, 1, 1);
        ctx.fillRect(38, 16 - e2, 2, 2);
        ctx.fillRect(42, 28 - e1, 1, 1);
      }
      break;
    }

    case 'static-moth': {
      // Crimson electric night sky
      ctx.fillStyle = '#22040b';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#3a0815';
      ctx.fillRect(0, 24, w, 24);

      // Electric lightning discharges
      ctx.fillStyle = '#43d9f2';
      ctx.fillRect(4, 4, 2, 8);
      ctx.fillRect(6, 12, 3, 2);
      ctx.fillRect(40, 8, 2, 6);
      ctx.fillRect(38, 14, 2, 2);
      if (isOwned && (animFrame === 1 || animFrame === 3)) {
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(5, 5, 1, 6);
        ctx.fillRect(41, 9, 1, 4);
      }
      break;
    }

    case 'velvet-wisp': {
      // Glitch purple void
      ctx.fillStyle = '#12041d';
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 3) {
        for (let x = 0; x < w; x += 3) {
          if ((x + y) % 6 === 0) {
            ctx.fillStyle = '#2a0b3f';
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }
      ctx.fillStyle = '#581c87';
      ctx.fillRect(4, 8, 16, 1);
      ctx.fillRect(28, 38, 16, 1);
      break;
    }

    case 'clockwork-crow': {
      // Abyssal industrial clockwork sky
      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 34, w, 14);

      // Rotating brass gear outline
      ctx.fillStyle = '#b45309';
      ctx.fillRect(34, 4, 10, 10);
      ctx.fillStyle = '#06080e';
      ctx.fillRect(37, 7, 4, 4);
      ctx.fillStyle = '#d4a349';
      ctx.fillRect(38, 8, 2, 2);
      break;
    }

    case 'grinfin': {
      // Deep dark bioluminescent abyssal ocean
      ctx.fillStyle = '#040d17';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#081d30';
      ctx.fillRect(0, 26, w, 22);
      ctx.fillStyle = '#0e304d';
      ctx.fillRect(0, 16, w, 4);
      if (isOwned) {
        ctx.fillStyle = '#3ce3e8';
        const b = (animFrame * 2) % 8;
        ctx.fillRect(8, 24 - b, 1, 1);
        ctx.fillRect(38, 20 - b, 1, 1);
      }
      break;
    }

    case 'moonjaw': {
      // Lunar crater terrain
      ctx.fillStyle = '#0a0c13';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#181b26';
      ctx.fillRect(0, 32, w, 16);
      ctx.fillStyle = '#f3c86b';
      ctx.fillRect(36, 6, 7, 7); // Distant gold moon
      ctx.fillStyle = '#d4a349';
      ctx.fillRect(38, 8, 3, 3);
      break;
    }

    case 'the-tethered': {
      // Carnival silhouette with Ferris wheel in crimson fog
      ctx.fillStyle = '#19000d';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#3b0322';
      ctx.fillRect(0, 26, w, 22);
      // Circus tent silhouette
      ctx.fillStyle = '#580833';
      ctx.fillRect(4, 20, 12, 28);
      // Ferris wheel in distance
      ctx.fillStyle = '#d4a349';
      ctx.fillRect(32, 6, 12, 12);
      ctx.fillStyle = '#19000d';
      ctx.fillRect(34, 8, 8, 8);
      break;
    }

    default: {
      ctx.fillStyle = '#101422';
      ctx.fillRect(0, 0, w, h);
    }
  }

  // ── CREATURE SPRITES ─────────────────────────────────────────────
  if (!isOwned) {
    // Mysterious dark silhouette with glowing eyes in mist
    ctx.fillStyle = '#06070d';
    ctx.fillRect(14, 12, 20, 24);
    ctx.fillRect(10, 18, 28, 14);

    ctx.fillStyle = '#f3c86b';
    ctx.fillRect(18, 20, 3, 2);
    ctx.fillRect(27, 20, 3, 2);
    return;
  }

  switch (artKey) {
    case 'mossbyte': {
      const y0 = 12 + bobY;
      // Stone body
      ctx.fillStyle = '#475569';
      ctx.fillRect(14, y0 + 4, 20, 18);
      ctx.fillStyle = '#334155';
      ctx.fillRect(16, y0 + 6, 16, 14);

      // Lush moss crest & overgrowth
      ctx.fillStyle = '#10b981';
      ctx.fillRect(12, y0, 24, 6);
      ctx.fillRect(16, y0 + 6, 4, 4);
      ctx.fillRect(28, y0 + 6, 4, 3);
      ctx.fillStyle = '#34d399';
      ctx.fillRect(14, y0 + 1, 20, 2);

      // Pointed stone ears
      ctx.fillStyle = '#334155';
      ctx.fillRect(11, y0 - 3, 4, 6);
      ctx.fillRect(33, y0 - 3, 4, 6);

      // Glowing cyan eyes
      if (blink) {
        ctx.fillStyle = '#164e63';
        ctx.fillRect(17, y0 + 11, 4, 1);
        ctx.fillRect(27, y0 + 11, 4, 1);
      } else {
        ctx.fillStyle = '#3ce3e8';
        ctx.fillRect(17, y0 + 10, 4, 3);
        ctx.fillRect(27, y0 + 10, 4, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(18, y0 + 10, 2, 2);
        ctx.fillRect(28, y0 + 10, 2, 2);
      }
      break;
    }

    case 'lantern-hare': {
      const y0 = 14 + bobY;
      // Shadow bunny body
      ctx.fillStyle = '#1c152a';
      ctx.fillRect(16, y0 + 4, 16, 16);
      ctx.fillStyle = '#291e3e';
      ctx.fillRect(18, y0 + 6, 12, 12);

      // Long bunny ears
      ctx.fillStyle = '#291e3e';
      ctx.fillRect(16, y0 - 8, 4, 12);
      ctx.fillRect(28, y0 - 8, 4, 12);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(17, y0 - 6, 2, 8);
      ctx.fillRect(29, y0 - 6, 2, 8);

      // Glowing golden lantern core
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(19, y0 + 9, 10, 9);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(21, y0 + 11, 6, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(23, y0 + 12, 2, 3);

      // Eyes
      if (blink) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(17, y0 + 5, 3, 1);
      } else {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(17, y0 + 4, 3, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(18, y0 + 4, 1, 1);
      }
      break;
    }

    case 'static-moth': {
      const y0 = 12 + bobY;
      // Indigo body
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(22, y0 + 4, 4, 18);

      // Electric cyan wings
      const wingSpread = animFrame === 1 || animFrame === 3 ? 1 : 0;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(8 - wingSpread, y0 + 2, 14, 11);
      ctx.fillRect(26 + wingSpread, y0 + 2, 14, 11);
      ctx.fillRect(11 - wingSpread, y0 + 13, 11, 9);
      ctx.fillRect(26 + wingSpread, y0 + 13, 11, 9);

      // Wing lightning veins
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12 - wingSpread, y0 + 5, 7, 3);
      ctx.fillRect(29 + wingSpread, y0 + 5, 7, 3);

      // Antennae
      ctx.fillStyle = '#3ce3e8';
      ctx.fillRect(20, y0 - 1, 2, 5);
      ctx.fillRect(26, y0 - 1, 2, 5);

      // Eyes
      if (!blink) {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(21, y0 + 5, 2, 2);
        ctx.fillRect(25, y0 + 5, 2, 2);
      }
      break;
    }

    case 'velvet-wisp': {
      const y0 = 10 + bobY;
      // Flowing phantom shroud
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(14, y0 + 4, 20, 18);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(16, y0 + 2, 16, 8);

      // Draped silk tentacles
      ctx.fillStyle = '#6b21a8';
      const wave = animFrame % 2;
      ctx.fillRect(13 + wave, y0 + 22, 4, 8);
      ctx.fillRect(22, y0 + 22, 5, 10);
      ctx.fillRect(30 - wave, y0 + 22, 4, 8);

      // Radiant magenta occult core
      ctx.fillStyle = '#df293b';
      ctx.fillRect(19, y0 + 9, 10, 9);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(21, y0 + 11, 6, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(23, y0 + 12, 2, 3);

      // Eyes
      if (!blink) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(18, y0 + 7, 3, 2);
        ctx.fillRect(27, y0 + 7, 3, 2);
      }
      break;
    }

    case 'clockwork-crow': {
      const y0 = 12 + bobY;
      // Iron body
      ctx.fillStyle = '#334155';
      ctx.fillRect(15, y0 + 4, 18, 16);
      ctx.fillStyle = '#475569';
      ctx.fillRect(17, y0 + 6, 14, 12);

      // Brass wings
      ctx.fillStyle = '#d4a349';
      ctx.fillRect(9, y0 + 6, 6, 12);
      ctx.fillRect(33, y0 + 6, 6, 12);

      // Sharp golden beak
      ctx.fillStyle = '#f3c86b';
      ctx.fillRect(9, y0 + 9, 6, 4);

      // Rotating mechanical clockwork eye
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(17, y0 + 7, 5, 5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(19, y0 + 9, 1, 1);
      break;
    }

    case 'grinfin': {
      const y0 = 12 + bobY;
      // Abyssal body
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(12, y0 + 4, 24, 16);
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(14, y0 + 6, 20, 12);

      // Fins
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(21, y0 - 1, 6, 5);
      ctx.fillRect(6, y0 + 9, 6, 7);

      // Crescent neon smile
      ctx.fillStyle = '#3ce3e8';
      ctx.fillRect(22, y0 + 13, 11, 3);
      ctx.fillRect(31, y0 + 11, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(24, y0 + 14, 2, 2);
      ctx.fillRect(28, y0 + 14, 2, 2);

      // Eye
      if (!blink) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(26, y0 + 7, 3, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(27, y0 + 7, 1, 1);
      }
      break;
    }

    case 'moonjaw': {
      const y0 = 10 + bobY;
      // Massive beast
      ctx.fillStyle = '#475569';
      ctx.fillRect(11, y0 + 4, 26, 22);
      ctx.fillStyle = '#334155';
      ctx.fillRect(13, y0 + 6, 22, 18);

      // Gold fissure veins
      ctx.fillStyle = '#f3c86b';
      ctx.fillRect(14, y0 + 8, 6, 2);
      ctx.fillRect(18, y0 + 10, 2, 6);
      ctx.fillRect(25, y0 + 11, 5, 2);

      // Massive jaw & razor teeth
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(11, y0 + 17, 26, 9);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(14, y0 + 17, 3, 4);
      ctx.fillRect(20, y0 + 17, 3, 4);
      ctx.fillRect(26, y0 + 17, 3, 4);
      ctx.fillRect(32, y0 + 17, 3, 4);

      if (!blink) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(16, y0 + 8, 3, 3);
        ctx.fillRect(29, y0 + 8, 3, 3);
      }
      break;
    }

    case 'the-tethered': {
      const y0 = 12 + bobY;
      // Porcelain clown face
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(15, y0 + 4, 18, 18);

      // Fiery flame hair mane
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(11, y0 + 1, 6, 14);
      ctx.fillRect(31, y0 + 1, 6, 14);
      ctx.fillRect(17, y0 - 3, 14, 7);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(21, y0 - 6, 6, 5);

      // Demonic red clown eyes
      if (blink) {
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(18, y0 + 8, 4, 1);
        ctx.fillRect(26, y0 + 8, 4, 1);
      } else {
        ctx.fillStyle = '#ff1744';
        ctx.fillRect(18, y0 + 7, 4, 4);
        ctx.fillRect(26, y0 + 7, 4, 4);
        ctx.fillStyle = '#ffea00';
        ctx.fillRect(19, y0 + 8, 2, 2);
        ctx.fillRect(27, y0 + 8, 2, 2);
      }

      // Red nose
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(22, y0 + 11, 4, 3);

      // Wide razor grin
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(17, y0 + 16, 14, 5);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(19, y0 + 16, 2, 3);
      ctx.fillRect(23, y0 + 16, 2, 3);
      ctx.fillRect(27, y0 + 16, 2, 3);

      // 3 Red balloons
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(8, y0 - 9, 6, 7);
      ctx.fillRect(34, y0 - 8, 6, 7);
      ctx.fillRect(21, y0 - 12, 6, 7);
      break;
    }
  }
}

export default function PokedexCardArt({ artKey, isOwned, creatureName }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    let animFrame = 0;
    drawCreaturePixelArt(ctx, artKey, isOwned, animFrame);

    if (!isOwned) return undefined;

    // 250ms tick micro-animation for owned cards (eyes blink, spores float, gentle bobbing)
    const interval = setInterval(() => {
      animFrame = (animFrame + 1) % 4;
      drawCreaturePixelArt(ctx, artKey, isOwned, animFrame);
    }, 250);

    return () => clearInterval(interval);
  }, [artKey, isOwned]);

  return (
    <div className="pokedex-art-frame">
      <canvas
        ref={canvasRef}
        width={48}
        height={48}
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
