import * as Comlink from 'comlink';
import { WorkerAPI, ProgressCallback } from '../../workers/types';

interface QueuedTask {
  method: keyof WorkerAPI;
  args: any[];
  transferables?: Transferable[] | undefined;
  resolve: (val: any) => void;
  reject: (err: any) => void;
  onProgress?: ProgressCallback | undefined;
  abortSignal?: AbortSignal | undefined;
}

class WorkerOrchestrator {
  private pool: Array<{ worker: Worker; api: Comlink.Remote<WorkerAPI>; busy: boolean }> = [];
  private queue: QueuedTask[] = [];
  private maxWorkers = typeof navigator !== 'undefined' 
    ? Math.min(navigator.hardwareConcurrency || 4, 4) 
    : 4;

  constructor() {
    if (typeof window !== 'undefined') {
      // Re-evaluate maxWorkers for mobile devices specifically if needed
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        this.maxWorkers = Math.min(this.maxWorkers, 2);
      }
    }
  }

  private async getWorker() {
    const idle = this.pool.find(w => !w.busy);
    if (idle) return idle;

    if (this.pool.length < this.maxWorkers) {
      // Using the unified karuvi.worker.ts
      const worker = new Worker(new URL('../../workers/karuvi.worker.ts', import.meta.url));
      const api = Comlink.wrap<WorkerAPI>(worker);
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

    if (task.abortSignal?.aborted) {
      workerEntry.busy = false;
      task.reject(new Error("Task cancelled"));
      this.processQueue();
      return;
    }

    const onAbort = () => {
      workerEntry.worker.terminate();
      const idx = this.pool.indexOf(workerEntry);
      if (idx > -1) this.pool.splice(idx, 1);
      task.reject(new Error("Task aborted"));
      this.processQueue();
    };

    task.abortSignal?.addEventListener('abort', onAbort);

    try {
      const progressProxy = task.onProgress ? Comlink.proxy(task.onProgress) : undefined;
      const args = [...task.args];
      
      // Comlink.transfer handling for first arg if transferables provided
      if (task.transferables && task.transferables.length > 0) {
        args[0] = Comlink.transfer(args[0], task.transferables);
      }

      const result = await (workerEntry.api[task.method] as any)(...args, progressProxy);
      task.resolve(result);
    } catch (err) {
      // Don't reject if it was aborted (handled in onAbort)
      if (!task.abortSignal?.aborted) {
        task.reject(err);
      }
    } finally {
      task.abortSignal?.removeEventListener('abort', onAbort);
      workerEntry.busy = false;
      this.processQueue();
    }
  }

  run<T>(
    method: keyof WorkerAPI,
    args: any[],
    transferables?: Transferable[],
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ method, args, transferables, resolve, reject, onProgress, abortSignal });
      this.processQueue();
    });
  }

  terminateAll() {
    this.pool.forEach(p => p.worker.terminate());
    this.pool = [];
    this.queue = [];
  }
}

export const workerOrchestrator = new WorkerOrchestrator();
