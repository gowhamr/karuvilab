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
  idempotent?: boolean | undefined;
  retriesLeft?: number | undefined;
  activeWorker?: Worker | undefined;
  timeout?: number | undefined;
  maxSizeMB?: number | undefined;
  retrying?: boolean | undefined;
}

function getPayloadSize(arg: unknown): number {
  if (arg instanceof ArrayBuffer) return arg.byteLength;
  if (arg instanceof Blob) return arg.size;
  if (typeof arg === "string") return new TextEncoder().encode(arg).length;
  if (Array.isArray(arg)) {
    return arg.reduce((sum: number, item) => sum + getPayloadSize(item), 0);
  }
  if (arg && typeof arg === "object") {
    try {
      return new TextEncoder().encode(JSON.stringify(arg)).length;
    } catch {
      return 0;
    }
  }
  return 0;
}

class WorkerOrchestrator {
  private pool: Array<{ worker: Worker; api: Comlink.Remote<WorkerAPI>; busy: boolean; lastHeard?: number }> = [];
  private queue: QueuedTask[] = [];
  private activeTasks = new Map<Worker, QueuedTask>();
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
    const task = this.activeTasks.get(worker);
    if (task) {
      this.activeTasks.delete(worker);
      if (task.idempotent && (task.retriesLeft || 0) > 0) {
        task.retriesLeft! -= 1;
        task.retrying = true;
        this.queue.unshift(task); // Re-queue at the front
        import('../../store/useRecoveryStore').then(({ useRecoveryStore }) => {
          useRecoveryStore.getState().showBanner('worker_crash', 'Worker recovered automatically. Retrying task...');
        });
        this.processQueue();
      } else {
        task.reject(new Error("Task failed due to a worker crash."));
        import('../../store/useRecoveryStore').then(({ useRecoveryStore }) => {
          useRecoveryStore.getState().showBanner('worker_crash', 'Task failed due to a worker crash.');
        });
      }
    }
  }

  private verifyMemoryCleanup(workerEntry: typeof this.pool[0]) {
    try {
      const perfMemory = typeof performance !== 'undefined' ? (performance as any).memory : null;
      if (perfMemory) {
        const usedHeap = perfMemory.usedJSHeapSize;
        const heapLimit = perfMemory.jsHeapSizeLimit;
        if (usedHeap > 150 * 1024 * 1024 || usedHeap > heapLimit * 0.8) {
          console.warn("[WorkerOrchestrator] High memory usage detected. Respawning worker.");
          workerEntry.worker.terminate();
          const idx = this.pool.findIndex(p => p.worker === workerEntry.worker);
          if (idx > -1) {
            this.pool.splice(idx, 1);
          }
        }
      }
    } catch (e) {
      console.error("[WorkerOrchestrator] Memory verification error:", e);
    }
  }

  private async processQueue() {
    const task = this.queue.shift();
    if (!task) return;

    const workerEntry = await this.getWorker();
    if (!workerEntry) {
      this.queue.unshift(task);
      setTimeout(() => this.processQueue(), 100);
      return;
    }

    workerEntry.busy = true;
    workerEntry.lastHeard = Date.now();
    this.activeTasks.set(workerEntry.worker, task);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isFinished = false;

    const cleanup = () => {
      if (isFinished) return;
      isFinished = true;
      if (timeoutId) clearTimeout(timeoutId);
      workerEntry.busy = false;
      this.activeTasks.delete(workerEntry.worker);
      this.verifyMemoryCleanup(workerEntry);
      this.processQueue();
    };

    const onAbort = (reason = "Task aborted") => {
      if (isFinished) return;
      workerEntry.worker.terminate();
      this.handleWorkerCrash(workerEntry.worker);
      if (reason === "Task timed out") {
        task.reject(new Error("TIMEOUT"));
      } else {
        task.reject(new Error(reason));
      }
      cleanup();
    };

    if (task.abortSignal?.aborted) {
      task.reject(new Error("Task cancelled"));
      cleanup();
      return;
    }

    const abortHandler = () => onAbort("Task cancelled");
    task.abortSignal?.addEventListener('abort', abortHandler);

    const timeoutMs = task.timeout !== undefined ? task.timeout : 30000;
    timeoutId = setTimeout(() => {
      onAbort("Task timed out");
    }, timeoutMs);

    try {
      const progressProxy = task.onProgress ? Comlink.proxy((p: any) => {
        workerEntry.lastHeard = Date.now();
        task.onProgress?.(p);
      }) : undefined;

      const args = [...task.args];
      if (task.transferables && task.transferables.length > 0) {
        args[0] = Comlink.transfer(args[0], task.transferables);
      }

      const method = workerEntry.api[task.method] as unknown as (...args: unknown[]) => Promise<unknown>;
      const result = await method(...args, progressProxy);
      
      if (progressProxy) {
        try { (progressProxy as any)[Comlink.releaseProxy](); } catch (e) {}
      }
      
      if (!isFinished) {
        task.resolve(result);
        cleanup();
      }
    } catch (err: any) {
      if (!isFinished) {
        if (task.retrying) {
          cleanup();
          return;
        }
        if (!task.abortSignal?.aborted) task.reject(err);
        cleanup();
      }
    } finally {
      task.abortSignal?.removeEventListener('abort', abortHandler);
    }
  }

  /**
   * Dispatches a worker task from the pool.
   */
  dispatch<T>(
    method: keyof WorkerAPI,
    args: unknown[],
    transferables?: Transferable[],
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal,
    idempotent: boolean = true,
    retriesLeft: number = 2,
    maxSizeMB?: number,
    timeout?: number
  ): Promise<T> {
    if (maxSizeMB !== undefined) {
      const payloadSize = args.reduce<number>((sum, arg) => sum + getPayloadSize(arg), 0);
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (payloadSize > maxBytes) {
        return Promise.reject(new Error(`Payload size (${(payloadSize / 1024 / 1024).toFixed(2)}MB) exceeds limit of ${maxSizeMB}MB.`));
      }
    }
    return new Promise((resolve, reject) => {
      this.queue.push({ 
        method, 
        args, 
        transferables, 
        resolve: resolve as (v: unknown) => void, 
        reject, 
        onProgress, 
        abortSignal,
        idempotent,
        retriesLeft,
        maxSizeMB,
        timeout
      });
      this.processQueue();
    });
  }

  /**
   * @deprecated Use dispatch()
   */
  run<T>(...args: Parameters<this["dispatch"]>): Promise<T> {
    // @ts-ignore
    return this.dispatch(...args);
  }

  terminateAll(): void {
    this.pool.forEach(p => p.worker.terminate());
    this.pool = [];
    this.queue = [];
    this.activeTasks.clear();
  }
}

export const workerOrchestrator = new WorkerOrchestrator();
