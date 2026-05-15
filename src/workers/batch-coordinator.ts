import { CompressionSettings, TaskProgress } from './types';
import { workerOrchestrator } from "../engine/workers/WorkerOrchestrator";

class BatchCoordinator {
  enqueue(
    file: ArrayBuffer,
    settings: CompressionSettings,
    onProgress?: (p: TaskProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return workerOrchestrator.run("compressImageBatch", [file, settings], [file], onProgress, abortSignal);
  }

  terminateAll() {
    workerOrchestrator.terminateAll();
  }
}

export const batchCoordinator = new BatchCoordinator();
