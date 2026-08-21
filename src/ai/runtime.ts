/**
 * KaruviLab (KV) Local AI Platform - Runtime Engine
 * Rule AI-01, AI-04: Multi-backend ONNX Runtime Session abstraction with WebGPU & WASM fallback.
 */

import { ModelBackend, ModelManifest } from './types';
import { detectCapabilities } from './capabilities';
import { InferenceFailedError } from './errors';

export interface AiSession {
  modelId: string;
  backend: ModelBackend;
  session: any;
  inputNames: string[];
  outputNames: string[];
  run: (feeds: Record<string, any>) => Promise<any>;
}

export async function createAiSession(
  manifest: ModelManifest,
  modelBuffer: ArrayBuffer,
  preferredBackend?: ModelBackend
): Promise<AiSession> {
  const capabilities = await detectCapabilities();
  const isWasmOnly = manifest.preferredBackend === 'wasm' || manifest.id === 'u2netp-mobile' || !manifest.backend.includes('webgpu');
  let backend: ModelBackend = isWasmOnly 
    ? 'wasm' 
    : (preferredBackend || (manifest.backend.includes(capabilities.recommendedBackend) ? capabilities.recommendedBackend : manifest.backend[0] || 'wasm'));

  // Dynamic import of onnxruntime-web inside worker/runtime context (Rule 6, PERF-04)
  let ort: any;
  try {
    ort = await import('onnxruntime-web');
  } catch {
    throw new InferenceFailedError(manifest.id, 'ONNX Runtime Web module is not available in the current environment.');
  }

  try {
    const sessionOptions: any = {
      executionProviders: backend === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm']
    };

    let session = await ort.InferenceSession.create(modelBuffer, sessionOptions);
    let inputNames: string[] = session.inputNames || [];
    let outputNames: string[] = session.outputNames || [];

    const buildFeeds = (feeds: Record<string, any>) => {
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

      return finalFeeds;
    };

    return {
      modelId: manifest.id,
      backend,
      session,
      inputNames,
      outputNames,
      run: async (feeds: Record<string, any>) => {
        try {
          const finalFeeds = buildFeeds(feeds);
          return await session.run(finalFeeds);
        } catch (err: any) {
          // If WebGPU failed due to operator limitation (e.g. MaxPool ceil() or kernel shader), transparently fallback to WASM!
          if (backend === 'webgpu') {
            try {
              const wasmSession = await ort.InferenceSession.create(modelBuffer, { executionProviders: ['wasm'] });
              session = wasmSession;
              inputNames = wasmSession.inputNames || [];
              outputNames = wasmSession.outputNames || [];
              backend = 'wasm';
              const wasmFeeds = buildFeeds(feeds);
              return await wasmSession.run(wasmFeeds);
            } catch (wasmErr) {
              throw new InferenceFailedError(manifest.id, wasmErr);
            }
          }
          throw new InferenceFailedError(manifest.id, err);
        }
      }
    };
  } catch (err) {
    throw new InferenceFailedError(manifest.id, err);
  }
}
