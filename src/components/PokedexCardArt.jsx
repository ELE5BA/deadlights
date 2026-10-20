import { useEffect, useRef } from 'react';

/**
 * High-Resolution 160x120 HTML5 Canvas Cartoon Renderer for Hexedex Pokédex Cards.
 * Features bold #120b1d comic ink outlines, cel-shaded color fills, hard rim highlights,
 * expressive cartoon eyes, and action-reactive animated habitats.
 */
function drawCreatureCartoon(ctx, artKey, isOwned, animFrame = 0) {
  const w = 160;
  const h = 120;
  ctx.clearRect(0, 0, w, h);

  const bobY = isOwned ? (animFrame === 1 || animFrame === 3 ? 1.5 : (animFrame === 2 ? -1.5 : 0)) : 0;
  const blink = isOwned && animFrame === 2;

  // Helper for cartoon ink outline drawing
  function strokeCartoon(fillColor, strokeColor = '#120b1d', lineWidth = 3.5) {
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // ── 1. ANIMATED BACKGROUND HABITAT ──────────────────────────────
  switch (artKey) {
    case 'mossbyte': {
      // Twilight Mossy Forest
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#06131c');
      grad.addColorStop(0.65, '#0d2836');
      grad.addColorStop(1, '#051814');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Distant mist silhouettes
      ctx.fillStyle = '#0f3847';
      ctx.beginPath();
      ctx.arc(35, 95, 38, Math.PI, 0);
      ctx.arc(125, 95, 45, Math.PI, 0);
      ctx.fill();

      // Mossy ground
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 88, w, 32);
      ctx.fillStyle = '#022c22';
      ctx.fillRect(0, 96, w, 24);

      // Glowing cyan mushrooms
      [20, 138].forEach((mx) => {
        ctx.beginPath();
        ctx.arc(mx, 92, 9, Math.PI, 0);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
        ctx.lineWidth = 2.0;
        ctx.strokeStyle = '#120b1d';
        ctx.stroke();

        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(mx - 3, 89, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Animated floating spores
      if (isOwned) {
        ctx.fillStyle = '#34d399';
        const sY = (animFrame * 6) % 36;
        ctx.beginPath();
        ctx.arc(32, 70 - sY, 3, 0, Math.PI * 2);
        ctx.arc(120, 62 - ((sY + 12) % 36), 3.5, 0, Math.PI * 2);
        ctx.arc(75, 45 - ((sY + 22) % 36), 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'lantern-hare': {
      // Amber Hollow Lantern Grove
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1c0f05');
      grad.addColorStop(0.7, '#381c08');
      grad.addColorStop(1, '#1f0d04');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Warm spirit lantern aura
      const radial = ctx.createRadialGradient(80, 55, 10, 80, 55, 75);
      radial.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      radial.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, w, h);

      // Peat ground
      ctx.fillStyle = '#291409';
      ctx.fillRect(0, 90, w, 30);

      // Hanging lanterns on ropes
      ctx.strokeStyle = '#120b1d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(15, 0); ctx.lineTo(24, 38);
      ctx.moveTo(145, 0); ctx.lineTo(136, 42);
      ctx.stroke();

      [24, 136].forEach((lx, idx) => {
        const ly = idx === 0 ? 38 : 42;
        ctx.beginPath();
        ctx.arc(lx, ly, 8, 0, Math.PI * 2);
        strokeCartoon('#fbbf24', '#120b1d', 2.5);

        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Floating amber embers
      if (isOwned) {
        ctx.fillStyle = '#fef08a';
        const eY = (animFrame * 5) % 30;
        ctx.fillRect(40, 80 - eY, 3, 3);
        ctx.fillRect(115, 75 - ((eY + 14) % 30), 4, 4);
      }
      break;
    }

    case 'static-moth': {
      // Crimson Mire Electric Sky
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#2b0713');
      grad.addColorStop(0.65, '#450a1d');
      grad.addColorStop(1, '#1b030b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Red reeds ground
      ctx.fillStyle = '#4c0519';
      ctx.fillRect(0, 90, w, 30);

      // Crackling lightning bolts
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(25, 10); ctx.lineTo(34, 35); ctx.lineTo(28, 42); ctx.lineTo(38, 70);
      ctx.moveTo(135, 15); ctx.lineTo(122, 38); ctx.lineTo(129, 45); ctx.lineTo(118, 68);
      ctx.stroke();

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }

    case 'velvet-wisp': {
      // Fractured Glitch Void
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1a0b2e');
      grad.addColorStop(0.7, '#2e1065');
      grad.addColorStop(1, '#0f051d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stepped floating glitch voxel blocks
      ctx.fillStyle = '#d946ef';
      ctx.fillRect(12, 65, 26, 12);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(122, 55, 28, 14);
      ctx.fillStyle = '#3b0764';
      ctx.fillRect(0, 92, w, 28);
      break;
    }

    case 'clockwork-crow': {
      // Abyssal Void Steampunk Cave
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.7, '#1e293b');
      grad.addColorStop(1, '#05070a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Large gear silhouettes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(24, 35, 22, 0, Math.PI * 2);
      ctx.arc(138, 45, 28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 90, w, 30);
      break;
    }

    case 'grinfin': {
      // Deadlights Deep Carnival Abyss
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#240013');
      grad.addColorStop(0.7, '#3b0020');
      grad.addColorStop(1, '#12000a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Distant carnival tent stripes
      ctx.fillStyle = '#831843';
      ctx.beginPath();
      ctx.moveTo(0, 90); ctx.lineTo(35, 45); ctx.lineTo(70, 90);
      ctx.fill();

      // Glowing Deadlights orbs
      [35, 125, 80].forEach((ox, idx) => {
        const oy = idx === 2 ? 30 : 50;
        ctx.beginPath();
        ctx.arc(ox, oy, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffaa00';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#120b1d';
        ctx.stroke();
      });

      ctx.fillStyle = '#1c0010';
      ctx.fillRect(0, 92, w, 28);
      break;
    }

    case 'moonjaw': {
      // Lunar Twilight Cliff
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0a1128');
      grad.addColorStop(0.7, '#1c2541');
      grad.addColorStop(1, '#050914');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Glowing Crescent Moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(130, 32, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a1128';
      ctx.beginPath();
      ctx.arc(124, 30, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0b132b';
      ctx.fillRect(0, 90, w, 30);
      break;
    }

    case 'the-tethered':
    default: {
      // Midnight Carnival Balloon Horizon
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#190a28');
      grad.addColorStop(0.7, '#2d124d');
      grad.addColorStop(1, '#0d0417');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Floating red balloons on strings
      [28, 132].forEach((bx, idx) => {
        const by = 35 + idx * 8;
        ctx.beginPath();
        ctx.moveTo(bx, by + 12);
        ctx.lineTo(bx - 3, 90);
        ctx.strokeStyle = '#120b1d';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(bx, by, 10, 0, Math.PI * 2);
        strokeCartoon('#ef4444', '#120b1d', 2.5);
      });

      ctx.fillStyle = '#150624';
      ctx.fillRect(0, 92, w, 28);
      break;
    }
  }

  // ── 2. CREATURE DRAWING (CARTOON OUTLINED & CEL SHADED) ──────────
  const cx = 80;
  const cy = 64 + bobY;

  if (!isOwned) {
    // Mystery Silhouette Mode
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#120b1d';
    ctx.stroke();

    // Large glowing Mystery Question Mark
    ctx.font = '900 38px Impact, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', cx, cy - 2);
    ctx.restore();
    return;
  }

  // DRAW VIBRANT CEL-SHADED CREATURE
  ctx.save();

  switch (artKey) {
    case 'mossbyte': {
      // Forest Bug/Lizard Voxel Sprite
      // Body
      ctx.beginPath();
      ctx.roundRect(cx - 24, cy - 14, 48, 38, [14, 14, 8, 8]);
      strokeCartoon('#10b981', '#120b1d', 3.5);

      // Shadow underbelly
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.roundRect(cx - 22, cy + 10, 44, 12, [0, 0, 8, 8]);
      ctx.fill();

      // Leaf horns
      [-14, 14].forEach((hx) => {
        ctx.beginPath();
        ctx.moveTo(cx + hx, cy - 14);
        ctx.quadraticCurveTo(cx + hx * 1.8, cy - 34, cx + hx * 2.2, cy - 38);
        ctx.quadraticCurveTo(cx + hx * 0.8, cy - 26, cx + hx, cy - 14);
        strokeCartoon('#34d399', '#120b1d', 3.0);
      });

      // Expressive Cartoon Eyes
      [-11, 11].forEach((ex) => {
        if (blink) {
          ctx.beginPath();
          ctx.moveTo(cx + ex - 6, cy - 2);
          ctx.lineTo(cx + ex + 6, cy - 2);
          ctx.strokeStyle = '#120b1d';
          ctx.lineWidth = 3.5;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(cx + ex, cy - 2, 7.5, 0, Math.PI * 2);
          strokeCartoon('#ffffff', '#120b1d', 3.0);

          ctx.beginPath();
          ctx.arc(cx + ex, cy - 2, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + ex - 1.5, cy - 4, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      break;
    }

    case 'lantern-hare': {
      // Spirit Rabbit with lantern ears
      // Body
      ctx.beginPath();
      ctx.arc(cx, cy + 6, 25, 0, Math.PI * 2);
      strokeCartoon('#fef3c7', '#120b1d', 3.5);

      // Tall bunny ears
      [-12, 12].forEach((ex) => {
        ctx.beginPath();
        ctx.ellipse(cx + ex, cy - 32, 7.5, 22, ex > 0 ? 0.2 : -0.2, 0, Math.PI * 2);
        strokeCartoon('#fef3c7', '#120b1d', 3.5);

        ctx.beginPath();
        ctx.ellipse(cx + ex, cy - 32, 4, 16, ex > 0 ? 0.2 : -0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
      });

      // Eyes
      [-9, 9].forEach((ex) => {
        if (blink) {
          ctx.beginPath();
          ctx.moveTo(cx + ex - 5, cy + 2);
          ctx.lineTo(cx + ex + 5, cy + 2);
          ctx.strokeStyle = '#120b1d';
          ctx.lineWidth = 3.0;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(cx + ex, cy + 2, 6, 0, Math.PI * 2);
          strokeCartoon('#78350f', '#120b1d', 2.5);

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + ex - 1.5, cy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Little pink nose
      ctx.beginPath();
      ctx.arc(cx, cy + 9, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
      break;
    }

    case 'static-moth': {
      // Electric Crimson Moth
      // Wings
      [-22, 22].forEach((wx) => {
        ctx.beginPath();
        ctx.ellipse(cx + wx, cy - 8, 22, 16, wx > 0 ? 0.4 : -0.4, 0, Math.PI * 2);
        strokeCartoon('#e11d48', '#120b1d', 3.5);

        // Wing lightning markings
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(cx + wx, cy - 8, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      // Fluffy body
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2, 13, 20, 0, 0, Math.PI * 2);
      strokeCartoon('#4c0519', '#120b1d', 3.5);

      // Glowing Eyes
      [-6, 6].forEach((ex) => {
        ctx.beginPath();
        ctx.arc(cx + ex, cy - 5, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#120b1d';
        ctx.stroke();
      });
      break;
    }

    case 'velvet-wisp': {
      // Ghostly psychic phantom wisp
      ctx.beginPath();
      ctx.arc(cx, cy - 6, 24, Math.PI, 0);
      ctx.quadraticCurveTo(cx + 26, cy + 25, cx, cy + 32);
      ctx.quadraticCurveTo(cx - 26, cy + 25, cx - 24, cy - 6);
      strokeCartoon('#a855f7', '#120b1d', 3.5);

      // Inner glowing core
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#e879f9';
      ctx.fill();

      // Slanted sinister eyes
      [-9, 9].forEach((ex) => {
        ctx.beginPath();
        ctx.ellipse(cx + ex, cy - 4, 6, 3, ex > 0 ? 0.4 : -0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
      });
      break;
    }

    case 'clockwork-crow': {
      // Mechanical steampunk raven
      // Body
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 22, 0, Math.PI * 2);
      strokeCartoon('#334155', '#120b1d', 3.5);

      // Wings with brass gears
      ctx.beginPath();
      ctx.ellipse(cx - 16, cy + 8, 12, 18, 0.4, 0, Math.PI * 2);
      strokeCartoon('#1e293b', '#120b1d', 3.0);

      // Sharp gold beak
      ctx.beginPath();
      ctx.moveTo(cx + 12, cy - 2);
      ctx.lineTo(cx + 34, cy + 5);
      ctx.lineTo(cx + 12, cy + 12);
      ctx.closePath();
      strokeCartoon('#f59e0b', '#120b1d', 3.0);

      // Ruby monocle eye
      ctx.beginPath();
      ctx.arc(cx + 4, cy - 3, 6.5, 0, Math.PI * 2);
      strokeCartoon('#ef4444', '#120b1d', 2.8);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx + 2, cy - 5, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'grinfin': {
      // Apex Pennywise x Darkrai nightmare fish
      ctx.beginPath();
      ctx.ellipse(cx, cy, 28, 18, 0, 0, Math.PI * 2);
      strokeCartoon('#be123c', '#120b1d', 3.5);

      // Spiky dorsal fin
      ctx.beginPath();
      ctx.moveTo(cx - 16, cy - 14);
      ctx.lineTo(cx - 4, cy - 32);
      ctx.lineTo(cx + 8, cy - 16);
      ctx.closePath();
      strokeCartoon('#dc2626', '#120b1d', 3.0);

      // Glowing Deadlights eye
      ctx.beginPath();
      ctx.arc(cx + 12, cy - 4, 7, 0, Math.PI * 2);
      strokeCartoon('#ffaa00', '#120b1d', 2.5);

      // Razor-toothed wide grin
      ctx.fillStyle = '#ffffff';
      for (let t = -12; t <= 12; t += 6) {
        ctx.fillRect(cx + t, cy + 6, 3, 6);
      }
      break;
    }

    case 'moonjaw': {
      // Midnight celestial beast
      ctx.beginPath();
      ctx.roundRect(cx - 24, cy - 18, 48, 38, [18, 18, 8, 8]);
      strokeCartoon('#3b82f6', '#120b1d', 3.5);

      // Golden celestial horn
      ctx.beginPath();
      ctx.moveTo(cx, cy - 18);
      ctx.lineTo(cx + 6, cy - 38);
      ctx.lineTo(cx - 6, cy - 18);
      ctx.closePath();
      strokeCartoon('#facc15', '#120b1d', 3.0);

      // Glowing Cyan Eyes
      [-10, 10].forEach((ex) => {
        ctx.beginPath();
        ctx.arc(cx + ex, cy - 4, 6, 0, Math.PI * 2);
        strokeCartoon('#38bdf8', '#120b1d', 2.5);
      });
      break;
    }

    case 'the-tethered':
    default: {
      // Tethered clown puppet with porcelain face & red balloons
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      strokeCartoon('#f8fafc', '#120b1d', 3.5);

      // Crimson face paint strips
      [-8, 8].forEach((px) => {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx + px - 2, cy - 14, 4, 28);
      });

      // Red nose
      ctx.beginPath();
      ctx.arc(cx, cy + 2, 5, 0, Math.PI * 2);
      strokeCartoon('#ef4444', '#120b1d', 2.0);

      // Blazing Deadlights eyes
      [-8, 8].forEach((ex) => {
        ctx.beginPath();
        ctx.arc(cx + ex, cy - 3, 5, 0, Math.PI * 2);
        strokeCartoon('#ffaa00', '#120b1d', 2.0);
      });
      break;
    }
  }

  ctx.restore();
}

export default function PokedexCardArt({ artKey, isOwned, creatureName }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    let animFrame = 0;
    drawCreatureCartoon(ctx, artKey, isOwned, animFrame);

    if (!isOwned) return undefined;

    // 250ms tick micro-animation for owned cards (eyes blink, spores float, gentle bobbing)
    const interval = setInterval(() => {
      animFrame = (animFrame + 1) % 4;
      drawCreatureCartoon(ctx, artKey, isOwned, animFrame);
    }, 250);

    return () => clearInterval(interval);
  }, [artKey, isOwned]);

  return (
    <div className="pokedex-art-frame">
      <canvas
        ref={canvasRef}
        width={160}
        height={120}
        className="pokedex-pixel-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: '6px',
        }}
        title={creatureName}
      />
    </div>
  );
}
