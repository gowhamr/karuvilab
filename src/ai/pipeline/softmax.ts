/**
 * KaruviLab (KV) AI Platform v1.0 - Softmax Activation
 */

export function applySoftmax(logits: Float32Array): Float32Array {
  const result = new Float32Array(logits.length);
  let maxLogit = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if ((logits[i] ?? 0) > maxLogit) {
      maxLogit = logits[i] ?? 0;
    }
  }

  let sumExp = 0;
  for (let i = 0; i < logits.length; i++) {
    const expVal = Math.exp((logits[i] ?? 0) - maxLogit);
    result[i] = expVal;
    sumExp += expVal;
  }

  if (sumExp > 0) {
    for (let i = 0; i < logits.length; i++) {
      result[i] = (result[i] ?? 0) / sumExp;
    }
  }

  return result;
}
