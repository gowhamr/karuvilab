/**
 * KaruviLab (KV) AI Document Intelligence - Cleanup Engine (Deskew & Denoise)
 */

export interface CleanupOptions {
  deskew?: boolean;
  denoise?: boolean;
  contrast?: boolean;
}

export function applyDocumentCleanup(
  canvas: HTMLCanvasElement,
  options: CleanupOptions
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  if (options.contrast) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      const avg = ((data[i] ?? 0) + (data[i + 1] ?? 0) + (data[i + 2] ?? 0)) / 3;
      const v = avg > 140 ? 255 : Math.max(0, avg - 20);
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}
