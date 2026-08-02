/**
 * KaruviLab (KV) Generic Local AI Engine Web Worker
 * Rule AI-01: Framework owns infrastructure, features own intelligence
 * Zero image/canvas logic inside worker—handles model loading, ONNX sessions, cancellation, and memory cleanup.
 */

import * as Comlink from 'comlink';
import { ModelManifest, ModelBackend, CapabilitiesResult, AiRuntimeStatus, ModelProgress } from '../ai/types';
import { detectCapabilities } from '../ai/capabilities';
import { loadModelBuffer } from '../ai/model-loader';
import { createAiSession, AiSession } from '../ai/runtime';
import { ModelNotFoundError, InferenceFailedError } from '../ai/errors';

class AiWorkerEngine {
  private sessions = new Map<string, AiSession>();
  private manifests = new Map<string, ModelManifest>();
  private activeTasks = new Map<string, AbortController>();
  private activeTasksCount = 0;

  public async initialize(): Promise<CapabilitiesResult> {
    return await detectCapabilities();
  }

  public async loadModel(
    manifest: ModelManifest,
    onProgress?: (progress: { percent: number; stage?: string; message?: string }) => void
  ): Promise<boolean> {
    this.manifests.set(manifest.id, manifest);

    // If session already loaded, return true instantly (Rule P-04, no duplicate sessions)
    if (this.sessions.has(manifest.id)) {
      if (onProgress) onProgress({ percent: 100, stage: 'caching', message: 'Model ready in memory' });
      return true;
    }

    const abortController = new AbortController();
    this.activeTasks.set(`load-${manifest.id}`, abortController);

    try {
      const buffer = await loadModelBuffer(
        manifest,
        (progress: ModelProgress) => {
          if (onProgress) {
            onProgress({
              percent: progress.percent,
              stage: progress.stage,
              message: `Loading ${manifest.name} (${progress.percent}%)`
            });
          }
        },
        abortController.signal
      );

      const session = await createAiSession(manifest, buffer);
      this.sessions.set(manifest.id, session);
      return true;
    } finally {
      this.activeTasks.delete(`load-${manifest.id}`);
    }
  }

  public async runInference(
    modelId: string,
    feeds: Record<string, unknown>,
    preferredBackend?: ModelBackend
  ): Promise<Record<string, unknown>> {
    let session = this.sessions.get(modelId);

    if (!session) {
      const manifest = this.manifests.get(modelId);
      if (!manifest) {
        throw new ModelNotFoundError(modelId);
      }
      const buffer = await loadModelBuffer(manifest);
      session = await createAiSession(manifest, buffer, preferredBackend);
      this.sessions.set(modelId, session);
    }

    const taskId = `inf-${modelId}-${Date.now()}`;
    const abortController = new AbortController();
    this.activeTasks.set(taskId, abortController);
    this.activeTasksCount++;

    try {
      if (abortController.signal.aborted) {
        throw new Error('Inference task cancelled');
      }

      const result = await session.run(feeds);
      return result;
    } catch (err) {
      throw new InferenceFailedError(modelId, err);
    } finally {
      this.activeTasks.delete(taskId);
      this.activeTasksCount = Math.max(0, this.activeTasksCount - 1);
    }
  }

  public cancelTask(taskId: string): boolean {
    const controller = this.activeTasks.get(taskId);
    if (controller) {
      controller.abort();
      this.activeTasks.delete(taskId);
      this.activeTasksCount = Math.max(0, this.activeTasksCount - 1);
      return true;
    }
    return false;
  }

  public disposeModel(modelId: string): boolean {
    const session = this.sessions.get(modelId);
    if (session) {
      try {
        if (session.session && typeof session.session.release === 'function') {
          session.session.release();
        }
      } catch {
        // Ignored during cleanup
      }
      this.sessions.delete(modelId);
      this.manifests.delete(modelId);
      return true;
    }
    return false;
  }

  public disposeAllModels(): void {
    for (const modelId of Array.from(this.sessions.keys())) {
      this.disposeModel(modelId);
    }
    this.sessions.clear();
    this.manifests.clear();
    this.activeTasks.clear();
    this.activeTasksCount = 0;
  }

  public async getCapabilities(): Promise<CapabilitiesResult> {
    return await detectCapabilities();
  }

  public async getStatus(): Promise<AiRuntimeStatus> {
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
Comlink.expose(aiEngine);

export type AiWorkerEngineType = typeof aiEngine;
