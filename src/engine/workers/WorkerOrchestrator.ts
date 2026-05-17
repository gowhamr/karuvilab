import * as Comlink from "comlink";
import { WorkerAPI, ProgressCallback } from "../../workers/types";

interface QueuedTask {
  method: keyof WorkerAPI;
  args: unknown[];
  transferables?: Transferable[] | undefined;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  onProgress?: ProgressCallback | undefined;
  abortSignal?: AbortSignal | undefined;
}

class WorkerOrchestrator {
  private pool: Array<{ worker: Worker; api: Comlink.Remote<WorkerAPI>; busy: boolean; lastHeard?: number }> = [];
  private queue: QueuedTask[] = [];
  private maxWorkers = 4;
  private isLowMemory = false;
  private initialized = false;

  private init() {
    if (this.initialized || typeof window === 'undefined' || typeof navigator === 'undefined') return;
    
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as any).deviceMemory || 8;
      this.isLowMemory = memory < 4 || cores < 4;

      if (this.isLowMemory) {
        this.maxWorkers = isMobile ? 1 : 2;
      } else {
        this.maxWorkers = isMobile ? 2 : Math.min(cores, 4);
      }
      this.initialized = true;
    } catch (e) {
      console.error("[WorkerOrchestrator] Init error:", e);
    }
  }

  private async getWorker() {
    this.init();
    
    const idle = this.pool.find(w => !w.busy);
    if (idle) return idle;

    if (this.pool.length < this.maxWorkers) {
      try {
        const worker = new Worker(
          new URL('../../workers/karuvi.worker.ts', import.meta.url),
          { type: 'module' }
        );
        
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
      this.pool.splice(idx, 1);
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) return;

    const workerEntry = await this.getWorker();
    if (!workerEntry) {
      setTimeout(() => this.processQueue(), 100);
      return;
    }

    const task = this.queue.shift()!;
    workerEntry.busy = true;
    workerEntry.lastHeard = Date.now();

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isFinished = false;

    const cleanup = () => {
      if (isFinished) return;
      isFinished = true;
      if (timeoutId) clearTimeout(timeoutId);
      workerEntry.busy = false;
      this.processQueue();
    };

    const onAbort = (reason = "Task aborted") => {
      if (isFinished) return;
      workerEntry.worker.terminate();
      this.handleWorkerCrash(workerEntry.worker);
      task.reject(new Error(reason));
      cleanup();
    };

    if (task.abortSignal?.aborted) {
      task.reject(new Error("Task cancelled"));
      cleanup();
      return;
    }

    const abortHandler = () => onAbort("Task cancelled");
    task.abortSignal?.addEventListener('abort', abortHandler);

    timeoutId = setTimeout(() => {
      onAbort("Task timed out");
    }, 60000);

    try {
      const progressProxy = task.onProgress ? Comlink.proxy((p: any) => {
        workerEntry.lastHeard = Date.now();
        task.onProgress?.(p);
      }) : undefined;

      const args = [...task.args];
      if (task.transferables && task.transferables.length > 0) {
        args[0] = Comlink.transfer(args[0], task.transferables);
      }

      // STYLE-002: Strongly typed worker API invocation.
      // We cast to a callable function with unknown parameters to remove 'any'.
      const method = workerEntry.api[task.method] as unknown as (...args: unknown[]) => Promise<unknown>;
      const result = await method(...args, progressProxy);
      
      if (progressProxy) {
        try { (progressProxy as any)[Comlink.releaseProxy](); } catch (e) {}
      }
      
      if (!isFinished) {
        task.resolve(result);
        cleanup();
      }
    } catch (err) {
      if (!isFinished) {
        if (!task.abortSignal?.aborted) task.reject(err);
        cleanup();
      }
    } finally {
      task.abortSignal?.removeEventListener('abort', abortHandler);
    }
  }

  /**
   * Runs a worker task from the pool.
   */
  run<T>(
    method: keyof WorkerAPI,
    args: unknown[],
    transferables?: Transferable[],
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ 
        method, 
        args, 
        transferables, 
        resolve: resolve as (v: unknown) => void, 
        reject, 
        onProgress, 
        abortSignal 
      });
      this.processQueue();
    });
  }

  terminateAll(): void {
    this.pool.forEach(p => p.worker.terminate());
    this.pool = [];
    this.queue = [];
  }
}

export const workerOrchestrator = new WorkerOrchestrator();
