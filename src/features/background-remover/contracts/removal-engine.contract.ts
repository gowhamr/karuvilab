/**
 * KaruviLab (KV) Removal Engine Architecture Contract
 * Single stable interface that all background removal engines conform to.
 */

export type EngineBackend = 'main-thread' | 'worker' | 'wasm' | 'webgpu';

export interface EngineCapabilities {
  /** Whether the engine needs to download external weight files */
  readonly requiresDownload: boolean;
  /** Size in bytes of downloaded weights (0 for local procedural engines) */
  readonly downloadSizeBytes: number;
  /** Supported image MIME types */
  readonly supportedMimeTypes: readonly string[];
  /** Preferred execution provider / runtime */
  readonly preferredBackend: EngineBackend;
  /** Whether the engine produces smooth soft-hair boundary matte */
  readonly supportsHairRefinement: boolean;
  /** Whether the engine supports batch queue processing */
  readonly supportsBatch: boolean;
  /** Typical execution latency tier */
  readonly latencyTier: 'instant' | 'fast' | 'moderate';
}

export interface EngineEstimate {
  readonly estimatedTimeMs: number;
  readonly confidence: number;
  readonly recommendedBackend: EngineBackend;
}

export interface EngineInput {
  readonly file: File;
  readonly imageElement?: HTMLImageElement;
  readonly width: number;
  readonly height: number;
  readonly options?: {
    bgColor?: string;
    tolerance?: number;
    refineHair?: boolean;
    quality?: 'auto' | 'quality' | 'speed';
  };
}

export interface EngineOutput {
  readonly maskTensor: Float32Array;
  readonly maskWidth: number;
  readonly maskHeight: number;
  readonly backendUsed: EngineBackend;
  readonly executionTimeMs: number;
}

export class EngineExecutionError extends Error {
  constructor(
    public readonly engineId: string,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(`Engine "${engineId}" failed: ${message}`);
    this.name = 'EngineExecutionError';
  }
}

/**
 * Stable contract implemented by all background removal engines (Canvas, U²-NetP, RMBG, etc.)
 */
export interface RemovalEngine {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly capabilities: EngineCapabilities;

  /**
   * Checks if runtime environment supports running this engine
   */
  isAvailable(): Promise<boolean>;

  /**
   * Returns performance and timing estimate for the given image
   */
  estimate(input: { width: number; height: number; fileSize: number }): EngineEstimate;

  /**
   * Generates a normalized [0.0, 1.0] alpha mask tensor
   */
  generateMask(
    input: EngineInput,
    onProgress?: (progress: { stage: string; percent: number }) => void,
    abortSignal?: AbortSignal
  ): Promise<EngineOutput>;
}
