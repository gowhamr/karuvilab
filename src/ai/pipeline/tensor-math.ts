/**
 * KaruviLab (KV) AI Platform v1.0 - Consolidated Tensor Math & Pipeline Utilities
 */

export interface TensorBuffer {
  data: Float32Array | Uint8Array | Int32Array;
  shape: number[];
  dataType: 'float32' | 'uint8' | 'int32';
}

export function createFloat32Tensor(shape: number[], initialValue = 0): TensorBuffer {
  const size = shape.reduce((acc, dim) => acc * dim, 1);
  const data = new Float32Array(size);
  if (initialValue !== 0) {
    data.fill(initialValue);
  }
  return {
    data,
    shape,
    dataType: 'float32'
  };
}

export function reshapeTensor(tensor: TensorBuffer, newShape: number[]): TensorBuffer {
  const oldSize = tensor.shape.reduce((acc, dim) => acc * dim, 1);
  const newSize = newShape.reduce((acc, dim) => acc * dim, 1);
  if (oldSize !== newSize) {
    throw new Error(`Cannot reshape tensor of size ${oldSize} to shape [${newShape.join(', ')}] of size ${newSize}`);
  }
  return {
    ...tensor,
    shape: newShape
  };
}

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

export function applySigmoid(tensor: Float32Array): Float32Array {
  const result = new Float32Array(tensor.length);
  for (let i = 0; i < tensor.length; i++) {
    const val = tensor[i] ?? 0;
    result[i] = 1.0 / (1.0 + Math.exp(-val));
  }
  return result;
}

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

export interface TileBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function generateTiles(
  imageWidth: number,
  imageHeight: number,
  tileSize = 256,
  overlap = 16
): TileBounds[] {
  const tiles: TileBounds[] = [];
  const stride = tileSize - overlap;

  for (let y = 0; y < imageHeight; y += stride) {
    for (let x = 0; x < imageWidth; x += stride) {
      const width = Math.min(tileSize, imageWidth - x);
      const height = Math.min(tileSize, imageHeight - y);
      tiles.push({ x, y, width, height });
    }
  }

  return tiles;
}
