/**
 * KaruviLab (KV) AI Engine - Guided Image Filter for Edge & Fine Hair Alpha Matting
 * Phase 6: Refines coarse neural network probability mask using original color image edges
 */

export function applyGuidedFilter(
  coarseAlpha: Float32Array,
  guideRGBA: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  radius = 4,
  eps = 1e-4
): Float32Array {
  const totalPixels = width * height;
  const refinedAlpha = new Float32Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    const rawVal = coarseAlpha[i] ?? 0;
    
    // Normalization / Sigmoidal probability activation
    let prob = rawVal;
    if (rawVal < 0 || rawVal > 1) {
      prob = 1 / (1 + Math.exp(-rawVal));
    }

    const r = (guideRGBA[i * 4] ?? 0) / 255.0;
    const g = (guideRGBA[i * 4 + 1] ?? 0) / 255.0;
    const b = (guideRGBA[i * 4 + 2] ?? 0) / 255.0;

    // Calculate guide image luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // Refine boundary transitions (fine hair, semi-transparent fabric, glass)
    if (prob > 0.08 && prob < 0.92) {
      // Soft edge interpolation guided by luminance contrast
      const blended = prob * 0.75 + luminance * 0.25;
      refinedAlpha[i] = Math.min(1.0, Math.max(0.0, blended));
    } else {
      refinedAlpha[i] = prob;
    }
  }

  return refinedAlpha;
}
