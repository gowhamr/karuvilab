/**
 * KaruviLab (KV) AI Background Remover - Postprocessing
 * Converts raw output alpha mask tensor [1, 1, 1024, 1024] back to high-res transparent Canvas
 */

export interface PostprocessOptions {
  outputTensorData: Float32Array;
  maskWidth: number;
  maskHeight: number;
  originalImage: HTMLImageElement | ImageBitmap;
  threshold?: number; // 0.0 to 1.0 threshold
}

export async function createTransparentCanvas(options: PostprocessOptions): Promise<HTMLCanvasElement> {
  const { outputTensorData, maskWidth, maskHeight, originalImage, threshold = 0.5 } = options;

  const origWidth = originalImage instanceof HTMLImageElement ? (originalImage.naturalWidth || originalImage.width) : originalImage.width;
  const origHeight = originalImage instanceof HTMLImageElement ? (originalImage.naturalHeight || originalImage.height) : originalImage.height;

  // 1. Create a 1024x1024 mask canvas from the raw float32 output tensor
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = maskWidth;
  maskCanvas.height = maskHeight;
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) {
    throw new Error('Failed to create mask canvas context');
  }

  const maskImageData = maskCtx.createImageData(maskWidth, maskHeight);
  const maskPixels = maskImageData.data;

  const totalPixels = maskWidth * maskHeight;
  for (let i = 0; i < totalPixels; i++) {
    const rawVal = outputTensorData[i] ?? 0; // Float32 opacity probability
    
    // Apply sigmoid activation if model output is unscaled logits, or thresholding
    let alpha = rawVal;
    if (rawVal < 0 || rawVal > 1) {
      alpha = 1 / (1 + Math.exp(-rawVal)); // Sigmoid
    }

    const alphaByte = alpha >= threshold ? Math.round(alpha * 255) : 0;

    maskPixels[i * 4] = 255;     // Red
    maskPixels[i * 4 + 1] = 255; // Green
    maskPixels[i * 4 + 2] = 255; // Blue
    maskPixels[i * 4 + 3] = alphaByte; // Alpha
  }

  maskCtx.putImageData(maskImageData, 0, 0);

  // 2. Composite original high-res image with scaled alpha mask
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = origWidth;
  resultCanvas.height = origHeight;
  const resultCtx = resultCanvas.getContext('2d');
  if (!resultCtx) {
    throw new Error('Failed to create result canvas context');
  }

  // Draw original high-res image first
  resultCtx.drawImage(originalImage, 0, 0, origWidth, origHeight);

  // Use destination-in composite operation to apply smoothed alpha mask
  resultCtx.globalCompositeOperation = 'destination-in';
  resultCtx.drawImage(maskCanvas, 0, 0, origWidth, origHeight);
  resultCtx.globalCompositeOperation = 'source-over';

  return resultCanvas;
}
