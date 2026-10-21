import { useEffect, useRef } from 'react';

/**
 * High-detail 88x88 Cartoon Bust Portrait Canvas for Playable Runners
 * - Georgie-Chu (Pikachu yellow raincoat slicker, sparks, anime eyes, red cheeks)
 * - Mimi-Rag (Mimikyu tattered burlap ragdoll hood, bent ear, shadow brim with glowing purple eyes)
 * - Spook-Gar (Gengar spiky amethyst hoodie, bat-ears, crimson slanted eyes, fanged grin, shadow wisps)
 * - Wick-Kid (Litwick pale melted-wax poncho, dripping bangs, iron collar, cyan-violet Soul Flame)
 */
export default function RunnerPortraitCanvas({ runnerId }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 88;
    const h = 88;
    ctx.clearRect(0, 0, w, h);

    // Helpers
    const drawOutline = (fn, strokeColor = '#120b1d', lineWidth = 2.5) => {
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      fn();
      ctx.stroke();
      ctx.restore();
    };

    switch (runnerId) {
      case 'pika-georgie': {
        // 1. Background: Radial elemental atmosphere + Electric sparks
        const bgGrad = ctx.createRadialGradient(44, 44, 10, 44, 44, 44);
        bgGrad.addColorStop(0, '#3b1d5a');
        bgGrad.addColorStop(0.7, '#1f1133');
        bgGrad.addColorStop(1, '#12081f');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Electric sparks in background
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        // Left spark
        ctx.beginPath();
        ctx.moveTo(10, 22); ctx.lineTo(15, 28); ctx.lineTo(12, 34); ctx.lineTo(18, 40);
        ctx.stroke();
        // Right spark
        ctx.strokeStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(78, 18); ctx.lineTo(72, 26); ctx.lineTo(76, 32); ctx.lineTo(70, 38);
        ctx.stroke();

        // 2. Pointed Pikachu Ears poking out of hood
        // Left Ear
        ctx.fillStyle = '#ffd000';
        ctx.beginPath();
        ctx.moveTo(26, 34); ctx.lineTo(12, 6); ctx.lineTo(34, 22); ctx.closePath();
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(26, 34); ctx.lineTo(12, 6); ctx.lineTo(34, 22);
        }, '#120b1d', 2.8);
        // Left Ear Black Tip
        ctx.fillStyle = '#120b1d';
        ctx.beginPath();
        ctx.moveTo(12, 6); ctx.lineTo(17, 12); ctx.lineTo(18, 16); ctx.lineTo(14, 11); ctx.closePath();
        ctx.fill();

        // Right Ear
        ctx.fillStyle = '#ffd000';
        ctx.beginPath();
        ctx.moveTo(62, 34); ctx.lineTo(76, 6); ctx.lineTo(54, 22); ctx.closePath();
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(62, 34); ctx.lineTo(76, 6); ctx.lineTo(54, 22);
        }, '#120b1d', 2.8);
        // Right Ear Black Tip
        ctx.fillStyle = '#120b1d';
        ctx.beginPath();
        ctx.moveTo(76, 6); ctx.lineTo(71, 12); ctx.lineTo(70, 16); ctx.lineTo(74, 11); ctx.closePath();
        ctx.fill();

        // 3. Raincoat Shoulders & Brown Backpack Straps
        ctx.fillStyle = '#ffd000';
        ctx.beginPath();
        ctx.ellipse(44, 82, 34, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.ellipse(44, 82, 34, 22, 0, 0, Math.PI * 2);
        }, '#120b1d', 2.8);

        // Brown backpack straps
        ctx.fillStyle = '#78350f';
        ctx.fillRect(26, 68, 6, 20);
        ctx.fillRect(52, 68, 6, 20);
        drawOutline(() => {
          ctx.strokeRect(26, 68, 6, 20);
          ctx.strokeRect(52, 68, 6, 20);
        }, '#120b1d', 2.0);

        // 4. Yellow Slicker Raincoat Hood & Face
        ctx.fillStyle = '#eab308'; // Hood shadow ring
        ctx.beginPath();
        ctx.arc(44, 46, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffd000'; // Bright hood & face
        ctx.beginPath();
        ctx.arc(44, 45, 23, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.arc(44, 45, 23, 0, Math.PI * 2);
        }, '#120b1d', 2.8);

        // Open 3D hood collar rim
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.ellipse(44, 64, 18, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.ellipse(44, 64, 18, 7, 0, 0, Math.PI * 2);
        }, '#120b1d', 2.2);

        // 5. Red Electric Cheeks
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(30, 50, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(58, 50, 5.2, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.arc(30, 50, 5.2, 0, Math.PI * 2);
          ctx.arc(58, 50, 5.2, 0, Math.PI * 2);
        }, '#991b1b', 1.2);

        // 6. Big Anime Eyes with Specular Catchlights
        // Sclera/Pupil base
        ctx.fillStyle = '#120b1d';
        ctx.beginPath();
        ctx.ellipse(34, 42, 4.2, 5.5, 0, 0, Math.PI * 2);
        ctx.ellipse(54, 42, 4.2, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Brown lower iris gleam
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(34, 44, 3.2, 0, Math.PI);
        ctx.arc(54, 44, 3.2, 0, Math.PI);
        ctx.fill();

        // Big white specular highlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(32.8, 39.8, 2.0, 0, Math.PI * 2);
        ctx.arc(52.8, 39.8, 2.0, 0, Math.PI * 2);
        ctx.fill();
        // Tiny second catchlight
        ctx.beginPath();
        ctx.arc(35.5, 43.5, 1.0, 0, Math.PI * 2);
        ctx.arc(55.5, 43.5, 1.0, 0, Math.PI * 2);
        ctx.fill();

        // 7. Cute Nose & Cartoon Smile
        ctx.fillStyle = '#120b1d';
        ctx.beginPath();
        ctx.arc(44, 46.5, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#120b1d';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(41.5, 50.5, 2.8, 0.1, Math.PI * 0.9);
        ctx.arc(46.5, 50.5, 2.8, 0.1, Math.PI * 0.9);
        ctx.stroke();
        break;
      }

      case 'mimikyu-kid': {
        // 1. Background: Murky swamp violet / void radial aura
        const bgGrad = ctx.createRadialGradient(44, 44, 8, 44, 44, 44);
        bgGrad.addColorStop(0, '#2e1065');
        bgGrad.addColorStop(0.65, '#170c2e');
        bgGrad.addColorStop(1, '#090514');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Floating shadow particles
        ctx.fillStyle = 'rgba(192, 132, 252, 0.35)';
        ctx.beginPath();
        ctx.arc(16, 24, 2, 0, Math.PI * 2);
        ctx.arc(72, 30, 2.5, 0, Math.PI * 2);
        ctx.arc(22, 68, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // 2. Ears
        // Left upright rag ear
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(24, 38); ctx.lineTo(16, 8); ctx.lineTo(34, 24); ctx.closePath();
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(24, 38); ctx.lineTo(16, 8); ctx.lineTo(34, 24);
        }, '#120b1d', 2.8);
        // Left black tip
        ctx.fillStyle = '#120b1d';
        ctx.beginPath();
        ctx.moveTo(16, 8); ctx.lineTo(21, 14); ctx.lineTo(19, 18); ctx.lineTo(14, 13); ctx.closePath();
        ctx.fill();

        // Right ear bent sharply at 45 degrees
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(56, 32); ctx.lineTo(66, 18); ctx.lineTo(82, 22); ctx.lineTo(68, 30); ctx.closePath();
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(56, 32); ctx.lineTo(66, 18); ctx.lineTo(82, 22); ctx.lineTo(68, 30);
        }, '#120b1d', 2.8);
        // Right ear bent black tip
        ctx.fillStyle = '#120b1d';
        ctx.beginPath();
        ctx.moveTo(82, 22); ctx.lineTo(74, 21); ctx.lineTo(76, 26); ctx.closePath();
        ctx.fill();

        // 3. Tattered Burlap Poncho Base
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.moveTo(14, 88); ctx.lineTo(22, 70); ctx.lineTo(32, 74); ctx.lineTo(44, 68);
        ctx.lineTo(56, 74); ctx.lineTo(66, 70); ctx.lineTo(74, 88); ctx.closePath();
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(14, 88); ctx.lineTo(22, 70); ctx.lineTo(32, 74); ctx.lineTo(44, 68);
          ctx.lineTo(56, 74); ctx.lineTo(66, 70); ctx.lineTo(74, 88);
        }, '#120b1d', 2.8);

        // 4. Burlap Ragdoll Hood Head
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(44, 44, 22, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.arc(44, 44, 22, 0, Math.PI * 2);
        }, '#120b1d', 2.8);

        // Stitched neck seam with cross-stitches
        ctx.strokeStyle = '#120b1d';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(24, 62); ctx.lineTo(64, 62);
        ctx.stroke();
        [28, 36, 44, 52, 60].forEach((sx) => {
          ctx.beginPath();
          ctx.moveTo(sx - 3, 59); ctx.lineTo(sx + 3, 65);
          ctx.moveTo(sx + 3, 59); ctx.lineTo(sx - 3, 65);
          ctx.stroke();
        });

        // 5. Crayon Spiral Eyes on the fake face
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        // Left eye spiral
        ctx.beginPath();
        ctx.arc(33, 38, 4.5, 0, Math.PI * 1.8);
        ctx.stroke();
        // Right eye spiral
        ctx.beginPath();
        ctx.arc(55, 38, 4.5, 0.4, Math.PI * 2.2);
        ctx.stroke();

        // Scribbled crayon cheeks
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.arc(28, 48, 3.5, 0, Math.PI * 2);
        ctx.arc(60, 48, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Zigzag mouth scribbled on face
        ctx.strokeStyle = '#120b1d';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(33, 49); ctx.lineTo(37, 52); ctx.lineTo(41, 48);
        ctx.lineTo(45, 52); ctx.lineTo(49, 48); ctx.lineTo(54, 51);
        ctx.stroke();

        // 6. Dark Shadow Brim & TWO GLOWING PURPLE EYES peering out!
        ctx.fillStyle = '#090510';
        ctx.beginPath();
        ctx.ellipse(44, 76, 20, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.ellipse(44, 76, 20, 9, 0, 0, Math.PI * 2);
        }, '#120b1d', 2.0);

        // Glowing Purple Peering Eyes
        ctx.fillStyle = '#e879f9';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(37, 76, 3.8, 2.4, 0, 0, Math.PI * 2);
        ctx.ellipse(51, 76, 3.8, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // White pupil gleam in shadow eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(37, 75.5, 1.2, 0, Math.PI * 2);
        ctx.arc(51, 75.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'gengar-hood': {
        // 1. Background: Dark amethyst vortex + shadow wisps
        const bgGrad = ctx.createRadialGradient(44, 44, 10, 44, 44, 44);
        bgGrad.addColorStop(0, '#581c87');
        bgGrad.addColorStop(0.65, '#2e1065');
        bgGrad.addColorStop(1, '#110524');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Purple shadow-flame wisps
        ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.beginPath();
        ctx.arc(14, 28, 5, 0, Math.PI * 2);
        ctx.arc(74, 24, 6, 0, Math.PI * 2);
        ctx.arc(70, 64, 4, 0, Math.PI * 2);
        ctx.fill();

        // 2. Gengar Bat-Ears & Dorsal Spikes
        // Left Bat Ear
        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.moveTo(28, 32); ctx.lineTo(10, 10); ctx.lineTo(34, 20); ctx.closePath();
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(28, 32); ctx.lineTo(10, 10); ctx.lineTo(34, 20);
        }, '#120b1d', 2.8);

        // Right Bat Ear
        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.moveTo(60, 32); ctx.lineTo(78, 10); ctx.lineTo(54, 20); ctx.closePath();
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(60, 32); ctx.lineTo(78, 10); ctx.lineTo(54, 20);
        }, '#120b1d', 2.8);

        // Crown Dorsal Spikes
        [-8, 0, 8].forEach((offset) => {
          ctx.fillStyle = '#7e22ce';
          ctx.beginPath();
          ctx.moveTo(44 + offset - 4, 22);
          ctx.lineTo(44 + offset, 11);
          ctx.lineTo(44 + offset + 4, 22);
          ctx.closePath();
          ctx.fill();
          drawOutline(() => {
            ctx.beginPath();
            ctx.moveTo(44 + offset - 4, 22);
            ctx.lineTo(44 + offset, 11);
            ctx.lineTo(44 + offset + 4, 22);
          }, '#120b1d', 2.2);
        });

        // 3. Purple Hoodie Shoulders
        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.ellipse(44, 82, 34, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.ellipse(44, 82, 34, 22, 0, 0, Math.PI * 2);
        }, '#120b1d', 2.8);

        // 4. Spiky Amethyst Gengar Head
        ctx.fillStyle = '#7e22ce';
        ctx.beginPath();
        ctx.arc(44, 45, 23, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.arc(44, 45, 23, 0, Math.PI * 2);
        }, '#120b1d', 2.8);

        // 5. Glowing Crimson Slanted Eyes
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 6;
        // Left eye
        ctx.beginPath();
        ctx.moveTo(25, 38); ctx.lineTo(39, 44); ctx.lineTo(29, 46); ctx.closePath();
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.moveTo(63, 38); ctx.lineTo(49, 44); ctx.lineTo(59, 46); ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0; // reset
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(25, 38); ctx.lineTo(39, 44); ctx.lineTo(29, 46); ctx.closePath();
          ctx.moveTo(63, 38); ctx.lineTo(49, 44); ctx.lineTo(59, 46); ctx.closePath();
        }, '#120b1d', 1.8);

        // Eye highlights
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(32, 42, 1.2, 0, Math.PI * 2);
        ctx.arc(56, 42, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // 6. Mischievous Wide Fanged Cartoon Grin
        ctx.fillStyle = '#120b1d';
        ctx.beginPath();
        ctx.moveTo(22, 53);
        ctx.quadraticCurveTo(44, 68, 66, 53);
        ctx.quadraticCurveTo(44, 57, 22, 53);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(22, 53);
          ctx.quadraticCurveTo(44, 68, 66, 53);
          ctx.quadraticCurveTo(44, 57, 22, 53);
        }, '#120b1d', 2.2);

        // Sharp Cartoon Teeth
        ctx.fillStyle = '#ffffff';
        // Upper teeth
        for (let x = 27; x <= 61; x += 6) {
          ctx.beginPath();
          ctx.moveTo(x, 54);
          ctx.lineTo(x + 3, 58);
          ctx.lineTo(x + 6, 54);
          ctx.closePath();
          ctx.fill();
        }
        // Lower teeth
        for (let x = 30; x <= 58; x += 6) {
          ctx.beginPath();
          ctx.moveTo(x, 62);
          ctx.lineTo(x + 3, 58);
          ctx.lineTo(x + 6, 62);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }

      case 'litwick-runner':
      default: {
        // 1. Background: Spectral indigo night sky + cyan embers
        const bgGrad = ctx.createRadialGradient(44, 44, 10, 44, 44, 44);
        bgGrad.addColorStop(0, '#1e1b4b');
        bgGrad.addColorStop(0.65, '#0f172a');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Floating cyan embers
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.beginPath();
        ctx.arc(14, 20, 2.2, 0, Math.PI * 2);
        ctx.arc(76, 26, 2.5, 0, Math.PI * 2);
        ctx.arc(20, 66, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // 2. Vivid Two-Tone Cyan & Violet Soul Flame burning atop hood!
        // Outer violet aura flame
        ctx.fillStyle = '#9333ea';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(44, 4);
        ctx.quadraticCurveTo(58, 14, 52, 26);
        ctx.quadraticCurveTo(44, 28, 36, 26);
        ctx.quadraticCurveTo(30, 14, 44, 4);
        ctx.fill();

        // Inner glowing cyan flame core
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(44, 8);
        ctx.quadraticCurveTo(52, 16, 48, 24);
        ctx.quadraticCurveTo(44, 25, 40, 24);
        ctx.quadraticCurveTo(36, 16, 44, 8);
        ctx.fill();

        // Center white flame teardrop
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(44, 20, 3, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(44, 4);
          ctx.quadraticCurveTo(58, 14, 52, 26);
          ctx.quadraticCurveTo(44, 28, 36, 26);
          ctx.quadraticCurveTo(30, 14, 44, 4);
        }, '#120b1d', 2.0);

        // 3. Dark Iron Lantern Collar & Poncho Base
        ctx.fillStyle = '#f8fafc'; // Pale melted-wax body
        ctx.beginPath();
        ctx.ellipse(44, 82, 34, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.ellipse(44, 82, 34, 22, 0, 0, Math.PI * 2);
        }, '#120b1d', 2.8);

        // Dark iron collar rim
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.ellipse(44, 65, 20, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.ellipse(44, 65, 20, 6, 0, 0, Math.PI * 2);
        }, '#120b1d', 2.2);

        // 4. Pale Melted-Wax Head Dome
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.arc(44, 46, 23, 0, Math.PI * 2);
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.arc(44, 46, 23, 0, Math.PI * 2);
        }, '#120b1d', 2.8);

        // 5. Dripping Wax Bangs sweeping down over one eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(24, 34);
        ctx.quadraticCurveTo(34, 32, 44, 30);
        ctx.quadraticCurveTo(38, 48, 36, 54); // Long drip covering left eye
        ctx.quadraticCurveTo(32, 50, 30, 42);
        ctx.quadraticCurveTo(24, 44, 22, 36);
        ctx.closePath();
        ctx.fill();
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(24, 34);
          ctx.quadraticCurveTo(34, 32, 44, 30);
          ctx.quadraticCurveTo(38, 48, 36, 54);
          ctx.quadraticCurveTo(32, 50, 30, 42);
          ctx.quadraticCurveTo(24, 44, 22, 36);
        }, '#120b1d', 2.2);

        // 6. Sleepy Golden-Violet Spirit Eyes
        // Left eye partially hidden beneath wax drip
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.ellipse(32, 46, 3.5, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7e22ce';
        ctx.beginPath();
        ctx.arc(32, 46, 2.2, 0, Math.PI * 2);
        ctx.fill();
        // Eyelid droop
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(28, 40, 8, 4);

        // Right eye fully visible and sleepy
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.ellipse(54, 46, 4.5, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7e22ce';
        ctx.beginPath();
        ctx.arc(54, 46, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(52.8, 44.5, 1.3, 0, Math.PI * 2);
        ctx.fill();
        // Sleepy upper eyelid
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(49, 39, 10, 4);
        drawOutline(() => {
          ctx.beginPath();
          ctx.moveTo(49, 43); ctx.lineTo(59, 43);
        }, '#120b1d', 1.8);

        // 7. Cute Gentle Ghostly Smile
        ctx.fillStyle = '#120b1d';
        ctx.beginPath();
        ctx.ellipse(44, 55, 2.2, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  }, [runnerId]);

  return (
    <canvas
      ref={canvasRef}
      width={88}
      height={88}
      className="runner-portrait-canvas"
      aria-label={`Cartoon bust portrait for ${runnerId}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
