/**
 * KaruviLab (KV) AI Document Intelligence - Preprocessing
 */

export interface DocumentPreprocessOptions {
  width: number;
  height: number;
  contrast?: number;
}

export function preprocessDocumentCanvas(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  options: DocumentPreprocessOptions
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, options.width, options.height);
  const { data } = imageData;
  const contrastFactor = (259 * ((options.contrast || 15) + 255)) / (255 * (259 - (options.contrast || 15)));

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] ?? 0;
    let g = data[i + 1] ?? 0;
    let b = data[i + 2] ?? 0;

    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  ctx.putImageData(imageData, 0, 0);
}
