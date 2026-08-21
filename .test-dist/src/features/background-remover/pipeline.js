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
import { analyzeImageForRemoval } from './engine-selector';
import { removalEngineRegistry } from './engine-registry';
import { createTransparentCanvas } from './postprocess';
import { compositeCutoutWithBackdrop } from './backdrop-compositor';
/**
 * Executes the full end-to-end background removal pipeline via RemovalEngine contract
 */
export async function executeRemovalPipeline(options) {
    const { file, imageElement, engine: requestedEngine, bgColor = '#ffffff', tolerance = 40, threshold = 0.5, feather = 2, invert = false, refineHair = true, backdropType = 'transparent', solidColor = '#ffffff', studioPresetId, blurRadius = 15, customBgImage, transforms, exportSettings, onProgress, abortSignal } = options;
    const startTime = performance.now();
    // Stage 1 & 2: Input Ingestion, Analysis & Engine Selection
    onProgress?.({ stage: 'Analyzing Image Characteristics', percent: 10 });
    const recommendation = analyzeImageForRemoval(imageElement);
    const selectedEngineId = requestedEngine === 'auto' ? recommendation.engine : requestedEngine;
    const engine = removalEngineRegistry.get(selectedEngineId);
    // Stage 3: Alpha Mask Generation via Unified RemovalEngine Contract
    onProgress?.({ stage: `Generating Alpha Mask via ${engine.name}`, percent: 30 });
    const maskOutput = await engine.generateMask({
        file,
        imageElement,
        width: imageElement.naturalWidth || imageElement.width,
        height: imageElement.naturalHeight || imageElement.height,
        options: {
            bgColor,
            tolerance,
            refineHair
        }
    }, onProgress, abortSignal);
    const rawTensor = maskOutput.maskTensor;
    // Stage 4: Precision Refinement (Guided Filter, Threshold, Feather, Invert)
    onProgress?.({ stage: 'Refining Boundaries & Alpha Matte', percent: 75 });
    const transparentCanvas = await createTransparentCanvas({
        outputTensorData: maskOutput.maskTensor,
        maskWidth: maskOutput.maskWidth,
        maskHeight: maskOutput.maskHeight,
        originalImage: imageElement,
        threshold,
        feather,
        invert
    });
    const transparentBlob = await new Promise((resolve, reject) => {
        if (transparentCanvas instanceof OffscreenCanvas) {
            transparentCanvas.convertToBlob({ type: 'image/png' }).then(resolve).catch(reject);
        }
        else {
            const c = document.createElement('canvas');
            c.width = transparentCanvas.width;
            c.height = transparentCanvas.height;
            const ctx = c.getContext('2d');
            if (ctx) {
                ctx.drawImage(transparentCanvas, 0, 0);
                c.toBlob((b) => {
                    if (b)
                        resolve(b);
                    else
                        reject(new Error('Failed to create transparent PNG'));
                }, 'image/png');
            }
            else {
                reject(new Error('Failed to create canvas context'));
            }
        }
    });
    // Stage 5 & 6: Backdrop Compositing & Multi-Codec Export
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
        engineUsed: engine.id,
        recommendation,
        transparentBlob,
        transparentCanvas,
        displayBlob,
        inferenceTimeMs: totalTimeMs,
        ...(rawTensor ? { rawTensor } : {})
    };
}
