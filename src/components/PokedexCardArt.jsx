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
      // Bulba-Moss: Teal-green bulb-dinosaur with glowing cyan carnival flower bulb
      // Flower Bulb on back
      ctx.beginPath();
      ctx.ellipse(cx, cy - 14, 18, 14, 0, 0, Math.PI * 2);
      strokeCartoon('#06b6d4', '#120b1d', 3.5);

      // Bulb petals
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 20);
      ctx.lineTo(cx, cy - 30);
      ctx.lineTo(cx + 6, cy - 20);
      ctx.closePath();
      strokeCartoon('#f43f5e', '#120b1d', 2.0);

      // Dinosaur Body
      ctx.beginPath();
      ctx.roundRect(cx - 24, cy - 8, 48, 34, [14, 14, 8, 8]);
      strokeCartoon('#10b981', '#120b1d', 3.5);

      // Darker teal patches
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(cx - 14, cy + 2, 5, 0, Math.PI * 2);
      ctx.arc(cx + 12, cy + 4, 6, 0, Math.PI * 2);
      ctx.arc(cx - 2, cy + 14, 4, 0, Math.PI * 2);
      ctx.fill();

      // Little dinosaur feet
      [-16, 16].forEach((fx) => {
        ctx.beginPath();
        ctx.roundRect(cx + fx - 5, cy + 22, 10, 8, [0, 0, 4, 4]);
        strokeCartoon('#059669', '#120b1d', 2.5);
      });

      // Expressive Red Dinosaur Eyes with highlights
      [-11, 11].forEach((ex) => {
        if (blink) {
          ctx.beginPath();
          ctx.moveTo(cx + ex - 6, cy - 1);
          ctx.lineTo(cx + ex + 6, cy - 1);
          ctx.strokeStyle = '#120b1d';
          ctx.lineWidth = 3.5;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(cx + ex, cy - 1, 7.5, 0, Math.PI * 2);
          strokeCartoon('#ffffff', '#120b1d', 3.0);

          ctx.beginPath();
          ctx.arc(cx + ex, cy - 1, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#dc2626';
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + ex - 1.5, cy - 3, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Snout with upward tooth spikes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy + 12);
      ctx.lineTo(cx - 3, cy + 8);
      ctx.lineTo(cx - 1, cy + 12);
      ctx.moveTo(cx + 1, cy + 12);
      ctx.lineTo(cx + 3, cy + 8);
      ctx.lineTo(cx + 5, cy + 12);
      ctx.fill();
      break;
    }

    case 'lantern-hare': {
      // Pika-Lantern: Electric mouse with black-tipped ears, red cheeks, lightning tail
      // Jagged Lightning Bolt Tail in background
      ctx.beginPath();
      ctx.moveTo(cx + 18, cy + 10);
      ctx.lineTo(cx + 32, cy - 6);
      ctx.lineTo(cx + 26, cy - 8);
      ctx.lineTo(cx + 38, cy - 28);
      ctx.lineTo(cx + 32, cy - 20);
      ctx.lineTo(cx + 20, cy + 6);
      ctx.closePath();
      strokeCartoon('#fbbf24', '#120b1d', 3.0);

      // Yellow Body
      ctx.beginPath();
      ctx.arc(cx, cy + 6, 25, 0, Math.PI * 2);
      strokeCartoon('#facc15', '#120b1d', 3.5);

      // White belly patch
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12, 14, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();

      // Pointed Pikachu ears with solid black tips
      [-13, 13].forEach((ex) => {
        const tilt = ex > 0 ? 0.35 : -0.35;
        ctx.beginPath();
        ctx.ellipse(cx + ex, cy - 28, 6.5, 20, tilt, 0, Math.PI * 2);
        strokeCartoon('#facc15', '#120b1d', 3.5);

        // Black ear tip
        ctx.beginPath();
        ctx.ellipse(cx + ex * 1.35, cy - 38, 5, 8, tilt, 0, Math.PI * 2);
        ctx.fillStyle = '#120b1d';
        ctx.fill();
      });

      // Red Sparking Cheek Pouches
      [-15, 15].forEach((cxp) => {
        ctx.beginPath();
        ctx.arc(cx + cxp, cy + 10, 6, 0, Math.PI * 2);
        strokeCartoon('#ef4444', '#120b1d', 2.0);
      });

      // Expressive Cartoon Eyes
      [-8, 8].forEach((ex) => {
        if (blink) {
          ctx.beginPath();
          ctx.moveTo(cx + ex - 5, cy + 2);
          ctx.lineTo(cx + ex + 5, cy + 2);
          ctx.strokeStyle = '#120b1d';
          ctx.lineWidth = 3.0;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(cx + ex, cy + 2, 5.5, 0, Math.PI * 2);
          strokeCartoon('#120b1d', '#120b1d', 2.0);

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + ex - 1.5, cy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Cute nose and cat mouth
      ctx.beginPath();
      ctx.arc(cx, cy + 6, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#120b1d';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx - 3, cy + 10, 3, 0, Math.PI);
      ctx.arc(cx + 3, cy + 10, 3, 0, Math.PI);
      ctx.strokeStyle = '#120b1d';
      ctx.lineWidth = 2.0;
      ctx.stroke();
      break;
    }

    case 'static-moth': {
      // Zap-Venomoth: Spiky electric yellow/black moth with crackling cyan lightning wings
      // Spiky Lightning Wings
      [-24, 24].forEach((wx) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy - 4);
        ctx.lineTo(cx + wx * 1.5, cy - 24);
        ctx.lineTo(cx + wx * 1.2, cy - 10);
        ctx.lineTo(cx + wx * 1.7, cy + 4);
        ctx.lineTo(cx + wx * 0.8, cy + 8);
        ctx.closePath();
        strokeCartoon('#38bdf8', '#120b1d', 3.5);

        // Yellow interior lightning bolt
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + wx * 0.4, cy - 6);
        ctx.lineTo(cx + wx * 1.1, cy - 14);
        ctx.lineTo(cx + wx * 0.9, cy - 4);
        ctx.lineTo(cx + wx * 1.4, cy + 2);
        ctx.stroke();
      });

      // Black Fluffy Abdomen
      ctx.beginPath();
      ctx.ellipse(cx, cy + 6, 12, 18, 0, 0, Math.PI * 2);
      strokeCartoon('#1e293b', '#120b1d', 3.5);

      // Yellow Thorax Collar
      ctx.beginPath();
      ctx.ellipse(cx, cy - 6, 14, 10, 0, 0, Math.PI * 2);
      strokeCartoon('#facc15', '#120b1d', 3.0);

      // Lightning Forehead Crest
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 14);
      ctx.lineTo(cx, cy - 30);
      ctx.lineTo(cx + 8, cy - 14);
      ctx.closePath();
      strokeCartoon('#fbbf24', '#120b1d', 2.8);

      // Glowing Cyan Compound Eyes
      [-6, 6].forEach((ex) => {
        ctx.beginPath();
        ctx.arc(cx + ex, cy - 6, 5.5, 0, Math.PI * 2);
        strokeCartoon('#67e8f9', '#120b1d', 2.2);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx + ex - 1.5, cy - 8, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'velvet-wisp': {
      // Gengar-Wisp: Purple grinning Gengar phantom with floating soul-orbs
      // Floating Soul Orbs
      [-36, 36].forEach((ox, idx) => {
        const oy = cy - 12 + idx * 16;
        ctx.beginPath();
        ctx.arc(cx + ox, oy, 7, 0, Math.PI * 2);
        strokeCartoon('#c084fc', '#120b1d', 2.5);
        ctx.fillStyle = '#fdf4ff';
        ctx.beginPath();
        ctx.arc(cx + ox - 2, oy - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spiked Gengar Ears
      [-16, 16].forEach((ex) => {
        ctx.beginPath();
        ctx.moveTo(cx + ex * 0.5, cy - 18);
        ctx.lineTo(cx + ex * 1.5, cy - 34);
        ctx.lineTo(cx + ex * 1.1, cy - 12);
        ctx.closePath();
        strokeCartoon('#6b21a8', '#120b1d', 3.2);
      });

      // Round Gengar Body
      ctx.beginPath();
      ctx.arc(cx, cy + 2, 26, 0, Math.PI * 2);
      strokeCartoon('#7e22ce', '#120b1d', 3.5);

      // Glowing Red Sinister Eyes
      [-10, 10].forEach((ex) => {
        ctx.beginPath();
        ctx.ellipse(cx + ex, cy - 6, 7, 4.5, ex > 0 ? 0.35 : -0.35, 0, Math.PI * 2);
        strokeCartoon('#dc2626', '#120b1d', 2.5);

        ctx.fillStyle = '#120b1d';
        ctx.beginPath();
        ctx.arc(cx + ex, cy - 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Giant Mischievous Toothy Grin
      ctx.beginPath();
      ctx.arc(cx, cy + 6, 16, 0.2, Math.PI - 0.2);
      ctx.closePath();
      strokeCartoon('#f8fafc', '#120b1d', 3.0);

      // Tooth grid lines
      ctx.strokeStyle = '#120b1d';
      ctx.lineWidth = 2.0;
      for (let tx = -10; tx <= 10; tx += 5) {
        ctx.beginPath();
        ctx.moveTo(cx + tx, cy + 8);
        ctx.lineTo(cx + tx, cy + 18);
        ctx.stroke();
      }
      break;
    }

    case 'clockwork-crow': {
      // Corvi-Gear: Armored steel raven with interlocking Klink cogs
      // Wings
      ctx.beginPath();
      ctx.ellipse(cx - 18, cy + 8, 14, 20, 0.35, 0, Math.PI * 2);
      strokeCartoon('#334155', '#120b1d', 3.2);

      // Body
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 22, 0, Math.PI * 2);
      strokeCartoon('#475569', '#120b1d', 3.5);

      // Interlocking Klink Brass Cogs on chest
      [cx - 4, cx + 8].forEach((gx, idx) => {
        const gy = idx === 0 ? cy + 10 : cy + 6;
        ctx.beginPath();
        ctx.arc(gx, gy, 7, 0, Math.PI * 2);
        strokeCartoon(idx === 0 ? '#d97706' : '#94a3b8', '#120b1d', 2.5);

        // Cog teeth
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
          ctx.fillStyle = '#120b1d';
          ctx.fillRect(gx + Math.cos(a) * 6 - 1.5, gy + Math.sin(a) * 6 - 1.5, 3, 3);
        }
      });

      // Sharp Brass Beak
      ctx.beginPath();
      ctx.moveTo(cx + 8, cy - 2);
      ctx.lineTo(cx + 34, cy + 6);
      ctx.lineTo(cx + 8, cy + 14);
      ctx.closePath();
      strokeCartoon('#f59e0b', '#120b1d', 3.2);

      // Glowing Amber Eye
      ctx.beginPath();
      ctx.arc(cx + 2, cy - 4, 6, 0, Math.PI * 2);
      strokeCartoon('#fbbf24', '#120b1d', 2.5);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy - 6, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'grinfin': {
      // Gyarados-Fin: Ferocious blue sea serpent with 3-fin crest & neon fangs
      // Serpentine Blue Coils
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, 30, 20, 0, 0, Math.PI * 2);
      strokeCartoon('#0284c7', '#120b1d', 3.5);

      // Cream belly scales
      ctx.beginPath();
      ctx.ellipse(cx - 6, cy + 14, 18, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fef3c7';
      ctx.fill();

      // 3-Pointed Trident Crest on Head
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy - 14);
      ctx.lineTo(cx - 10, cy - 36);
      ctx.lineTo(cx - 2, cy - 18);
      ctx.lineTo(cx + 6, cy - 38);
      ctx.lineTo(cx + 12, cy - 18);
      ctx.lineTo(cx + 22, cy - 34);
      ctx.lineTo(cx + 20, cy - 12);
      ctx.closePath();
      strokeCartoon('#38bdf8', '#120b1d', 3.0);

      // Fierce Gaping Maw with Neon Fangs
      ctx.beginPath();
      ctx.arc(cx + 10, cy + 6, 14, -0.4, Math.PI * 0.7);
      ctx.closePath();
      strokeCartoon('#991b1b', '#120b1d', 2.8);

      // Sharp white fangs
      ctx.fillStyle = '#ffffff';
      for (let fx = 0; fx < 3; fx++) {
        ctx.beginPath();
        ctx.moveTo(cx + 8 + fx * 5, cy + 2);
        ctx.lineTo(cx + 10 + fx * 5, cy + 8);
        ctx.lineTo(cx + 12 + fx * 5, cy + 2);
        ctx.fill();
      }

      // Angry Angled Red Eye
      ctx.beginPath();
      ctx.moveTo(cx - 4, cy - 6);
      ctx.lineTo(cx + 6, cy - 8);
      ctx.lineTo(cx + 4, cy - 2);
      ctx.closePath();
      strokeCartoon('#dc2626', '#120b1d', 2.2);

      // Dragon Whiskers
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + 2, cy + 12);
      ctx.quadraticCurveTo(cx - 12, cy + 26, cx - 26, cy + 18);
      ctx.stroke();
      break;
    }

    case 'moonjaw': {
      // Tyran-Jaw: Armored obsidian-and-gold kaiju dino beneath the moon
      // Triangular Dorsal Armor Plates
      [-16, -6, 4].forEach((px) => {
        ctx.beginPath();
        ctx.moveTo(cx + px - 4, cy - 16);
        ctx.lineTo(cx + px + 2, cy - 32);
        ctx.lineTo(cx + px + 8, cy - 16);
        ctx.closePath();
        strokeCartoon('#eab308', '#120b1d', 2.8);
      });

      // Obsidian Kaiju Body
      ctx.beginPath();
      ctx.roundRect(cx - 24, cy - 14, 48, 38, [18, 18, 8, 8]);
      strokeCartoon('#1e293b', '#120b1d', 3.5);

      // Golden Armored Chest Carapace
      ctx.beginPath();
      ctx.roundRect(cx - 16, cy + 6, 32, 16, [4, 4, 8, 8]);
      strokeCartoon('#eab308', '#120b1d', 2.8);

      // Massive Armored Jaws with Gold Fangs
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy + 2);
      ctx.lineTo(cx + 20, cy + 2);
      ctx.lineTo(cx + 14, cy + 14);
      ctx.lineTo(cx - 10, cy + 14);
      ctx.closePath();
      strokeCartoon('#0f172a', '#120b1d', 2.5);

      ctx.fillStyle = '#fde047';
      for (let t = -8; t <= 12; t += 5) {
        ctx.fillRect(cx + t, cy + 3, 3, 5);
      }

      // Fierce Glowing Golden Eyes
      [-8, 8].forEach((ex) => {
        ctx.beginPath();
        ctx.ellipse(cx + ex, cy - 4, 5.5, 3.5, ex > 0 ? 0.3 : -0.3, 0, Math.PI * 2);
        strokeCartoon('#facc15', '#120b1d', 2.2);
      });
      break;
    }

    case 'the-tethered':
    default: {
      // Penny-Mime EX: Fusion of Mr. Mime & Pennywise with 3 floating red Poké-Balloons
      // 3 Floating Red Poké-Balloons with strings
      [cx - 32, cx + 30, cx + 38].forEach((bx, idx) => {
        const by = cy - 28 + idx * 8;
        // String
        ctx.strokeStyle = '#120b1d';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx, by + 10);
        ctx.lineTo(cx + 12, cy + 16);
        ctx.stroke();

        // Poké-Balloon: Top red, bottom white, center belt
        ctx.beginPath();
        ctx.arc(bx, by, 9, 0, Math.PI * 2);
        strokeCartoon('#ffffff', '#120b1d', 2.5);

        ctx.beginPath();
        ctx.arc(bx, by, 9, Math.PI, 0);
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        ctx.strokeStyle = '#120b1d';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(bx - 9, by);
        ctx.lineTo(bx + 9, by);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        strokeCartoon('#ffffff', '#120b1d', 1.5);
      });

      // Blue Clown Hair Tufts
      [-18, 18].forEach((hx) => {
        ctx.beginPath();
        ctx.arc(cx + hx, cy - 8, 8, 0, Math.PI * 2);
        strokeCartoon('#3b82f6', '#120b1d', 2.8);
      });

      // Red Ruff Collar
      ctx.beginPath();
      ctx.ellipse(cx, cy + 18, 20, 8, 0, 0, Math.PI * 2);
      strokeCartoon('#ef4444', '#120b1d', 3.0);

      // Porcelain White Clown Face
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      strokeCartoon('#f8fafc', '#120b1d', 3.5);

      // Red Smile extending through cheeks
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy - 8);
      ctx.quadraticCurveTo(cx - 10, cy + 12, cx, cy + 10);
      ctx.quadraticCurveTo(cx + 10, cy + 12, cx + 14, cy - 8);
      ctx.stroke();

      // Red clown nose
      ctx.beginPath();
      ctx.arc(cx, cy + 2, 4.5, 0, Math.PI * 2);
      strokeCartoon('#ef4444', '#120b1d', 2.0);

      // Blazing Deadlights Eyes
      [-8, 8].forEach((ex) => {
        ctx.beginPath();
        ctx.arc(cx + ex, cy - 4, 4.5, 0, Math.PI * 2);
        strokeCartoon('#ffaa00', '#120b1d', 2.0);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx + ex - 1, cy - 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
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
