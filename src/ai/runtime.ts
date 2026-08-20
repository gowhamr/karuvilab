/**
 * KaruviLab (KV) Local AI Engine - ONNX Runtime Web Manager
 * Handles session initialization, WASM/WebGPU backend selection, and execution (Rule AI-01)
 */

import { ModelManifest, ModelBackend } from './types';
import { detectCapabilities } from './capabilities';
import { InferenceFailedError } from './errors';

export interface AiSession {
  modelId: string;
  backend: ModelBackend;
  session: any; // ONNX Runtime InferenceSession
  inputNames?: string[];
  outputNames?: string[];
  run: (feeds: Record<string, any>) => Promise<Record<string, any>>;
}

export async function createAiSession(
  manifest: ModelManifest,
  modelBuffer: ArrayBuffer,
  preferredBackend?: ModelBackend
): Promise<AiSession> {
  const capabilities = await detectCapabilities();
  const backend: ModelBackend = preferredBackend || (manifest.backend.includes(capabilities.recommendedBackend) ? capabilities.recommendedBackend : manifest.backend[0] || 'wasm');

  // Dynamic import of onnxruntime-web inside worker/runtime context (Rule 6, PERF-04)
  let ort: any;
  try {
    ort = await import('onnxruntime-web');
  } catch {
    // Fallback stub if onnxruntime-web package is not yet installed in local environment
    throw new InferenceFailedError(manifest.id, 'ONNX Runtime Web module is not available in the current environment.');
  }

  try {
    const sessionOptions: any = {
      executionProviders: backend === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm']
    };

    const session = await ort.InferenceSession.create(modelBuffer, sessionOptions);
    const inputNames: string[] = session.inputNames || [];
    const outputNames: string[] = session.outputNames || [];

    return {
      modelId: manifest.id,
      backend,
      session,
      inputNames,
      outputNames,
      run: async (feeds: Record<string, any>) => {
        try {
          const finalFeeds: Record<string, any> = {};
          const targetInputName = inputNames[0] || 'input';

          for (const [key, value] of Object.entries(feeds)) {
            let tensorValue = value;

            // If raw Float32Array or TypedArray passed, wrap in ort.Tensor
            if (value instanceof Float32Array || value instanceof Uint8Array || value instanceof Int32Array) {
              const tensorType = manifest.input.dataType || 'float32';
              const tensorShape = manifest.input.shape || [1, manifest.input.channels || 3, manifest.input.height || 320, manifest.input.width || 320];
              tensorValue = new ort.Tensor(tensorType, value, tensorShape);
            }

            // Map generic 'input' or mismatched key to the model's exact expected inputName
            if (inputNames.length > 0 && !inputNames.includes(key)) {
              finalFeeds[targetInputName] = tensorValue;
            } else {
              finalFeeds[key] = tensorValue;
            }
          }

          // Ensure primary inputName is filled
          if (inputNames.length > 0 && !finalFeeds[targetInputName]) {
            const firstFeedVal = Object.values(feeds)[0];
            if (firstFeedVal) {
              if (firstFeedVal instanceof Float32Array || firstFeedVal instanceof Uint8Array || firstFeedVal instanceof Int32Array) {
                const tensorType = manifest.input.dataType || 'float32';
                const tensorShape = manifest.input.shape || [1, manifest.input.channels || 3, manifest.input.height || 320, manifest.input.width || 320];
                finalFeeds[targetInputName] = new ort.Tensor(tensorType, firstFeedVal, tensorShape);
              } else {
                finalFeeds[targetInputName] = firstFeedVal;
              }
            }
          }

          return await session.run(finalFeeds);
        } catch (err) {
          throw new InferenceFailedError(manifest.id, err);
        }
      }
    };
  } catch (err) {
    throw new InferenceFailedError(manifest.id, err);
  }
}
