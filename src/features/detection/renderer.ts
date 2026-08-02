/**
 * KaruviLab (KV) Generic Detection Engine - Bounding Box Privacy Renderer
 * Renders Pixelated or Gaussian Blur effects onto Canvas over detected boxes
 */

import { DetectedObjectBox } from './postprocess';
import { BlurStyle } from './constants';

export interface RenderBlurOptions {
  image: HTMLImageElement | ImageBitmap;
  boxes: DetectedObjectBox[];
  style: BlurStyle;
  blurStrength?: number; // 5 to 50
}

export async function renderBlurredCanvas(options: RenderBlurOptions): Promise<HTMLCanvasElement> {
  const { image, boxes, style, blurStrength = 20 } = options;

  const width = image instanceof HTMLImageElement ? (image.naturalWidth || image.width) : image.width;
  const height = image instanceof HTMLImageElement ? (image.naturalHeight || image.height) : image.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to create blur renderer canvas context');
  }

  // Draw original image
  ctx.drawImage(image, 0, 0, width, height);

  // Apply privacy blur over detected bounding boxes
  for (const box of boxes) {
    if (box.width <= 0 || box.height <= 0) continue;

    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.clip();

    if (style === 'pixelate') {
      // Pixelate effect by downscaling region then upscaling without smoothing
      const pixelSize = Math.max(4, Math.round(blurStrength / 2));
      const smallWidth = Math.max(1, Math.round(box.width / pixelSize));
      const smallHeight = Math.max(1, Math.round(box.height / pixelSize));

      const offscreen = document.createElement('canvas');
      offscreen.width = smallWidth;
      offscreen.height = smallHeight;
      const offCtx = offscreen.getContext('2d');

      if (offCtx) {
        offCtx.drawImage(image, box.x, box.y, box.width, box.height, 0, 0, smallWidth, smallHeight);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offscreen, 0, 0, smallWidth, smallHeight, box.x, box.y, box.width, box.height);
      }
    } else {
      // Gaussian Blur effect via CSS filter
      ctx.filter = `blur(${blurStrength}px)`;
      ctx.drawImage(image, 0, 0, width, height);
    }

    ctx.restore();
  }

  return canvas;
}
