/**
 * KaruviLab (KV) Local AI Engine - ONNX Runtime Web Manager
 * Handles session initialization, WASM/WebGPU backend selection, and execution (Rule AI-01)
 */
import { detectCapabilities } from './capabilities';
import { InferenceFailedError } from './errors';
export async function createAiSession(manifest, modelBuffer, preferredBackend) {
    const capabilities = await detectCapabilities();
    const backend = preferredBackend || (manifest.backend.includes(capabilities.recommendedBackend) ? capabilities.recommendedBackend : manifest.backend[0] || 'wasm');
    // Dynamic import of onnxruntime-web inside worker/runtime context (Rule 6, PERF-04)
    let ort;
    try {
        ort = await import('onnxruntime-web');
    }
    catch {
        // Fallback stub if onnxruntime-web package is not yet installed in local environment
        throw new InferenceFailedError(manifest.id, 'ONNX Runtime Web module is not available in the current environment.');
    }
    try {
        const sessionOptions = {
            executionProviders: backend === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm']
        };
        const session = await ort.InferenceSession.create(modelBuffer, sessionOptions);
        return {
            modelId: manifest.id,
            backend,
            session,
            run: async (feeds) => {
                try {
                    return await session.run(feeds);
                }
                catch (err) {
                    throw new InferenceFailedError(manifest.id, err);
                }
            }
        };
    }
    catch (err) {
        throw new InferenceFailedError(manifest.id, err);
    }
}
