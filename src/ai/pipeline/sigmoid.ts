/**
 * KaruviLab (KV) AI Platform v1.0 - Sigmoid Activation
 */

export function applySigmoid(tensor: Float32Array): Float32Array {
  const result = new Float32Array(tensor.length);
  for (let i = 0; i < tensor.length; i++) {
    const val = tensor[i] ?? 0;
    result[i] = 1.0 / (1.0 + Math.exp(-val));
  }
  return result;
}
