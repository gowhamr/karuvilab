/**
 * KaruviLab (KV) AI Background Remover - Modular 6-Stage Pipeline
 * 
 * Pipeline Architecture:
 * ┌───────────┐    ┌─────────────────┐    ┌─────────────────┐
 * │  1. Input │ ─> │ 2. Engine Choice│ ─> │ 3. Mask Generate│
 * └───────────┘    └─────────────────┘    └─────────────────┘
 *                                                  │
 * ┌───────────┐    ┌─────────────────┐             ▼
 * │ 6. Export │ <─ │ 5. Compositor   │ <─ ┌─────────────────┐
 * └───────────┘    └─────────────────┘    │ 4. Refinement   │
 *                                         └─────────────────┘
 */

import { analyzeImageForRemoval, EngineRecommendation } from './engine-selector';
import { createTransparentCanvas } from './postprocess';
import { compositeCutoutWithBackdrop, CompositeOptions } from './backdrop-compositor';
import { workerManager } from '@/src/workers/manager';
import { safeImageProcess } from '@/src/features/image-compressor/utils/safe-process';
import { TransformSettings, ExportSettings, BackdropType } from './types';

export interface PipelineExecutionOptions {
  file: File;
  imageElement: HTMLImageElement;
  engine: 'auto' | 'canvas' | 'u2netp' | 'rmbg';
  bgColor?: string;
  tolerance?: number;
  threshold?: number;
  feather?: number;
  invert?: boolean;
  refineHair?: boolean;
  backdropType?: BackdropType;
  solidColor?: string;
  studioPresetId?: string;
  blurRadius?: number;
  customBgImage?: HTMLImageElement | ImageBitmap | null;
  transforms?: TransformSettings;
  exportSettings?: ExportSettings;
  onProgress?: (progress: { stage: string; percent: number }) => void;
  abortSignal?: AbortSignal;
}

export interface PipelineExecutionResult {
  engineUsed: 'canvas' | 'u2netp' | 'rmbg';
  recommendation: EngineRecommendation;
  transparentBlob: Blob;
  transparentCanvas: HTMLCanvasElement | ImageBitmap | OffscreenCanvas;
  displayBlob: Blob;
  inferenceTimeMs: number;
  rawTensor?: Float32Array;
}

/**
 * Executes the full end-to-end background removal pipeline
 */
export async function executeRemovalPipeline(
  options: PipelineExecutionOptions
): Promise<PipelineExecutionResult> {
  const {
    file,
    imageElement,
    engine: requestedEngine,
    bgColor = '#ffffff',
    tolerance = 40,
    threshold = 0.5,
    feather = 2,
    invert = false,
    refineHair = true,
    backdropType = 'transparent',
    solidColor = '#ffffff',
    studioPresetId,
    blurRadius = 15,
    customBgImage,
    transforms,
    exportSettings,
    onProgress,
    abortSignal
  } = options;

  const startTime = performance.now();

  // Stage 1 & 2: Input Analysis & Recommendation
  onProgress?.({ stage: 'Analyzing Image Characteristics', percent: 10 });
  const recommendation = analyzeImageForRemoval(imageElement);
  const selectedEngine = requestedEngine === 'auto' ? recommendation.engine : requestedEngine;

  let transparentCanvas: HTMLCanvasElement | ImageBitmap | OffscreenCanvas;
  let rawTensor: Float32Array | undefined;
  let transparentBlob: Blob;

  // Stage 3: Mask Generation
  if (selectedEngine === 'canvas') {
    onProgress?.({ stage: 'Executing Instant Canvas Color Distance', percent: 40 });
    const result = await safeImageProcess(async () => {
      const buffer = await file.arrayBuffer();
      const resultBytes = await workerManager.removeBackground(buffer, bgColor, tolerance);
      return new Blob([resultBytes as any], { type: 'image/png' });
    }, 'pipeline-canvas-bg');

    if (!result.success || !result.data) {
      throw result.error || new Error('Canvas background removal failed');
    }

    transparentBlob = result.data;
    transparentCanvas = await createImageBitmap(transparentBlob);
  } else {
    // Neural Model (U2-NetP or RMBG 2.0)
    const modelId = selectedEngine === 'u2netp' ? 'u2netp-mobile' : 'background-removal-rmbg';
    onProgress?.({ stage: `Running AI Neural Model (${modelId})`, percent: 30 });

    const { ai } = await import('@/src/ai/sdk');
    const aiResult = await ai.removeBackground(file, {
      modelId,
      onProgress: (p) => {
        onProgress?.({ stage: `AI Engine: ${p.stage}`, percent: 30 + Math.round(p.percent * 0.4) });
      },
      ...(abortSignal ? { abortSignal } : {}),
      refineHair,
      quality: 'auto'
    });

    rawTensor = aiResult.rawTensor;

    // Stage 4: Refinement
    onProgress?.({ stage: 'Refining Boundaries & Alpha Matte', percent: 75 });
    const modelDim = selectedEngine === 'u2netp' ? 320 : 1024;
    transparentCanvas = await createTransparentCanvas({
      outputTensorData: aiResult.rawTensor || new Float32Array(modelDim * modelDim),
      maskWidth: modelDim,
      maskHeight: modelDim,
      originalImage: imageElement,
      threshold,
      feather,
      invert
    });

    transparentBlob = await new Promise<Blob>((resolve, reject) => {
      if (transparentCanvas instanceof OffscreenCanvas) {
        transparentCanvas.convertToBlob({ type: 'image/png' }).then(resolve).catch(reject);
      } else {
        const c = document.createElement('canvas');
        c.width = transparentCanvas.width;
        c.height = transparentCanvas.height;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(transparentCanvas as any, 0, 0);
          c.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create transparent PNG'));
          }, 'image/png');
        } else {
          reject(new Error('Failed to create canvas context'));
        }
      }
    });
  }

  // Stage 5 & 6: Compositing & Export
  onProgress?.({ stage: 'Compositing Backdrop & Encoding Output', percent: 90 });
  const displayBlob = await compositeCutoutWithBackdrop({
    cutoutImage: transparentCanvas,
    originalImage: imageElement,
    customBgImage: customBgImage || undefined,
    width: imageElement.naturalWidth || imageElement.width,
    height: imageElement.naturalHeight || imageElement.height,
    backdropType,
    solidColor,
    studioPresetId,
    blurRadius,
    transforms,
    exportSettings
  });

  const totalTimeMs = Math.round(performance.now() - startTime);
  onProgress?.({ stage: 'Complete', percent: 100 });

  return {
    engineUsed: selectedEngine,
    recommendation,
    transparentBlob,
    transparentCanvas,
    displayBlob,
    inferenceTimeMs: totalTimeMs,
    ...(rawTensor ? { rawTensor } : {})
  };
}
