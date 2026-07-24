import { CompressionSettings, TaskProgress } from './types';
import { workerOrchestrator } from "../engine/workers/WorkerOrchestrator";

class BatchCoordinator {
  enqueue(
    file: ArrayBuffer,
    mimeType: string,
    settings: CompressionSettings,
    onProgress?: (p: TaskProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.dispatch("compressImageBatch", [file, mimeType, settings], [file], onProgress, abortSignal);
  }

  terminateAll() {
    workerOrchestrator.terminateAll();
  }
}

export const batchCoordinator = new BatchCoordinator();
