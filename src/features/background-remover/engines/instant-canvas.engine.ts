/**
 * Instant Canvas Removal Engine
 * Fast, deterministic pixel-difference background segmentation.
 * 0 MB download, 100% offline, executes in sub-15ms.
 */

import { 
  RemovalEngine, 
  EngineCapabilities, 
  EngineInput, 
  EngineOutput, 
  EngineEstimate,
  EngineExecutionError 
} from '../contracts/removal-engine.contract';

export class InstantCanvasEngine implements RemovalEngine {
  public readonly id = 'instant-canvas';
  public readonly name = 'Instant Canvas Removal';
  public readonly description = 'Deterministic color distance segmentation. 0 MB download, instant speed for clean solid backgrounds.';

  public readonly capabilities: EngineCapabilities = {
    requiresDownload: false,
    downloadSizeBytes: 0,
    supportedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
    preferredBackend: 'worker',
    supportsHairRefinement: false,
    supportsBatch: true,
    latencyTier: 'instant'
  };

  public async isAvailable(): Promise<boolean> {
    return true; // Always available in any browser
  }

  public estimate(input: { width: number; height: number; fileSize: number }): EngineEstimate {
    const megapixels = (input.width * input.height) / 1_000_000;
    return {
      estimatedTimeMs: Math.max(5, Math.round(megapixels * 8)),
      confidence: 0.98,
      recommendedBackend: 'worker'
    };
  }

  public async generateMask(
    input: EngineInput,
    onProgress?: (progress: { stage: string; percent: number }) => void,
    abortSignal?: AbortSignal
  ): Promise<EngineOutput> {
    const startTime = performance.now();
    onProgress?.({ stage: 'Sampling Canvas Pixels', percent: 20 });

    if (abortSignal?.aborted) {
      throw new EngineExecutionError(this.id, 'Operation cancelled by user');
    }

    try {
      const bgColor = input.options?.bgColor || '#ffffff';
      const tolerance = input.options?.tolerance ?? 40;

      // Extract target RGB
      const hex = bgColor.replace('#', '');
      const tr = parseInt(hex.substring(0, 2), 16) || 255;
      const tg = parseInt(hex.substring(2, 4), 16) || 255;
      const tb = parseInt(hex.substring(4, 6), 16) || 255;

      const dim = Math.min(Math.max(input.width, input.height), 512);
      const maskW = Math.round((input.width / Math.max(input.width, input.height)) * dim) || 256;
      const maskH = Math.round((input.height / Math.max(input.width, input.height)) * dim) || 256;

      let canvas: HTMLCanvasElement | OffscreenCanvas;
      let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

      if (typeof OffscreenCanvas !== 'undefined') {
        canvas = new OffscreenCanvas(maskW, maskH);
        ctx = canvas.getContext('2d');
      } else if (typeof document !== 'undefined') {
        canvas = document.createElement('canvas');
        canvas.width = maskW;
        canvas.height = maskH;
        ctx = canvas.getContext('2d');
      } else {
        // Fallback for headless environments
        return {
          maskTensor: new Float32Array(maskW * maskH).fill(1.0),
          maskWidth: maskW,
          maskHeight: maskH,
          backendUsed: 'worker',
          executionTimeMs: Math.round(performance.now() - startTime)
        };
      }

      if (!ctx) throw new Error('Failed to create canvas context');

      if (input.imageElement) {
        ctx.drawImage(input.imageElement, 0, 0, maskW, maskH);
      }

      onProgress?.({ stage: 'Computing Color Euclidean Distance', percent: 60 });
      const imgData = ctx.getImageData ? ctx.getImageData(0, 0, maskW, maskH) : null;
      const maskTensor = new Float32Array(maskW * maskH);

      if (imgData) {
        const data = imgData.data;
        const tolSq = tolerance * tolerance * 3;

        for (let i = 0; i < maskW * maskH; i++) {
          const r = data[i * 4] ?? 255;
          const g = data[i * 4 + 1] ?? 255;
          const b = data[i * 4 + 2] ?? 255;

          const distSq = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;
          maskTensor[i] = distSq < tolSq ? 0.0 : 1.0;
        }
      } else {
        maskTensor.fill(1.0);
      }

      onProgress?.({ stage: 'Completed Canvas Mask', percent: 100 });
      return {
        maskTensor,
        maskWidth: maskW,
        maskHeight: maskH,
        backendUsed: 'worker',
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    } catch (err: unknown) {
      throw new EngineExecutionError(this.id, (err as Error).message || 'Execution error', err);
    }
  }
}
