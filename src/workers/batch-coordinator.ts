import * as Comlink from 'comlink';
import { ImageCompressWorkerAPI, CompressionSettings, TaskProgress } from './image-compress.worker';

class BatchCoordinator {
  private pool: Array<{ worker: Worker; api: Comlink.Remote<ImageCompressWorkerAPI>; busy: boolean }> = [];
  private maxWorkers = typeof navigator !== 'undefined' ? Math.min(navigator.hardwareConcurrency || 4, 4) : 4;
  private queue: Array<{
    file: ArrayBuffer;
    settings: CompressionSettings;
    resolve: (val: Uint8Array) => void;
    reject: (err: any) => void;
    onProgress?: (p: TaskProgress) => void;
  }> = [];

  private async getWorker() {
    const idle = this.pool.find((w) => !w.busy);
    if (idle) return idle;

    if (this.pool.length < this.maxWorkers) {
      const worker = new Worker(new URL('./image-compress.worker.ts', import.meta.url));
      const api = Comlink.wrap<ImageCompressWorkerAPI>(worker);
      const entry = { worker, api, busy: false };
      this.pool.push(entry);
      return entry;
    }

    return null;
  }

  private async processQueue() {
    if (this.queue.length === 0) return;

    const workerEntry = await this.getWorker();
    if (!workerEntry) return;

    const task = this.queue.shift()!;
    workerEntry.busy = true;

    try {
      const result = await workerEntry.api.compressImage(
        Comlink.transfer(task.file, [task.file]),
        task.settings,
        task.onProgress ? Comlink.proxy(task.onProgress) : undefined
      );
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      workerEntry.busy = false;
      this.processQueue();
    }
  }

  enqueue(
    file: ArrayBuffer,
    settings: CompressionSettings,
    onProgress?: (p: TaskProgress) => void
  ): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const task: any = { file, settings, resolve, reject };
      if (onProgress) task.onProgress = onProgress;
      this.queue.push(task);
      this.processQueue();
    });
  }

  terminateAll() {
    this.pool.forEach((p) => p.worker.terminate());
    this.pool = [];
    this.queue = [];
  }
}

export const batchCoordinator = new BatchCoordinator();
