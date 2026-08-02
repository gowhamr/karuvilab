/**
 * KaruviLab (KV) Generic Detection Engine - Preprocessing
 * Resizes image to Float32 tensor [1, 3, 640, 640]
 */

export interface DetectionPreprocessResult {
  tensorData: Float32Array;
  originalWidth: number;
  originalHeight: number;
  scaleX: number;
  scaleY: number;
}

export async function preprocessDetectionImage(
  imageSource: HTMLImageElement | ImageBitmap | ImageData,
  targetWidth = 640,
  targetHeight = 640
): Promise<DetectionPreprocessResult> {
  let origWidth = 0;
  let origHeight = 0;

  if (imageSource instanceof HTMLImageElement) {
    origWidth = imageSource.naturalWidth || imageSource.width;
    origHeight = imageSource.naturalHeight || imageSource.height;
  } else if (imageSource instanceof ImageBitmap || imageSource instanceof ImageData) {
    origWidth = imageSource.width;
    origHeight = imageSource.height;
  }

  const canvas = typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(targetWidth, targetHeight)
    : document.createElement('canvas');

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  if (!ctx) {
    throw new Error('Failed to create detection preprocessing canvas context');
  }

  if (imageSource instanceof ImageData) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = origWidth;
    tempCanvas.height = origHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx?.putImageData(imageSource, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
  } else {
    ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
  }

  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const { data } = imageData;

  const channelSize = targetWidth * targetHeight;
  const tensorData = new Float32Array(3 * channelSize);

  for (let i = 0; i < channelSize; i++) {
    const r = (data[i * 4] ?? 0) / 255.0;
    const g = (data[i * 4 + 1] ?? 0) / 255.0;
    const b = (data[i * 4 + 2] ?? 0) / 255.0;

    tensorData[i] = r;
    tensorData[channelSize + i] = g;
    tensorData[channelSize * 2 + i] = b;
  }

  return {
    tensorData,
    originalWidth: origWidth,
    originalHeight: origHeight,
    scaleX: origWidth / targetWidth,
    scaleY: origHeight / targetHeight
  };
}
