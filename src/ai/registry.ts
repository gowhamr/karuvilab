/**
 * KaruviLab (KV) Central AI Model Registry
 * Future-proof registry for all in-browser neural network models with dynamic capability metadata
 */

import { ExtendedModelManifest, ModelManifest } from './types';

export const AI_MODEL_REGISTRY: Record<string, ExtendedModelManifest> = {
  'background-removal-rmbg': {
    id: 'background-removal-rmbg',
    name: 'RMBG 2.0 (BiRefNet)',
    version: '2.0',
    family: 'birefnet',
    file: '/models/rmbg-2.0.onnx',
    cdnUrls: [
      'https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx',
      'https://huggingface.co/Xenova/birefnet-general/resolve/main/onnx/model_quantized.onnx'
    ],
    fallbackModelId: 'u2netp-mobile',
    sha256: '8cafcf770b06757c4eaced21b1a88e57fd2b66de01b8045f35f01535ba742e0f',
    sizeMB: 168,
    backend: ['webgpu', 'wasm'],
    input: { width: 1024, height: 1024, channels: 3, dataType: 'float32', shape: [1, 3, 1024, 1024] },
    output: { channels: 1, dataType: 'float32', shape: [1, 1, 1024, 1024] },
    category: 'segmentation',
    tags: ['general', 'product', 'object'],
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 180,
    estimatedInferenceMs: 1200,
    minimumRamMB: 2048,
    supportsTiling: true,
    supportsGuidedFilter: false,
    qualityScore: 95,
    speedScore: 78,
    available: true,
    description: 'High-accuracy portrait & object background removal model.',
    license: 'Open-Rail'
  },
  'u2netp-mobile': {
    id: 'u2netp-mobile',
    name: 'U²-NetP Ultra-Fast Mobile',
    version: '1.0',
    family: 'u2net',
    file: '/models/u2netp.onnx',
    cdnUrls: [
      'https://huggingface.co/Xenova/u2netp/resolve/main/onnx/model_quantized.onnx'
    ],
    sha256: '309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8',
    sizeMB: 4.7,
    backend: ['wasm'],
    input: { width: 320, height: 320, channels: 3, dataType: 'float32', shape: [1, 3, 320, 320] },
    output: { channels: 1, dataType: 'float32', shape: [1, 1, 320, 320] },
    category: 'segmentation',
    tags: ['mobile', 'general'],
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png'],
    preferredBackend: 'wasm',
    supportsBatch: true,
    supportsOffline: true,
    estimatedMemoryMB: 45,
    estimatedInferenceMs: 180,
    minimumRamMB: 512,
    supportsTiling: false,
    supportsGuidedFilter: false,
    qualityScore: 82,
    speedScore: 98,
    available: true,
    description: 'Lightweight pruned U2-Net model optimized for mobile browsers.',
    license: 'Apache-2.0'
  },
  'modnet-portrait': {
    id: 'modnet-portrait',
    name: 'MODNet Portrait Matting',
    version: '1.0',
    family: 'modnet',
    // IMPORTANT: Model file is a placeholder. Replace with real modnet.onnx (~13.8MB).
    file: '/models/modnet.onnx',
    sha256: '',
    sizeMB: 13.8,
    backend: ['webgpu', 'wasm'],
    input: { width: 512, height: 512, channels: 3, dataType: 'float32', shape: [1, 3, 512, 512] },
    output: { channels: 1, dataType: 'float32', shape: [1, 1, 512, 512] },
    category: 'segmentation',
    tags: ['portrait', 'hair'],
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 110,
    estimatedInferenceMs: 450,
    minimumRamMB: 1024,
    supportsTiling: false,
    supportsGuidedFilter: false,
    qualityScore: 94,
    speedScore: 90,
    available: false,
    description: 'Real-time human portrait trimap matting model.',
    license: 'Apache-2.0'
  },
  'ocr-paddle': {
    id: 'ocr-paddle',
    name: 'PaddleOCR Lightweight',
    version: '1.0',
    family: 'paddle',
    file: '/models/paddle-ocr.onnx',
    sha256: '06b3e6af6c59a1ba5d53790ed8c2e4b2de389870b6cf5a97f349f3412cb269c0',
    sizeMB: 10.3,
    backend: ['webgpu', 'wasm'],
    input: { width: 320, height: 48, channels: 3, dataType: 'float32', shape: [1, 3, 48, 320] },
    output: { channels: 1, dataType: 'float32', shape: [1, 6624, 6624] },
    category: 'ocr',
    tags: ['ocr'],
    inputFormats: ['png', 'jpg', 'webp', 'pdf'],
    outputFormats: ['txt', 'md', 'json', 'csv'],
    preferredBackend: 'wasm',
    supportsBatch: true,
    supportsOffline: true,
    estimatedMemoryMB: 90,
    estimatedInferenceMs: 650,
    available: true,
    description: 'In-browser optical character recognition engine.',
    license: 'Apache-2.0'
  },
  'super-resolution-esrgan': {
    id: 'super-resolution-esrgan',
    name: 'Real-ESRGAN 4x Upscaler',
    version: '4.0',
    // IMPORTANT: Model file is a placeholder. Replace with real realesrgan-4x.onnx (~24.1MB).
    file: '/models/realesrgan-4x.onnx',
    sha256: '',
    sizeMB: 24.1,
    backend: ['webgpu', 'wasm'],
    input: { width: 256, height: 256, channels: 3, dataType: 'float32', shape: [1, 3, 256, 256] },
    output: { width: 1024, height: 1024, channels: 3, dataType: 'float32', shape: [1, 3, 1024, 1024] },
    category: 'super-resolution',
    tags: ['general'],
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png', 'jpg'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 220,
    estimatedInferenceMs: 1800,
    available: false,
    description: '2x / 4x AI image upscaling and clarity enhancement.',
    license: 'BSD-3-Clause'
  },
  'face-blur-yolo': {
    id: 'face-blur-yolo',
    name: 'YOLOv8 Face Detection',
    version: '8.0',
    family: 'yolo',
    // IMPORTANT: Model file is a placeholder. Replace with real yolov8-face.onnx (~6.5MB).
    file: '/models/yolov8-face.onnx',
    sha256: '',
    sizeMB: 6.5,
    backend: ['webgpu', 'wasm'],
    input: { width: 640, height: 640, channels: 3, dataType: 'float32', shape: [1, 3, 640, 640] },
    output: { channels: 84, dataType: 'float32', shape: [1, 84, 8400] },
    category: 'detection',
    tags: ['face'],
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png', 'jpg'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 75,
    estimatedInferenceMs: 450,
    available: false,
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
