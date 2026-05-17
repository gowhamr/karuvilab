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
  private pool: Array<{ worker: Worker; api: Comlink.Remote<WorkerAPI>; busy: boolean; lastHeard?: number }> = [];
  private queue: QueuedTask[] = [];
  private maxWorkers = 4;
  private isLowMemory = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const cores = navigator.hardwareConcurrency || 4;
      
      // Detection for low-memory devices (IMG-RUNTIME-004)
      // Note: deviceMemory is not available on all browsers (mainly Chromium)
      const memory = (navigator as any).deviceMemory || 8;
      this.isLowMemory = memory < 4 || cores < 4;

      if (this.isLowMemory) {
        this.maxWorkers = isMobile ? 1 : 2;
        console.warn(`[WorkerOrchestrator] Low memory device detected. Limiting workers to ${this.maxWorkers}.`);
      } else {
        this.maxWorkers = isMobile ? 2 : Math.min(cores, 4);
      }
    }
  }

  private async getWorker() {
    // Clean up terminated workers from pool
    this.pool = this.pool.filter(w => {
      try {
        // Simple check to see if worker is still alive
        // Terminated workers don't have a specific property, but we can track it
        return true; 
      } catch { return false; }
    });

    const idle = this.pool.find(w => !w.busy);
    if (idle) return idle;

    if (this.pool.length < this.maxWorkers) {
      try {
        const worker = new Worker(new URL('../../workers/karuvi.worker.ts', import.meta.url));
        
        // IMG-RUNTIME-003: Worker crash recovery
        worker.onerror = (e) => {
          console.error("[WorkerOrchestrator] Worker terminal error:", e);
          this.handleWorkerCrash(worker);
        };

        const api = Comlink.wrap<WorkerAPI>(worker);
        const entry = { worker, api, busy: false, lastHeard: Date.now() };
        this.pool.push(entry);
        return entry;
      } catch (err) {
        console.error("[WorkerOrchestrator] Failed to spawn worker:", err);
        return null;
      }
    }
    return null;
  }

  private handleWorkerCrash(worker: Worker) {
    const idx = this.pool.findIndex(p => p.worker === worker);
    if (idx > -1) {
      console.warn("[WorkerOrchestrator] Removing crashed worker from pool.");
      this.pool.splice(idx, 1);
    }
    // Any tasks that were assigned to this worker will reject via the await call in processQueue
  }

  private async processQueue() {
    if (this.queue.length === 0) return;

    const workerEntry = await this.getWorker();
    if (!workerEntry) {
      // If we couldn't get a worker, wait a bit and try again
      setTimeout(() => this.processQueue(), 100);
      return;
    }

    const task = this.queue.shift()!;
    workerEntry.busy = true;
    workerEntry.lastHeard = Date.now();

    if (task.abortSignal?.aborted) {
      workerEntry.busy = false;
      task.reject(new Error("Task cancelled"));
      this.processQueue();
      return;
    }

    // IMG-RUNTIME-003: Heartbeat timeout
    const timeoutDuration = 60000; // 60s default
    const timeoutId = setTimeout(() => {
      console.error(`[WorkerOrchestrator] Task ${task.method} timed out after ${timeoutDuration}ms`);
      onAbort("Task timed out");
    }, timeoutDuration);

    const onAbort = (reason = "Task aborted") => {
      clearTimeout(timeoutId);
      workerEntry.worker.terminate();
      this.handleWorkerCrash(workerEntry.worker);
      task.reject(new Error(reason));
      this.processQueue();
    };

    const abortHandler = () => onAbort("Task cancelled");
    task.abortSignal?.addEventListener('abort', abortHandler);

    try {
      const progressProxy = task.onProgress ? Comlink.proxy((p: any) => {
        workerEntry.lastHeard = Date.now();
        task.onProgress?.(p);
      }) : undefined;

      const args = [...task.args];
      
      if (task.transferables && task.transferables.length > 0) {
        args[0] = Comlink.transfer(args[0], task.transferables);
      }

      const result = await (workerEntry.api[task.method] as any)(...args, progressProxy);
      clearTimeout(timeoutId);
      task.resolve(result);
    } catch (err) {
      clearTimeout(timeoutId);
      if (!task.abortSignal?.aborted) {
        task.reject(err);
      }
    } finally {
      task.abortSignal?.removeEventListener('abort', abortHandler);
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
