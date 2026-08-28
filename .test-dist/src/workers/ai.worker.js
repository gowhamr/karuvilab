/**
 * KaruviLab (KV) Generic Local AI Engine Web Worker
 * Rule AI-01: Framework owns infrastructure, features own intelligence
 * Zero image/canvas logic inside worker—handles model loading, ONNX sessions, cancellation, and memory cleanup.
 */
import * as Comlink from 'comlink';
import { detectCapabilities } from '../ai/capabilities';
import { modelManager } from '../ai/model-manager';
import { createAiSession } from '../ai/runtime';
import { ModelNotFoundError, InferenceFailedError } from '../ai/errors';
import { preprocessImage } from '../features/background-remover/preprocess';
import { createTransparentCanvas } from '../features/background-remover/postprocess';
import { preprocessOcrImage } from '../features/ocr/preprocess';
import { decodeCtcOutput } from '../features/ocr/postprocess';
import { preprocessDetectionImage } from '../features/detection/preprocess';
import { processDetectionOutputs } from '../features/detection/postprocess';
import { preprocessSuperResImage } from '../features/super-resolution/preprocess';
import { createUpscaledCanvas } from '../features/super-resolution/postprocess';
class AiWorkerEngine {
    sessions = new Map();
    manifests = new Map();
    activeTasks = new Map();
    activeTasksCount = 0;
    MAX_SESSIONS = 2;
    async getOrCreateSession(modelId, preferredBackend) {
        const existing = this.sessions.get(modelId);
        if (existing) {
            existing.lastUsed = Date.now();
            return existing.session;
        }
        const manifest = this.manifests.get(modelId);
        if (!manifest)
            throw new ModelNotFoundError(modelId);
        // LRU Eviction: enforce memory limits (PERF-05)
        if (this.sessions.size >= this.MAX_SESSIONS) {
            let oldestId = null;
            let oldestTime = Infinity;
            for (const [id, data] of this.sessions.entries()) {
                if (data.lastUsed < oldestTime) {
                    oldestTime = data.lastUsed;
                    oldestId = id;
                }
            }
            if (oldestId) {
                await this.disposeModel(oldestId);
            }
        }
        const buffer = await modelManager.ensureModelAvailable(manifest);
        const session = await createAiSession(manifest, buffer, preferredBackend);
        this.sessions.set(modelId, { session, lastUsed: Date.now() });
        return session;
    }
    async initialize() {
        return await detectCapabilities();
    }
    async loadModel(manifest, onProgress) {
        this.manifests.set(manifest.id, manifest);
        // If session already loaded, return true instantly (Rule P-04, no duplicate sessions)
        if (this.sessions.has(manifest.id)) {
            if (onProgress)
                onProgress({ percent: 100, stage: 'caching', message: 'Model ready in memory' });
            return true;
        }
        const abortController = new AbortController();
        this.activeTasks.set(`load-${manifest.id}`, abortController);
        try {
            const buffer = await modelManager.ensureModelAvailable(manifest, (progress) => {
                if (onProgress) {
                    onProgress({
                        percent: progress.percent,
                        stage: progress.stage,
                        message: `Loading ${manifest.name} (${progress.percent}%)`
                    });
                }
            }, abortController.signal);
            const session = await createAiSession(manifest, buffer);
            this.sessions.set(manifest.id, { session, lastUsed: Date.now() });
            return true;
        }
        finally {
            this.activeTasks.delete(`load-${manifest.id}`);
        }
    }
    async runInference(modelId, feeds, preferredBackend) {
        const session = await this.getOrCreateSession(modelId, preferredBackend);
        const taskId = `inf-${modelId}-${Date.now()}`;
        const abortController = new AbortController();
        this.activeTasks.set(taskId, abortController);
        this.activeTasksCount++;
        try {
            if (abortController.signal.aborted) {
                throw new Error('Inference task cancelled');
            }
            const result = await session.run(feeds);
            const transferables = [];
            for (const key of Object.keys(result)) {
                const tensor = result[key];
                if (tensor && tensor.buffer && tensor.buffer instanceof ArrayBuffer) {
                    transferables.push(tensor.buffer);
                }
                else if (tensor instanceof ArrayBuffer) {
                    transferables.push(tensor);
                }
            }
            return Comlink.transfer(result, transferables);
        }
        catch (err) {
            throw new InferenceFailedError(modelId, err);
        }
        finally {
            this.activeTasks.delete(taskId);
            this.activeTasksCount = Math.max(0, this.activeTasksCount - 1);
        }
    }
    async runRmbgPipeline(modelId, imageBitmap, options = {}, preferredBackend) {
        const session = await this.getOrCreateSession(modelId, preferredBackend);
        const taskId = `rmbg-${modelId}-${Date.now()}`;
        const abortController = new AbortController();
        this.activeTasks.set(taskId, abortController);
        this.activeTasksCount++;
        try {
            if (abortController.signal.aborted)
                throw new Error('Task cancelled');
            // 1. Preprocess inside worker
            const pre = await preprocessImage(imageBitmap, 1024, 1024);
            // 2. Run inference
            const feeds = { input: pre.tensorData };
            const out = await session.run(feeds);
            // 3. Extract real model output tensor from ONNX inference result
            // RMBG-2.0 / BiRefNet outputs a single-channel probability map [1, 1, 1024, 1024]
            // The output key varies by export; try 'output', then fall back to first available key.
            const outputKey = Object.prototype.hasOwnProperty.call(out, 'output')
                ? 'output'
                : Object.keys(out)[0];
            if (!outputKey) {
                throw new InferenceFailedError(modelId, new Error('Model produced no output tensors'));
            }
            const outputVal = out[outputKey];
            // ONNX Runtime Web returns tensors as { data: Float32Array, dims: number[], ... }
            let outputTensor;
            if (outputVal && typeof outputVal === 'object' && 'data' in outputVal) {
                const rawData = outputVal.data;
                outputTensor = rawData instanceof Float32Array
                    ? rawData
                    : new Float32Array(rawData);
            }
            else if (outputVal instanceof Float32Array) {
                outputTensor = outputVal;
            }
            else {
                throw new InferenceFailedError(modelId, new Error(`Unexpected output tensor type: ${typeof outputVal}`));
            }
            // Verify tensor length matches expected mask size (1 * 1024 * 1024)
            const expectedSize = 1024 * 1024;
            if (outputTensor.length !== expectedSize) {
                throw new InferenceFailedError(modelId, new Error(`Output tensor size mismatch: expected ${expectedSize}, got ${outputTensor.length}`));
            }
            const resultBitmap = await createTransparentCanvas({
                outputTensorData: outputTensor,
                maskWidth: 1024,
                maskHeight: 1024,
                originalImage: imageBitmap,
                threshold: options.threshold ?? 0.5,
                feather: options.feather ?? 2,
                invert: options.invert ?? false
            });
            return Comlink.transfer({ bitmap: resultBitmap, tensor: outputTensor }, [resultBitmap, outputTensor.buffer]);
        }
        catch (err) {
            throw new InferenceFailedError(modelId, err);
        }
        finally {
            this.activeTasks.delete(taskId);
            this.activeTasksCount = Math.max(0, this.activeTasksCount - 1);
            // Close original bitmap to save memory
            if (imageBitmap && imageBitmap.close) {
                imageBitmap.close();
            }
        }
    }
    async runOcrPipeline(modelId, imageBitmap, preferredBackend) {
        const session = await this.getOrCreateSession(modelId, preferredBackend);
        const taskId = `ocr-${modelId}-${Date.now()}`;
        const abortController = new AbortController();
        this.activeTasks.set(taskId, abortController);
        this.activeTasksCount++;
        try {
            if (abortController.signal.aborted)
                throw new Error('Task cancelled');
            const pre = await preprocessOcrImage(imageBitmap, 320, 48);
            const feeds = { input: pre.tensorData };
            const out = await session.run(feeds);
            const outputKey = Object.keys(out)[0] || 'output';
            const outputVal = out[outputKey];
            const outputTensor = (outputVal && typeof outputVal === 'object' && 'data' in outputVal)
                ? outputVal.data
                : (outputVal || new Float32Array(0));
            const dictResponse = await fetch('/lib/dictionary/ppocr_keys_v1.txt');
            const dict = await dictResponse.text();
            const dictArr = dict.split('\n').map(l => l.trim()).filter(Boolean);
            const result = decodeCtcOutput(outputTensor, dictArr);
            return result;
        }
        catch (err) {
            throw new InferenceFailedError(modelId, err);
        }
        finally {
            this.activeTasks.delete(taskId);
            this.activeTasksCount = Math.max(0, this.activeTasksCount - 1);
            if (imageBitmap && imageBitmap.close) {
                imageBitmap.close();
            }
        }
    }
    async runYoloPipeline(modelId, imageBitmap, options = {}, preferredBackend) {
        const session = await this.getOrCreateSession(modelId, preferredBackend);
        const taskId = `yolo-${modelId}-${Date.now()}`;
        const abortController = new AbortController();
        this.activeTasks.set(taskId, abortController);
        this.activeTasksCount++;
        try {
            if (abortController.signal.aborted)
                throw new Error('Task cancelled');
            const pre = await preprocessDetectionImage(imageBitmap, 640, 640);
            const feeds = { input: pre.tensorData };
            const out = await session.run(feeds);
            const outputKey = Object.keys(out)[0] || 'output';
            const outputVal = out[outputKey];
            const outputTensor = (outputVal && typeof outputVal === 'object' && 'data' in outputVal)
                ? outputVal.data
                : (outputVal || new Float32Array(0));
            const boxes = processDetectionOutputs(outputTensor, pre.originalWidth, pre.originalHeight, options.confidenceThreshold || 0.45);
            return boxes;
        }
        catch (err) {
            throw new InferenceFailedError(modelId, err);
        }
        finally {
            this.activeTasks.delete(taskId);
            this.activeTasksCount = Math.max(0, this.activeTasksCount - 1);
            if (imageBitmap && imageBitmap.close)
                imageBitmap.close();
        }
    }
    async runEsrganPipeline(modelId, imageBitmap, options = { scale: 2 }, preferredBackend) {
        const session = await this.getOrCreateSession(modelId, preferredBackend);
        const taskId = `esrgan-${modelId}-${Date.now()}`;
        const abortController = new AbortController();
        this.activeTasks.set(taskId, abortController);
        this.activeTasksCount++;
        try {
            if (abortController.signal.aborted)
                throw new Error('Task cancelled');
            const pre = await preprocessSuperResImage(imageBitmap, 256, 256);
            const feeds = { input: pre.tensorData };
            const out = await session.run(feeds);
            const outputKey = Object.keys(out)[0] || 'output';
            const outputVal = out[outputKey];
            const outputTensor = (outputVal && typeof outputVal === 'object' && 'data' in outputVal)
                ? outputVal.data
                : (outputVal || new Float32Array(0));
            const resultBitmap = await createUpscaledCanvas({
                outputTensorData: outputTensor,
                targetWidth: pre.originalWidth * options.scale,
                targetHeight: pre.originalHeight * options.scale,
                originalImage: imageBitmap,
                scale: (options.scale === 4 ? 4 : 2)
            });
            return Comlink.transfer({ bitmap: resultBitmap, tensor: outputTensor }, [resultBitmap, outputTensor.buffer]);
        }
        catch (err) {
            throw new InferenceFailedError(modelId, err);
        }
        finally {
            this.activeTasks.delete(taskId);
            this.activeTasksCount = Math.max(0, this.activeTasksCount - 1);
            if (imageBitmap && imageBitmap.close)
                imageBitmap.close();
        }
    }
    cancelTask(taskId) {
        const controller = this.activeTasks.get(taskId);
        if (controller) {
            controller.abort();
            this.activeTasks.delete(taskId);
            this.activeTasksCount = Math.max(0, this.activeTasksCount - 1);
            return true;
        }
        return false;
    }
    async disposeModel(modelId) {
        const sessionData = this.sessions.get(modelId);
        if (sessionData) {
            try {
                if (sessionData.session.session?.release) {
                    await sessionData.session.session.release();
                }
            }
            catch (err) {
                console.error(`Error releasing model ${modelId}:`, err);
            }
            this.sessions.delete(modelId);
            this.manifests.delete(modelId);
        }
    }
    async disposeAllModels() {
        for (const modelId of this.sessions.keys()) {
            await this.disposeModel(modelId);
        }
        this.sessions.clear();
        this.manifests.clear();
        this.activeTasks.clear();
        this.activeTasksCount = 0;
    }
    async getCapabilities() {
        return await detectCapabilities();
    }
    async getStatus() {
        const capabilities = await detectCapabilities();
        const loadedModels = Array.from(this.sessions.keys());
        let memoryEstimateMB = 0;
        for (const manifest of this.manifests.values()) {
            memoryEstimateMB += manifest.sizeMB;
        }
        return {
            loadedModels,
            activeTasksCount: this.activeTasksCount,
            backend: capabilities.recommendedBackend,
            memoryEstimateMB: Math.round(memoryEstimateMB),
            version: '1.0'
        };
    }
}
const aiEngine = new AiWorkerEngine();
// Bridge adapter: WorkerAPI expects ai-prefixed method names (aiLoadModel, aiRunInference, etc.)
// but AiWorkerEngine uses unprefixed names (loadModel, runInference, etc.)
const aiWorkerAdapter = {
    aiInitialize: () => aiEngine.initialize(),
    aiLoadModel: (manifest, onProgress) => aiEngine.loadModel(manifest, onProgress),
    aiRunInference: (modelId, feeds, preferredBackend) => aiEngine.runInference(modelId, feeds, preferredBackend),
    aiCancelTask: (taskId) => aiEngine.cancelTask(taskId),
    aiRunRmbgPipeline: (modelId, imageBitmap, options, preferredBackend) => aiEngine.runRmbgPipeline(modelId, imageBitmap, options, preferredBackend),
    aiRunOcrPipeline: (modelId, imageBitmap, preferredBackend) => aiEngine.runOcrPipeline(modelId, imageBitmap, preferredBackend),
    aiRunYoloPipeline: (modelId, imageBitmap, options, preferredBackend) => aiEngine.runYoloPipeline(modelId, imageBitmap, options, preferredBackend),
    aiRunEsrganPipeline: (modelId, imageBitmap, options, preferredBackend) => aiEngine.runEsrganPipeline(modelId, imageBitmap, options, preferredBackend),
    aiDisposeModel: (modelId) => aiEngine.disposeModel(modelId),
    aiDisposeAll: () => aiEngine.disposeAllModels(),
    aiGetCapabilities: () => aiEngine.getCapabilities(),
    aiGetStatus: () => aiEngine.getStatus(),
};
Comlink.expose(aiWorkerAdapter);
