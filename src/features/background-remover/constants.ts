/**
 * KaruviLab (KV) AI Background Remover - Constants & Model Config
 * Rule AI-01: Framework owns infrastructure, features own intelligence
 */

import { ModelManifest } from '@/src/ai/types';

export const RMBG_MODEL_MANIFEST: ModelManifest = {
  id: 'background-removal-rmbg',
  name: 'RMBG 2.0 (Quantized)',
  version: '2.0',
  file: '/models/rmbg-2.0.onnx',
  sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
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
  category: 'segmentation',
  inputFormats: ['png', 'jpg', 'webp'],
  outputFormats: ['png'],
  preferredBackend: 'webgpu',
  supportsBatch: false,
  supportsOffline: true,
  estimatedMemoryMB: 180,
  estimatedInferenceMs: 1200,
  description: 'High-accuracy in-browser portrait & object background removal model.',
  license: 'Open-Rail'
};
