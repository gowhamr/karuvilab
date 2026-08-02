/**
 * KaruviLab (KV) Local AI Engine - Type Definitions
 * Rule AI-01: Framework owns infrastructure, features own intelligence
 */

export type ModelBackend = 'webgpu' | 'wasm' | 'webgl' | 'cpu';

export interface ModelTensorConfig {
  width?: number;
  height?: number;
  channels?: number;
  dataType?: 'float32' | 'uint8' | 'int32';
  [key: string]: unknown;
}

export interface ModelManifest {
  id: string;
  name: string;
  version: string;
  file: string;
  sizeMB: number;
  backend: ModelBackend[];
  input: ModelTensorConfig;
  output: ModelTensorConfig;
  description?: string;
  license?: string;
}

export interface ModelProgress {
  loadedBytes: number;
  totalBytes: number;
  percent: number;
  stage: 'downloading' | 'caching' | 'loading-model' | 'inference';
}

export interface InferenceOptions {
  modelId: string;
  preferredBackend?: ModelBackend;
  feeds: Record<string, unknown>;
  onProgress?: (progress: ModelProgress) => void;
  abortSignal?: AbortSignal;
}

export interface CapabilitiesResult {
  webgpu: boolean;
  wasmSimd: boolean;
  threads: boolean;
  sharedArrayBuffer: boolean;
  recommendedBackend: ModelBackend;
}
