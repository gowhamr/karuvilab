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
  priority?: 'high' | 'normal' | 'low' | undefined;
  timestamp: number;
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

type PoolType = 'compute' | 'media' | 'heavy';

const METHOD_TO_POOL: Record<keyof WorkerAPI, PoolType> = {
  // Compute Pool (fast, low-memory mathematical/text parsing tasks)
  generateHashes: 'compute',
  generateFileHash: 'compute',
  directoryHashManifest: 'compute',
  generateHmac: 'compute',
  generateFileHmac: 'compute',
  aesEncrypt: 'compute',
  aesDecrypt: 'compute',
  generateRsaKeyPair: 'compute',
  rsaEncrypt: 'compute',
  rsaDecrypt: 'compute',
  rsaSign: 'compute',
  rsaVerify: 'compute',
  ecdsaGenerateKeyPair: 'compute',
  ecdsaSign: 'compute',
  ecdsaVerify: 'compute',
  ecdhDeriveSecret: 'compute',
  pbkdf2Derive: 'compute',
  hkdfDerive: 'compute',
  processYaml: 'compute',
  processJson: 'compute',
  evaluateMath: 'compute',
  calculateEmiSchedule: 'compute',
  convertNumeral: 'compute',
  detectNumeralFormat: 'compute',
  checkGrammar: 'compute',

  // Media Pool (heavy file manipulation, image/PDF processing)
  getPdfPageCount: 'media',
  rotatePdf: 'media',
  watermarkPdf: 'media',
  convertImagesToPdf: 'media',
  lockPdf: 'media',
  unlockPdf: 'media',
  addPageNumbersToPdf: 'media',
  mergePdfs: 'media',
  compressPdf: 'media',
  splitPdf: 'media',
  compressImage: 'media',
  resizeImage: 'media',
  removeBackground: 'media',
  compressImageBatch: 'media',
  extractColorPalette: 'media',
  createGif: 'media',
  extractImagesFromPdf: 'media',
  extractTextFromPdf: 'media',

  // Heavy Pool (CPU-bound compression or heavy dynamic compiler modules)
  minifyCode: 'heavy',
  computeDiff: 'heavy',
  createZip: 'heavy',
  encodeMp3: 'heavy',
  encodeWav: 'heavy',
  extractRawTextFromDocx: 'heavy',
  convertDocxToPdf: 'heavy',
  generateDocxFromText: 'heavy'
};

interface WorkerPool {
  type: PoolType;
  workers: Array<{ worker: Worker; api: Comlink.Remote<WorkerAPI>; busy: boolean; lastHeard?: number }>;
  queue: QueuedTask[];
  activeTasks: Map<Worker, QueuedTask>;
}

class WorkerOrchestrator {
  private pools: Record<PoolType, WorkerPool> = {
    compute: { type: 'compute', workers: [], queue: [], activeTasks: new Map() },
    media: { type: 'media', workers: [], queue: [], activeTasks: new Map() },
    heavy: { type: 'heavy', workers: [], queue: [], activeTasks: new Map() }
  };

  private maxWorkers = 3; // Enforce MAX_WORKERS = 3 as per performance priority guidelines
  private isLowMemory = false;
  private initialized = false;

  // Compatibility getters and setters for existing tests
  private get pool() {
    return [
      ...this.pools.compute.workers,
      ...this.pools.media.workers,
      ...this.pools.heavy.workers
    ];
  }

  private set pool(val: any[]) {
    if (val.length === 0) {
      this.pools.compute.workers = [];
      this.pools.media.workers = [];
      this.pools.heavy.workers = [];
    }
  }

  private get queue() {
    return [
      ...this.pools.compute.queue,
      ...this.pools.media.queue,
      ...this.pools.heavy.queue
    ];
  }

  private set queue(val: any[]) {
    if (val.length === 0) {
      this.pools.compute.queue = [];
      this.pools.media.queue = [];
      this.pools.heavy.queue = [];
    }
  }

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
        this.maxWorkers = isMobile ? 2 : Math.min(cores, 3); // Lower limit to 3 instead of 4
      }
      this.initialized = true;
    } catch (e) {
      console.error("[WorkerOrchestrator] Init error:", e);
    }
  }

  private get globalWorkerCount(): number {
    return (
      this.pools.compute.workers.length +
      this.pools.media.workers.length +
      this.pools.heavy.workers.length
    );
  }

  private async getWorker(poolType: PoolType) {
    this.init();
    
    const poolObj = this.pools[poolType];
    const idle = poolObj.workers.find(w => !w.busy);
    if (idle) return idle;

    if (this.globalWorkerCount < this.maxWorkers) {
      try {
        const worker = new Worker(
          new URL('../../workers/karuvi.worker.ts', import.meta.url),
          { type: 'module' }
        );
        
        worker.onerror = (e) => {
          console.error(`[WorkerOrchestrator] ${poolType} Worker crash detected:`, e);
          this.handleWorkerCrash(worker, poolType);
        };

        const api = Comlink.wrap<WorkerAPI>(worker);
        const entry = { worker, api, busy: false, lastHeard: Date.now() };
        poolObj.workers.push(entry);
        return entry;
      } catch (err) {
        console.error(`[WorkerOrchestrator] Failed to spawn ${poolType} worker:`, err);
        return null;
      }
    }
    return null;
  }

  private handleWorkerCrash(worker: Worker, poolType: PoolType) {
    const poolObj = this.pools[poolType];
    const idx = poolObj.workers.findIndex(p => p.worker === worker);
    if (idx > -1) {
      poolObj.workers.splice(idx, 1);
    }
    const task = poolObj.activeTasks.get(worker);
    if (task) {
      poolObj.activeTasks.delete(worker);
      if (task.idempotent && (task.retriesLeft || 0) > 0) {
        task.retriesLeft! -= 1;
        task.retrying = true;
        poolObj.queue.unshift(task); // Re-queue at the front
        import('../../store/useRecoveryStore').then(({ useRecoveryStore }) => {
          useRecoveryStore.getState().showBanner('worker_crash', 'Worker recovered automatically. Retrying task...');
        }).catch(() => {});
        this.processQueue(poolType);
      } else {
        task.reject(new Error("Task failed due to a worker crash."));
        import('../../store/useRecoveryStore').then(({ useRecoveryStore }) => {
          useRecoveryStore.getState().showBanner('worker_crash', 'Task failed due to a worker crash.');
        }).catch(() => {});
      }
    }
  }

  private verifyMemoryCleanup(workerEntry: typeof this.pools.compute.workers[0], poolType: PoolType) {
    try {
      const perfMemory = typeof performance !== 'undefined' ? (performance as any).memory : null;
      if (perfMemory) {
        const usedHeap = perfMemory.usedJSHeapSize;
        const heapLimit = perfMemory.jsHeapSizeLimit;
        if (usedHeap > 150 * 1024 * 1024 || usedHeap > heapLimit * 0.8) {
          console.warn(`[WorkerOrchestrator] High memory usage detected in ${poolType} worker. Respawning.`);
          workerEntry.worker.terminate();
          const poolObj = this.pools[poolType];
          const idx = poolObj.workers.findIndex(p => p.worker === workerEntry.worker);
          if (idx > -1) {
            poolObj.workers.splice(idx, 1);
          }
        }
      }
    } catch (e) {
      console.error("[WorkerOrchestrator] Memory verification error:", e);
    }
  }

  private async processQueue(poolType: PoolType) {
    const poolObj = this.pools[poolType];
    const task = poolObj.queue.shift();
    if (!task) return;

    const workerEntry = await this.getWorker(poolType);
    if (!workerEntry) {
      // Re-insert at the front if we didn't get a worker, but since we are replacing `.shift()`, 
      // we need to maintain priority.
      task.priority = 'high'; // Boost priority on retry
      this.insertToQueue(poolType, task);
      setTimeout(() => this.processQueue(poolType), 100);
      return;
    }

    workerEntry.busy = true;
    workerEntry.lastHeard = Date.now();
    poolObj.activeTasks.set(workerEntry.worker, task);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isFinished = false;

    const cleanup = () => {
      if (isFinished) return;
      isFinished = true;
      if (timeoutId) clearTimeout(timeoutId);
      workerEntry.busy = false;
      poolObj.activeTasks.delete(workerEntry.worker);
      this.verifyMemoryCleanup(workerEntry, poolType);
      this.processQueue(poolType);
    };

    const onAbort = (reason = "Task aborted") => {
      if (isFinished) return;
      workerEntry.worker.terminate();
      this.handleWorkerCrash(workerEntry.worker, poolType);
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
   * Helper to insert a task into the queue based on priority
   */
  private insertToQueue(poolType: PoolType, task: QueuedTask) {
    const poolObj = this.pools[poolType];
    const priorityWeight = { high: 3, normal: 2, low: 1 };
    
    // Find the right insertion index
    let index = 0;
    for (let i = 0; i < poolObj.queue.length; i++) {
      const current = poolObj.queue[i]!;
      const taskWeight = priorityWeight[task.priority || 'normal'];
      const currentWeight = priorityWeight[current.priority || 'normal'];
      
      if (taskWeight > currentWeight) {
        break; // Insert before lower priority
      } else if (taskWeight === currentWeight && task.timestamp < current.timestamp) {
        break; // Insert before newer tasks of same priority
      }
      index++;
    }
    
    poolObj.queue.splice(index, 0, task);
  }

  /**
   * Dispatches a worker task from the appropriate pool.
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
    timeout?: number,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<T> {
    if (maxSizeMB !== undefined) {
      const payloadSize = args.reduce<number>((sum, arg) => sum + getPayloadSize(arg), 0);
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (payloadSize > maxBytes) {
        return Promise.reject(new Error(`Payload size (${(payloadSize / 1024 / 1024).toFixed(2)}MB) exceeds limit of ${maxSizeMB}MB.`));
      }
    }

    const poolType = METHOD_TO_POOL[method] || 'compute';
    
    return new Promise((resolve, reject) => {
      this.insertToQueue(poolType, { 
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
        timeout,
        priority,
        timestamp: Date.now()
      });
      this.processQueue(poolType);
    });
  }

  /**
   * @deprecated Use dispatch()
   */
  run<T>(...args: Parameters<WorkerOrchestrator["dispatch"]>): Promise<T> {
    return this.dispatch(...args);
  }

  terminateAll(): void {
    Object.values(this.pools).forEach(poolObj => {
      poolObj.workers.forEach(p => p.worker.terminate());
      poolObj.workers = [];
      poolObj.queue = [];
      poolObj.activeTasks.clear();
    });
  }
}

export const workerOrchestrator = new WorkerOrchestrator();
