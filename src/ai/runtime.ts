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

    return {
      modelId: manifest.id,
      backend,
      session,
      run: async (feeds: Record<string, any>) => {
        try {
          return await session.run(feeds);
        } catch (err) {
          throw new InferenceFailedError(manifest.id, err);
        }
      }
    };
  } catch (err) {
    throw new InferenceFailedError(manifest.id, err);
  }
}
