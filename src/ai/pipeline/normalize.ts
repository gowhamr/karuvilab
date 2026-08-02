/**
 * KaruviLab (KV) AI Platform v1.0 - Generic Pixel Normalization
 */

export type NormalizationRange = 'zero-to-one' | 'minus-one-to-one' | 'imagenet';

export function normalizePixels(
  rgbaPixels: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  range: NormalizationRange = 'zero-to-one'
): Float32Array {
  const pixelCount = width * height;
  const tensor = new Float32Array(3 * pixelCount);

  const mean = range === 'imagenet' ? [0.485, 0.456, 0.406] : [0, 0, 0];
  const std = range === 'imagenet' ? [0.229, 0.224, 0.225] : [1, 1, 1];

  for (let i = 0; i < pixelCount; i++) {
    let r = (rgbaPixels[i * 4] ?? 0) / 255.0;
    let g = (rgbaPixels[i * 4 + 1] ?? 0) / 255.0;
    let b = (rgbaPixels[i * 4 + 2] ?? 0) / 255.0;

    if (range === 'minus-one-to-one') {
      r = r * 2.0 - 1.0;
      g = g * 2.0 - 1.0;
      b = b * 2.0 - 1.0;
    } else if (range === 'imagenet') {
      r = (r - (mean[0] ?? 0)) / (std[0] ?? 1);
      g = (g - (mean[1] ?? 0)) / (std[1] ?? 1);
      b = (b - (mean[2] ?? 0)) / (std[2] ?? 1);
    }

    tensor[i] = r;
    tensor[pixelCount + i] = g;
    tensor[pixelCount * 2 + i] = b;
  }

  return tensor;
}
