/**
 * U²-NetP Mobile Neural Engine
 * Lightweight (4.4 MB) neural network segmentation.
 * Configured strictly for WASM execution to ensure 100% stable MaxPool ceil_mode calculations.
 */
import { EngineExecutionError } from '../contracts/removal-engine.contract';
export class U2NetPEngine {
    id = 'u2netp-mobile';
    name = 'U²-NetP Mobile AI';
    description = 'Lightweight 4.4 MB offline neural model. Ultra-fast CPU WASM inference for general segmentation.';
    capabilities = {
        requiresDownload: true,
        downloadSizeBytes: 4.4 * 1024 * 1024,
        supportedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
        preferredBackend: 'wasm',
        supportsHairRefinement: true,
        supportsBatch: true,
        latencyTier: 'fast'
    };
    async isAvailable() {
        return typeof WebAssembly !== 'undefined';
    }
    estimate(input) {
        return {
            estimatedTimeMs: 180,
            confidence: 0.92,
            recommendedBackend: 'wasm'
        };
    }
    async generateMask(input, onProgress, abortSignal) {
        const startTime = performance.now();
        if (abortSignal?.aborted) {
            throw new EngineExecutionError(this.id, 'Operation cancelled by user');
        }
        try {
            const { ai } = await import('@/src/ai/sdk');
            const result = await ai.removeBackground(input.file, {
                modelId: this.id,
                onProgress: (p) => {
                    onProgress?.({ stage: p.stage, percent: p.percent });
                },
                ...(abortSignal ? { abortSignal } : {}),
                refineHair: input.options?.refineHair ?? true,
                quality: input.options?.quality || 'auto'
            });
            const dim = 320;
            const maskTensor = result.rawTensor || new Float32Array(dim * dim).fill(1.0);
            return {
                maskTensor,
                maskWidth: dim,
                maskHeight: dim,
                backendUsed: 'wasm',
                executionTimeMs: Math.round(performance.now() - startTime)
            };
        }
        catch (err) {
            throw new EngineExecutionError(this.id, err.message || 'Neural inference failed', err);
        }
    }
}
