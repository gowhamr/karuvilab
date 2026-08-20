/**
 * KaruviLab (KV) AI Background Remover - Backdrop Compositor
 * Provides instant solid color & studio background replacements for Canvas & AI cutouts.
 */

export type BackdropType = 'transparent' | 'solid' | 'studio';

export interface StudioPreset {
  id: string;
  name: string;
  description: string;
  cssPreview: string;
  draw: (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, width: number, height: number) => void;
}

export const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: 'studio-soft-spotlight',
    name: 'Soft Spotlight',
    description: 'Clean bright studio with soft radial vignette',
    cssPreview: 'radial-gradient(circle at 50% 35%, #ffffff 0%, #cbd5e1 100%)',
    draw: (ctx, width, height) => {
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.35, width * 0.1, width * 0.5, height * 0.5, Math.max(width, height) * 0.75);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  },
  {
    id: 'studio-portrait-slate',
    name: 'Portrait Slate',
    description: 'Professional dark slate studio backdrop',
    cssPreview: 'radial-gradient(circle at 50% 30%, #334155 0%, #0f172a 100%)',
    draw: (ctx, width, height) => {
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.3, width * 0.08, width * 0.5, height * 0.5, Math.max(width, height) * 0.8);
      grad.addColorStop(0, '#334155');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  },
  {
    id: 'studio-warm-sunset',
    name: 'Warm Sunset',
    description: 'Golden ambient gradient for lifestyle and portraits',
    cssPreview: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%)',
    draw: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fff7ed');
      grad.addColorStop(0.5, '#fed7aa');
      grad.addColorStop(1, '#fb923c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  },
  {
    id: 'studio-clean-pastel',
    name: 'Clean Pastel',
    description: 'Subtle modern pastel glow for product showcases',
    cssPreview: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
    draw: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#f0fdf4');
      grad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  },
  {
    id: 'studio-executive-navy',
    name: 'Executive Navy',
    description: 'Corporate royal navy to deep midnight blue',
    cssPreview: 'linear-gradient(180deg, #1e3a8a 0%, #0f172a 100%)',
    draw: (ctx, width, height) => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#1e3a8a');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  },
  {
    id: 'studio-cyber-neon',
    name: 'Cyber Neon',
    description: 'Electric indigo radial glow on deep void',
    cssPreview: 'radial-gradient(circle at 50% 50%, #312e81 0%, #030712 100%)',
    draw: (ctx, width, height) => {
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.05, width * 0.5, height * 0.5, Math.max(width, height) * 0.7);
      grad.addColorStop(0, '#312e81');
      grad.addColorStop(1, '#030712');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  },
  {
    id: 'studio-dark-stage',
    name: 'Dark Stage',
    description: 'Focused dramatic spotlight on jet black background',
    cssPreview: 'radial-gradient(circle at 50% 25%, #475569 0%, #020617 85%)',
    draw: (ctx, width, height) => {
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.25, width * 0.05, width * 0.5, height * 0.5, Math.max(width, height) * 0.85);
      grad.addColorStop(0, '#475569');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }
];

export interface CompositeOptions {
  cutoutImage: HTMLImageElement | ImageBitmap | HTMLCanvasElement | OffscreenCanvas;
  width: number;
  height: number;
  backdropType: BackdropType;
  solidColor?: string;
  studioPresetId?: string;
}

/**
 * Composite cutout foreground onto a target backdrop (transparent, solid color, or studio gradient)
 */
export async function compositeCutoutWithBackdrop(options: CompositeOptions): Promise<Blob> {
  const { cutoutImage, width, height, backdropType, solidColor = '#ffffff', studioPresetId } = options;

  let canvas: HTMLCanvasElement | OffscreenCanvas;
  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext('2d');
  } else {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
  }

  if (!ctx) {
    throw new Error('Failed to create compositing canvas context');
  }

  // 1. Draw Backdrop
  if (backdropType === 'solid') {
    ctx.fillStyle = solidColor;
    ctx.fillRect(0, 0, width, height);
  } else if (backdropType === 'studio') {
    const preset = STUDIO_PRESETS.find((p) => p.id === studioPresetId) || STUDIO_PRESETS[0]!;
    preset.draw(ctx, width, height);
  } else {
    // Transparent: clear background
    ctx.clearRect(0, 0, width, height);
  }

  // 2. Draw Foreground Cutout
  ctx.drawImage(cutoutImage, 0, 0, width, height);

  // 3. Export Blob
  if (canvas instanceof OffscreenCanvas) {
    return await canvas.convertToBlob({
      type: backdropType === 'transparent' ? 'image/png' : 'image/jpeg',
      quality: 0.95
    });
  } else {
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to convert canvas to blob'));
        },
        backdropType === 'transparent' ? 'image/png' : 'image/jpeg',
        0.95
      );
    });
  }
}

/**
 * Auto-detect the predominant background color by sampling the 4 corners and borders of an image
 */
export function autoDetectBackgroundColor(img: HTMLImageElement | ImageBitmap): string {
  const width = img instanceof HTMLImageElement ? (img.naturalWidth || img.width) : img.width;
  const height = img instanceof HTMLImageElement ? (img.naturalHeight || img.height) : img.height;

  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = Math.min(width, 100);
  sampleCanvas.height = Math.min(height, 100);
  const ctx = sampleCanvas.getContext('2d');
  if (!ctx) return '#ffffff';

  ctx.drawImage(img, 0, 0, sampleCanvas.width, sampleCanvas.height);
  const data = ctx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;

  // Sample corner pixel colors: top-left, top-right, bottom-left, bottom-right
  const sw = sampleCanvas.width;
  const sh = sampleCanvas.height;
  const sampleIndices = [
    0, // (0,0)
    (sw - 1) * 4, // (sw-1, 0)
    ((sh - 1) * sw) * 4, // (0, sh-1)
    ((sh - 1) * sw + (sw - 1)) * 4 // (sw-1, sh-1)
  ];

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;

  for (const idx of sampleIndices) {
    rSum += data[idx] ?? 255;
    gSum += data[idx + 1] ?? 255;
    bSum += data[idx + 2] ?? 255;
  }

  const r = Math.round(rSum / sampleIndices.length).toString(16).padStart(2, '0');
  const g = Math.round(gSum / sampleIndices.length).toString(16).padStart(2, '0');
  const b = Math.round(bSum / sampleIndices.length).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}
