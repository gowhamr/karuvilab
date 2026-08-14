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
  shape?: number[];
  [key: string]: unknown;
}

export interface ModelManifest {
  id: string;
  name: string;
  version: string;
  file: string;
  sha256?: string;
  sizeMB: number;
  backend: ModelBackend[];
  input: ModelTensorConfig;
  output: ModelTensorConfig;
  category: 'segmentation' | 'ocr' | 'detection' | 'super-resolution' | 'captioning';

  // Capability Metadata (Driven from Registry)
  inputFormats: string[];
  outputFormats: string[];
  preferredBackend: ModelBackend;
  supportsBatch: boolean;
  supportsOffline: boolean;
  estimatedMemoryMB: number;
  estimatedInferenceMs: number;

  description?: string;
  license?: string;

  // Scalability & Quantization Metadata (50+ Model Scaling)
  quantization?: 'int8' | 'fp16' | 'fp32';
  chunked?: boolean;
}

export type ModelFamily = 'birefnet' | 'u2net' | 'modnet' | 'ben2' | 'inspyrenet' | 'ppmatting' | 'isnet' | 'yolo' | 'paddle';
export type ModelTag = 'portrait' | 'object' | 'hair' | 'product' | 'mobile' | 'general' | 'ocr' | 'face';

export interface ExtendedModelManifest extends ModelManifest {
  family?: ModelFamily;
  tags?: ModelTag[];
  minimumRamMB?: number;
  minimumWebGpuVramMB?: number;
  supportsTiling?: boolean;
  supportsGuidedFilter?: boolean;
  qualityScore?: number; // 0 to 100
  speedScore?: number;   // 0 to 100
  /**
   * When false, the model file is a placeholder and must not be loaded.
   * UI should display an honest "Model not available" state.
   * Defaults to true when omitted.
   */
  available?: boolean;
  quantizedVariants?: {
    int8?: { file: string; sizeMB: number; sha256: string };
    fp16?: { file: string; sizeMB: number; sha256: string };
  };
}

export interface ModelProgress {
  loadedBytes: number;
  totalBytes: number;
  percent: number;
  stage: 'downloading' | 'verifying' | 'caching' | 'loading-model' | 'inference';
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

export interface AiDiagnosticsMetrics {
  activeBackend: ModelBackend;
  modelLoadTimeMs: number;
  lastInferenceTimeMs: number;
  tensorSizeMB: number;
  peakMemoryMB: number;
  cacheHitCount: number;
  cacheMissCount: number;
  loadedModels: string[];
}

export interface AiRuntimeStatus {
  loadedModels: string[];
  activeTasksCount: number;
  backend: ModelBackend;
  memoryEstimateMB: number;
  version: string;
  diagnostics?: AiDiagnosticsMetrics;
}
