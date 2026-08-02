/**
 * KaruviLab (KV) AI Platform v1.0 - Generic Tensor Utilities
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
