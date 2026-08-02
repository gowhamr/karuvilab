/**
 * KaruviLab (KV) AI Platform v1.0 - Argmax Index Selection
 */

export interface ArgmaxResult {
  maxIndex: number;
  confidence: number;
}

export function findArgmax(probabilities: Float32Array): ArgmaxResult {
  let maxIndex = 0;
  let maxVal = -Infinity;

  for (let i = 0; i < probabilities.length; i++) {
    const val = probabilities[i] ?? 0;
    if (val > maxVal) {
      maxVal = val;
      maxIndex = i;
    }
  }

  return {
    maxIndex,
    confidence: maxVal
  };
}
