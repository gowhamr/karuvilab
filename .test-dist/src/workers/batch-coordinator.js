import { workerOrchestrator } from "../engine/workers/WorkerOrchestrator";
class BatchCoordinator {
    enqueue(file, mimeType, settings, onProgress, abortSignal) {
        return workerOrchestrator.dispatch("compressImageBatch", [file, mimeType, settings], [file], onProgress, abortSignal);
    }
    terminateAll() {
        workerOrchestrator.terminateAll();
    }
}
export const batchCoordinator = new BatchCoordinator();
