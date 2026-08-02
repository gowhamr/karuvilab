/**
 * KaruviLab (KV) Local AI Engine - Model Registry
 * Central descriptive manifest store for all supported ONNX models
 */

import { ModelManifest } from './types';

const MODEL_REGISTRY: Record<string, ModelManifest> = {
  'background-removal-rmbg': {
    id: 'background-removal-rmbg',
    name: 'RMBG 2.0 (Quantized)',
    version: '2.0',
    file: '/models/rmbg-2.0.onnx',
    sizeMB: 18.4,
    backend: ['webgpu', 'wasm'],
    input: {
      width: 1024,
      height: 1024,
      channels: 3,
      dataType: 'float32'
    },
    output: {
      channels: 1,
      dataType: 'float32'
    },
    description: 'High-accuracy in-browser portrait & object background removal model.',
    license: 'Open-Rail'
  }
};

export function getModelManifest(id: string): ModelManifest | undefined {
  return MODEL_REGISTRY[id];
}

export function registerModel(manifest: ModelManifest): void {
  MODEL_REGISTRY[manifest.id] = manifest;
}

export function getAllRegisteredModels(): ModelManifest[] {
  return Object.values(MODEL_REGISTRY);
}
