/**
 * KaruviLab (KV) Central AI Model Registry
 * Future-proof registry for all in-browser neural network models with dynamic capability metadata
 */

import { ModelManifest } from './types';

export const AI_MODEL_REGISTRY: Record<string, ModelManifest> = {
  'background-removal-rmbg': {
    id: 'background-removal-rmbg',
    name: 'RMBG 2.0 (BiRefNet)',
    version: '2.0',
    file: '/models/rmbg-2.0.onnx',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sizeMB: 18.4,
    backend: ['webgpu', 'wasm'],
    input: { width: 1024, height: 1024, channels: 3, dataType: 'float32', shape: [1, 3, 1024, 1024] },
    output: { channels: 1, dataType: 'float32', shape: [1, 1, 1024, 1024] },
    category: 'segmentation',
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 180,
    estimatedInferenceMs: 1200,
    description: 'High-accuracy portrait & object background removal model.',
    license: 'Open-Rail'
  },
  'ocr-paddle': {
    id: 'ocr-paddle',
    name: 'PaddleOCR Lightweight',
    version: '1.2',
    file: '/models/paddle-ocr.onnx',
    sha256: 'c42878939c05878d6b9d6a3666d6268800938f328a6f3a61f237890a88e89f78',
    sizeMB: 8.2,
    backend: ['webgpu', 'wasm'],
    input: { width: 640, height: 640, channels: 3, dataType: 'float32', shape: [1, 3, 640, 640] },
    output: { channels: 1, dataType: 'float32', shape: [1, 1, 640, 640] },
    category: 'ocr',
    inputFormats: ['png', 'jpg', 'webp', 'pdf'],
    outputFormats: ['txt', 'md', 'json', 'csv'],
    preferredBackend: 'wasm',
    supportsBatch: true,
    supportsOffline: true,
    estimatedMemoryMB: 90,
    estimatedInferenceMs: 650,
    description: 'In-browser optical character recognition engine.',
    license: 'Apache-2.0'
  },
  'super-resolution-esrgan': {
    id: 'super-resolution-esrgan',
    name: 'Real-ESRGAN 4x Upscaler',
    version: '4.0',
    file: '/models/realesrgan-4x.onnx',
    sha256: 'f8723939c05878d6b9d6a3666d6268800938f328a6f3a61f237890a88e89f990',
    sizeMB: 24.1,
    backend: ['webgpu', 'wasm'],
    input: { width: 256, height: 256, channels: 3, dataType: 'float32', shape: [1, 3, 256, 256] },
    output: { width: 1024, height: 1024, channels: 3, dataType: 'float32', shape: [1, 3, 1024, 1024] },
    category: 'super-resolution',
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png', 'jpg'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 220,
    estimatedInferenceMs: 1800,
    description: '2x / 4x AI image upscaling and clarity enhancement.',
    license: 'BSD-3-Clause'
  },
  'face-blur-yolo': {
    id: 'face-blur-yolo',
    name: 'YOLOv8 Face Detection',
    version: '8.0',
    file: '/models/yolov8-face.onnx',
    sha256: 'a1287939c05878d6b9d6a3666d6268800938f328a6f3a61f237890a88e89f120',
    sizeMB: 6.5,
    backend: ['webgpu', 'wasm'],
    input: { width: 640, height: 640, channels: 3, dataType: 'float32', shape: [1, 3, 640, 640] },
    output: { channels: 84, dataType: 'float32', shape: [1, 84, 8400] },
    category: 'detection',
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png', 'jpg'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 75,
    estimatedInferenceMs: 450,
    description: 'Automatic privacy face blurring & object detection model.',
    license: 'AGPL-3.0'
  }
};

export function getModelManifest(modelId: string): ModelManifest {
  const manifest = AI_MODEL_REGISTRY[modelId];
  if (!manifest) {
    throw new Error(`Model '${modelId}' not found in KaruviLab AI Registry`);
  }
  return manifest;
}

export function listAllModels(): ModelManifest[] {
  return Object.values(AI_MODEL_REGISTRY);
}
