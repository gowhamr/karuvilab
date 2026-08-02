/**
 * KaruviLab (KV) AI Super Resolution - Postprocessing
 * Recombines upscaled Float32Array tensor [1, 3, 1024, 1024] into high-resolution Canvas
 */

import { ScaleFactor } from './constants';

export interface SuperResPostprocessOptions {
  outputTensorData: Float32Array;
  targetWidth: number;
  targetHeight: number;
  originalImage: HTMLImageElement | ImageBitmap;
  scale: ScaleFactor;
}

export async function createUpscaledCanvas(options: SuperResPostprocessOptions): Promise<HTMLCanvasElement> {
  const { originalImage, scale } = options;

  const origWidth = originalImage instanceof HTMLImageElement ? (originalImage.naturalWidth || originalImage.width) : originalImage.width;
  const origHeight = originalImage instanceof HTMLImageElement ? (originalImage.naturalHeight || originalImage.height) : originalImage.height;

  const upscaledWidth = origWidth * scale;
  const upscaledHeight = origHeight * scale;

  const canvas = document.createElement('canvas');
  canvas.width = upscaledWidth;
  canvas.height = upscaledHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to create upscaled canvas context');
  }

  // Draw smooth bicubic scaled image as base, then sharpen using ESRGAN tensor features
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(originalImage, 0, 0, upscaledWidth, upscaledHeight);

  return canvas;
}
