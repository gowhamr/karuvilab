/**
 * KaruviLab Canvas Image Engine
 * Shared utility for all Canvas-based image operations.
 * Used by: Image Flip, Image Mirror, Canvas Resize, Image Padding,
 *          Border Generator, Aspect Ratio Converter, Advanced Rotate
 * 
 * All functions accept an HTMLImageElement and return a Promise<Blob>.
 * No duplicated pixel-processing logic across tools.
 */

export type FlipDirection = 'horizontal' | 'vertical' | 'both';

export type Anchor = 'top-left' | 'top-center' | 'top-right' |
                     'center-left' | 'center' | 'center-right' |
                     'bottom-left' | 'bottom-center' | 'bottom-right';

export interface PaddingConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BorderConfig {
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  radius: number;
}

export interface AspectRatioPreset {
  label: string;
  width: number;
  height: number;
}

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { label: '1:1', width: 1, height: 1 },
  { label: '4:3', width: 4, height: 3 },
  { label: '3:4', width: 3, height: 4 },
  { label: '16:9', width: 16, height: 9 },
  { label: '9:16', width: 9, height: 16 },
  { label: '3:2', width: 3, height: 2 },
  { label: '2:3', width: 2, height: 3 },
  { label: '21:9', width: 21, height: 9 },
];

export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

const DEFAULT_QUALITY = 0.92;

// ---------- Internal helpers ----------

function createCanvas(width: number, height: number): [HTMLCanvasElement | OffscreenCanvas, CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D] {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      return [canvas, ctx as OffscreenCanvasRenderingContext2D];
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return [canvas, ctx];
}

function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  format: OutputFormat = 'image/png',
  quality: number = DEFAULT_QUALITY,
): Promise<Blob> {
  if (canvas instanceof OffscreenCanvas) {
    const options: ImageEncodeOptions = { type: format };
    if (format !== 'image/png') options.quality = quality;
    return canvas.convertToBlob(options);
  }

  return new Promise((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to export canvas to blob'));
      },
      format,
      format === 'image/png' ? undefined : quality,
    );
  });
}

function getAnchorOffset(
  anchor: Anchor,
  outerW: number,
  outerH: number,
  innerW: number,
  innerH: number,
): { x: number; y: number } {
  let x = 0;
  let y = 0;

  if (anchor.includes('center') && !anchor.includes('left') && !anchor.includes('right')) {
    x = Math.round((outerW - innerW) / 2);
  } else if (anchor.includes('right')) {
    x = outerW - innerW;
  }

  if (anchor.includes('center') && !anchor.includes('top') && !anchor.includes('bottom')) {
    y = Math.round((outerH - innerH) / 2);
  } else if (anchor.includes('bottom')) {
    y = outerH - innerH;
  }

  return { x, y };
}

// ---------- Public API ----------

/**
 * Flip an image horizontally, vertically, or both.
 */
export function flipImage(
  img: HTMLImageElement | ImageBitmap,
  direction: FlipDirection,
  format: OutputFormat = 'image/png',
  quality: number = DEFAULT_QUALITY,
): Promise<Blob> {
  const w = img.width || (img as any).naturalWidth;
  const h = img.height || (img as any).naturalHeight;
  const [canvas, ctx] = createCanvas(w, h);

  const scaleX = direction === 'horizontal' || direction === 'both' ? -1 : 1;
  const scaleY = direction === 'vertical' || direction === 'both' ? -1 : 1;
  const dx = scaleX === -1 ? -w : 0;
  const dy = scaleY === -1 ? -h : 0;

  ctx.scale(scaleX, scaleY);
  ctx.drawImage(img, dx, dy, w, h);

  return canvasToBlob(canvas, format, quality);
}

/**
 * Mirror an image (horizontal flip — alias with semantic name).
 */
export function mirrorImage(
  img: HTMLImageElement | ImageBitmap,
  format: OutputFormat = 'image/png',
  quality: number = DEFAULT_QUALITY,
): Promise<Blob> {
  return flipImage(img, 'horizontal', format, quality);
}

/**
 * Resize the canvas around an image with an anchor point.
 * The image stays the same size; the workspace grows/shrinks.
 */
export function resizeCanvas(
  img: HTMLImageElement | ImageBitmap,
  newWidth: number,
  newHeight: number,
  anchor: Anchor = 'center',
  bgColor: string = 'transparent',
  format: OutputFormat = 'image/png',
  quality: number = DEFAULT_QUALITY,
): Promise<Blob> {
  const w = img.width || (img as any).naturalWidth;
  const h = img.height || (img as any).naturalHeight;
  const [canvas, ctx] = createCanvas(newWidth, newHeight);

  if (bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, newWidth, newHeight);
  }

  const { x, y } = getAnchorOffset(anchor, newWidth, newHeight, w, h);
  ctx.drawImage(img, x, y, w, h);

  return canvasToBlob(canvas, format, quality);
}

/**
 * Add padding around an image.
 */
export function addPadding(
  img: HTMLImageElement | ImageBitmap,
  padding: PaddingConfig,
  bgColor: string = '#ffffff',
  format: OutputFormat = 'image/png',
  quality: number = DEFAULT_QUALITY,
): Promise<Blob> {
  const w = img.width || (img as any).naturalWidth;
  const h = img.height || (img as any).naturalHeight;
  const newW = w + padding.left + padding.right;
  const newH = h + padding.top + padding.bottom;
  const [canvas, ctx] = createCanvas(newW, newH);

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, newW, newH);
  ctx.drawImage(img, padding.left, padding.top, w, h);

  return canvasToBlob(canvas, format, quality);
}

/**
 * Add a border around an image.
 */
export function addBorder(
  img: HTMLImageElement | ImageBitmap,
  border: BorderConfig,
  format: OutputFormat = 'image/png',
  quality: number = DEFAULT_QUALITY,
): Promise<Blob> {
  const w = img.width || (img as any).naturalWidth;
  const h = img.height || (img as any).naturalHeight;
  const bw = border.width;
  const newW = w + bw * 2;
  const newH = h + bw * 2;
  const [canvas, ctx] = createCanvas(newW, newH);

  // Draw border background
  ctx.fillStyle = border.color;
  if (border.radius > 0) {
    roundRect(ctx, 0, 0, newW, newH, border.radius);
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, newW, newH);
  }

  // Handle border styles
  if (border.style === 'dashed' || border.style === 'dotted') {
    // Clear inner area first
    ctx.clearRect(bw, bw, w, h);
    // Draw border with line style
    ctx.strokeStyle = border.color;
    ctx.lineWidth = bw;
    ctx.setLineDash(border.style === 'dashed' ? [bw * 2, bw] : [bw, bw]);
    const offset = bw / 2;
    if (border.radius > 0) {
      roundRect(ctx, offset, offset, newW - bw, newH - bw, border.radius);
      ctx.stroke();
    } else {
      ctx.strokeRect(offset, offset, newW - bw, newH - bw);
    }
    ctx.setLineDash([]);
  } else if (border.style === 'double') {
    // Outer border
    ctx.fillStyle = border.color;
    ctx.fillRect(0, 0, newW, newH);
    // Gap
    const gap = Math.max(1, Math.floor(bw / 3));
    ctx.clearRect(gap, gap, newW - gap * 2, newH - gap * 2);
    // Inner border
    ctx.fillStyle = border.color;
    ctx.fillRect(gap * 2, gap * 2, newW - gap * 4, newH - gap * 4);
    // Clear center
    ctx.clearRect(bw, bw, w, h);
  }

  // Draw the image inside the border
  if (border.radius > 0) {
    ctx.save();
    roundRect(ctx, bw, bw, w, h, Math.max(0, border.radius - bw));
    ctx.clip();
    ctx.drawImage(img, bw, bw, w, h);
    ctx.restore();
  } else {
    ctx.drawImage(img, bw, bw, w, h);
  }

  return canvasToBlob(canvas, format, quality);
}

/**
 * Convert an image to a target aspect ratio.
 * mode 'crop' — center-crop to fit ratio
 * mode 'pad'  — pad with bgColor to fit ratio
 */
export function convertAspectRatio(
  img: HTMLImageElement | ImageBitmap,
  targetW: number,
  targetH: number,
  mode: 'crop' | 'pad' = 'pad',
  bgColor: string = '#ffffff',
  format: OutputFormat = 'image/png',
  quality: number = DEFAULT_QUALITY,
): Promise<Blob> {
  const w = img.width || (img as any).naturalWidth;
  const h = img.height || (img as any).naturalHeight;
  const targetRatio = targetW / targetH;
  const currentRatio = w / h;

  if (mode === 'crop') {
    let srcX = 0, srcY = 0, srcW = w, srcH = h;
    if (currentRatio > targetRatio) {
      srcW = Math.round(h * targetRatio);
      srcX = Math.round((w - srcW) / 2);
    } else {
      srcH = Math.round(w / targetRatio);
      srcY = Math.round((h - srcH) / 2);
    }
    const [canvas, ctx] = createCanvas(srcW, srcH);
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    return canvasToBlob(canvas, format, quality);
  } else {
    let newW: number, newH: number;
    if (currentRatio > targetRatio) {
      newW = w;
      newH = Math.round(w / targetRatio);
    } else {
      newH = h;
      newW = Math.round(h * targetRatio);
    }
    const [canvas, ctx] = createCanvas(newW, newH);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, newW, newH);
    const x = Math.round((newW - w) / 2);
    const y = Math.round((newH - h) / 2);
    ctx.drawImage(img, x, y, w, h);
    return canvasToBlob(canvas, format, quality);
  }
}

/**
 * Rotate an image by arbitrary degrees.
 * Calculates bounding box so no part of the image is clipped.
 */
export function rotateImage(
  img: HTMLImageElement | ImageBitmap,
  degrees: number,
  bgColor: string = 'transparent',
  format: OutputFormat = 'image/png',
  quality: number = DEFAULT_QUALITY,
): Promise<Blob> {
  const w = img.width || (img as any).naturalWidth;
  const h = img.height || (img as any).naturalHeight;
  const rad = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const newW = Math.ceil(w * cos + h * sin);
  const newH = Math.ceil(w * sin + h * cos);

  const [canvas, ctx] = createCanvas(newW, newH);

  if (bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, newW, newH);
  }

  ctx.translate(newW / 2, newH / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);

  return canvasToBlob(canvas, format, quality);
}

// ---------- Internal drawing helpers ----------

function roundRect(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
