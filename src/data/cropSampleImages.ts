/**
 * Generates realistic high-resolution produce photos for quick AI scanning tests.
 * This allows farmers, assayer inspectors, and developers to test the real Gemini 3.8 Flash
 * vision analysis instantly even when hardware cameras are absent or permissions are restricted.
 */

export interface SampleCropImage {
  id: string;
  label: string;
  expectedGrade: 'A' | 'B' | 'C' | 'REJECT';
  description: string;
  badgeColor: string;
}

export const CROP_TEST_PRESETS: Record<string, SampleCropImage[]> = {
  default: [
    {
      id: 'sample_grade_a',
      label: 'Grade A Pristine Harvest',
      expectedGrade: 'A',
      description: 'Uniform size, brilliant color, zero surface blemishes or pest spots.',
      badgeColor: 'bg-emerald-600',
    },
    {
      id: 'sample_grade_b',
      label: 'Grade B Standard FAQ Harvest',
      expectedGrade: 'B',
      description: 'Fair Average Quality, sound produce with slight natural cosmetic variation.',
      badgeColor: 'bg-blue-600',
    },
    {
      id: 'sample_grade_c',
      label: 'Grade C Secondary Harvest',
      expectedGrade: 'C',
      description: 'Minor physical scuffs, uneven sizing, fully edible but non-premium.',
      badgeColor: 'bg-amber-600',
    },
    {
      id: 'sample_reject',
      label: 'Rotten / Moldy Spoilage Sample',
      expectedGrade: 'REJECT',
      description: 'Visible fungal mycelium, bacterial soft rot, disqualifies for mandi trading.',
      badgeColor: 'bg-red-600',
    },
  ],
};

/**
 * Creates a high-detail canvas rendering of a crop harvest sample and returns base64 JPEG.
 */
export function generateCropSampleImage(
  cropName: string,
  sampleType: 'A' | 'B' | 'C' | 'REJECT'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const name = cropName.toLowerCase();

  // Background - agricultural jute sack or wooden harvest crate texture
  const bgGrad = ctx.createLinearGradient(0, 0, 640, 480);
  bgGrad.addColorStop(0, '#d2b48c');
  bgGrad.addColorStop(0.5, '#c19a6b');
  bgGrad.addColorStop(1, '#a67b5b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 640, 480);

  // Subtle jute weave texture
  ctx.strokeStyle = 'rgba(80, 50, 20, 0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 640; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 480);
    ctx.stroke();
  }
  for (let y = 0; y < 480; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(640, y);
    ctx.stroke();
  }

  // Draw produce based on crop type
  const isGrain = name.includes('wheat') || name.includes('paddy') || name.includes('rice') || name.includes('gram') || name.includes('soy');
  const isTomato = name.includes('tomato');
  const isOnion = name.includes('onion');
  const isPotato = name.includes('potato');

  if (isGrain) {
    // Grain pile
    const pileGrad = ctx.createRadialGradient(320, 260, 50, 320, 260, 220);
    if (sampleType === 'A') {
      pileGrad.addColorStop(0, '#f9e4a3');
      pileGrad.addColorStop(0.8, '#d4af37');
      pileGrad.addColorStop(1, '#997a15');
    } else if (sampleType === 'B') {
      pileGrad.addColorStop(0, '#eed590');
      pileGrad.addColorStop(0.8, '#c29c30');
      pileGrad.addColorStop(1, '#856610');
    } else if (sampleType === 'C') {
      pileGrad.addColorStop(0, '#d1be82');
      pileGrad.addColorStop(0.8, '#a58220');
      pileGrad.addColorStop(1, '#654f0a');
    } else {
      // Moldy/damp grains
      pileGrad.addColorStop(0, '#807050');
      pileGrad.addColorStop(0.5, '#4a5d4e'); // greenish mold
      pileGrad.addColorStop(1, '#2c332d');
    }
    ctx.fillStyle = pileGrad;
    ctx.beginPath();
    ctx.ellipse(320, 260, 230, 150, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw individual grains
    ctx.fillStyle = sampleType === 'REJECT' ? '#3d443c' : sampleType === 'A' ? '#ffefb8' : '#e6ca7d';
    for (let i = 0; i < 400; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 200;
      const gx = 320 + Math.cos(angle) * dist;
      const gy = 260 + Math.sin(angle) * (dist * 0.65);
      ctx.beginPath();
      ctx.ellipse(gx, gy, 4, 2, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Round produce (Tomatoes, Onions, Potatoes, or general fruit/vegetables)
    const count = 7;
    const positions = [
      { x: 320, y: 240, r: 68 },
      { x: 230, y: 220, r: 62 },
      { x: 410, y: 220, r: 64 },
      { x: 270, y: 310, r: 60 },
      { x: 370, y: 310, r: 65 },
      { x: 190, y: 300, r: 52 },
      { x: 450, y: 290, r: 54 },
    ];

    positions.forEach((pos, idx) => {
      ctx.save();
      // Drop shadow
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 8;

      const grad = ctx.createRadialGradient(pos.x - 18, pos.y - 18, 5, pos.x, pos.y, pos.r);
      if (isTomato) {
        if (sampleType === 'A') {
          grad.addColorStop(0, '#ff4d4d');
          grad.addColorStop(0.4, '#e60000');
          grad.addColorStop(1, '#8b0000');
        } else if (sampleType === 'B') {
          grad.addColorStop(0, '#ff6655');
          grad.addColorStop(0.5, '#cc2211');
          grad.addColorStop(1, '#7a1105');
        } else if (sampleType === 'C') {
          grad.addColorStop(0, '#e07050');
          grad.addColorStop(0.5, '#b04020');
          grad.addColorStop(1, '#602010');
        } else {
          // Rotten black necrotic tomato
          grad.addColorStop(0, '#664433');
          grad.addColorStop(0.3, '#332211');
          grad.addColorStop(0.7, '#224422'); // moldy green
          grad.addColorStop(1, '#110a05');
        }
      } else if (isOnion) {
        if (sampleType === 'A') {
          grad.addColorStop(0, '#d97d95');
          grad.addColorStop(0.5, '#a63d57');
          grad.addColorStop(1, '#591626');
        } else if (sampleType === 'REJECT') {
          grad.addColorStop(0, '#554433');
          grad.addColorStop(0.5, '#223322');
          grad.addColorStop(1, '#111511');
        } else {
          grad.addColorStop(0, '#c77288');
          grad.addColorStop(0.5, '#913247');
          grad.addColorStop(1, '#47101c');
        }
      } else {
        // General crop / potato / vegetable
        if (sampleType === 'A') {
          grad.addColorStop(0, '#66bb6a');
          grad.addColorStop(0.5, '#2e7d32');
          grad.addColorStop(1, '#1b5e20');
        } else if (sampleType === 'REJECT') {
          grad.addColorStop(0, '#4e5a4f');
          grad.addColorStop(0.5, '#283329');
          grad.addColorStop(1, '#131a14');
        } else {
          grad.addColorStop(0, '#81c784');
          grad.addColorStop(0.5, '#388e3c');
          grad.addColorStop(1, '#1b5e20');
        }
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Highlights / Luster for Grade A
      if (sampleType === 'A') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(pos.x - 22, pos.y - 22, 14, 8, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Blemishes for Grade C
      if (sampleType === 'C' && idx % 2 === 0) {
        ctx.fillStyle = 'rgba(60, 30, 10, 0.6)';
        ctx.beginPath();
        ctx.arc(pos.x + 12, pos.y + 10, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mold / Rot spots for REJECT
      if (sampleType === 'REJECT') {
        // Grey-white fungal mold fuzzy patch
        ctx.fillStyle = 'rgba(220, 245, 230, 0.85)';
        ctx.beginPath();
        ctx.arc(pos.x + 8, pos.y - 6, 16, 0, Math.PI * 2);
        ctx.fill();
        // Mold spores
        ctx.fillStyle = '#2d5a3d';
        for (let s = 0; s < 12; s++) {
          ctx.fillRect(pos.x + 4 + (s % 4) * 3, pos.y - 10 + Math.floor(s / 4) * 4, 2, 2);
        }
      }
    });
  }

  // Stamp inspection header on image for AI vision assayer verification
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(16, 16, 320, 52);
  ctx.strokeStyle = sampleType === 'A' ? '#10b981' : sampleType === 'REJECT' ? '#ef4444' : '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`KrishiSetu Mandi Assayer Sample`, 28, 38);
  ctx.font = '12px sans-serif';
  ctx.fillStyle = sampleType === 'A' ? '#6ee7b7' : sampleType === 'REJECT' ? '#fca5a5' : '#fcd34d';
  ctx.fillText(
    `${cropName.toUpperCase()} • ${sampleType === 'REJECT' ? 'Rot / Mold Defect' : `Grade ${sampleType} Reference`}`,
    28,
    56
  );

  return canvas.toDataURL('image/jpeg', 0.92);
}
