import * as Comlink from "comlink";
import { WorkerAPI, ProgressCallback } from "./types";
import { EmiWorkerAPI } from "./emi.worker";
import { EmiInputs, EmiResult } from "../lib/emi-calculations";

interface QueuedTask {
  id: string;
  type: string;
  args: any[];
  transferables?: Transferable[];
  resolve: (val: any) => void;
  reject: (err: any) => void;
  onProgress?: ProgressCallback;
  abortSignal?: AbortSignal;
}

class WorkerManager {
  private pool: Array<{ worker: Worker; api: Comlink.Remote<WorkerAPI>; busy: boolean }> = [];
  private emiPool: Array<{ worker: Worker; api: Comlink.Remote<EmiWorkerAPI>; busy: boolean }> = [];
  private queue: QueuedTask[] = [];
  private maxWorkers = typeof navigator !== "undefined" ? Math.min(navigator.hardwareConcurrency || 4, 4) : 4;
  private supported = typeof Worker !== "undefined";

  isSupported() {
    return this.supported;
  }

  private async getAvailableWorker() {
    if (!this.supported) return null;

    // Check for idle worker
    const idle = this.pool.find(w => !w.busy);
    if (idle) return idle;

    // Create new if below max
    if (this.pool.length < this.maxWorkers) {
      const worker = new Worker(new URL("./core.worker.ts", import.meta.url));
      const api = Comlink.wrap<WorkerAPI>(worker);
      const entry = { worker, api, busy: false };
      this.pool.push(entry);
      return entry;
    }

    return null;
  }

  private async getAvailableEmiWorker() {
    if (!this.supported) return null;

    const idle = this.emiPool.find(w => !w.busy);
    if (idle) return idle;

    if (this.emiPool.length < 2) { // Cap EMI workers
      const worker = new Worker(new URL("./emi.worker.ts", import.meta.url));
      const api = Comlink.wrap<EmiWorkerAPI>(worker);
      const entry = { worker, api, busy: false };
      this.emiPool.push(entry);
      return entry;
    }

    return null;
  }

  async calculateEmiSchedule(inputs: EmiInputs): Promise<EmiResult> {
    const workerEntry = await this.getAvailableEmiWorker();
    if (!workerEntry) {
      // Fallback to main thread if workers fail
      const { generateSchedule } = await import("../lib/emi-calculations");
      return generateSchedule(inputs);
    }

    workerEntry.busy = true;
    try {
      return await workerEntry.api.calculateSchedule(inputs);
    } finally {
      workerEntry.busy = false;
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) return;

    const workerEntry = await this.getAvailableWorker();
    if (!workerEntry) return;

    const task = this.queue.shift()!;
    workerEntry.busy = true;

    if (task.abortSignal?.aborted) {
      workerEntry.busy = false;
      task.reject(new Error("Task cancelled"));
      this.processQueue();
      return;
    }

    // Dynamic timeout based on task type and input size
    const getTimeout = () => {
      const BASE_TIMEOUT = 30000; // 30s
      let multiplier = 1;
      
      // Heuristic: heavy tasks get more time
      if (['mergePdfs', 'compressImage', 'resizeImage'].includes(task.type)) {
        multiplier = 2; // 60s
        
        // Scale with size (if first arg is Buffer/Array)
        const sizeArg = task.args[0];
        if (sizeArg instanceof ArrayBuffer || Array.isArray(sizeArg)) {
          const bytes = sizeArg instanceof ArrayBuffer ? sizeArg.byteLength : 0;
          if (bytes > 50 * 1024 * 1024) multiplier = 4; // 120s for >50MB
          if (bytes > 200 * 1024 * 1024) multiplier = 10; // 5min for >200MB
        }
      }
      
      return BASE_TIMEOUT * multiplier;
    };

    const timeoutMs = getTimeout();
    let timeoutId: any;

    const onAbort = () => {
      clearTimeout(timeoutId);
      workerEntry.worker.terminate();
      const idx = this.pool.indexOf(workerEntry);
      this.pool.splice(idx, 1);
      task.reject(new Error("Task cancelled or timed out"));
      this.processQueue();
    };

    task.abortSignal?.addEventListener("abort", onAbort);

    timeoutId = setTimeout(() => {
      console.error(`Worker task ${task.type} timed out after ${timeoutMs}ms`);
      onAbort();
    }, timeoutMs);

    try {
      const api = workerEntry.api as any;
      const progressProxy = task.onProgress ? Comlink.proxy(task.onProgress) : undefined;
      
      const args = [...task.args];
      if (task.transferables && task.transferables.length > 0) {
        args[0] = Comlink.transfer(args[0], task.transferables);
      }

      const result = await api[task.type](...args, progressProxy);
      clearTimeout(timeoutId);
      task.resolve(result);
    } catch (err) {
      clearTimeout(timeoutId);
      task.reject(err);
    } finally {
      task.abortSignal?.removeEventListener("abort", onAbort);
      workerEntry.busy = false;
      this.processQueue();
    }
  }

  private enqueue<T>(
    type: string, 
    args: any[], 
    transferables?: Transferable[],
    onProgress?: ProgressCallback, 
    abortSignal?: AbortSignal
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: QueuedTask = {
        id: Math.random().toString(36).substring(7),
        type,
        args,
        resolve,
        reject,
      };

      if (transferables) task.transferables = transferables;
      if (onProgress) task.onProgress = onProgress;
      if (abortSignal) task.abortSignal = abortSignal;

      this.queue.push(task);
      this.processQueue();
    });
  }

  async generateHashes(
    text: string, 
    algos: string[], 
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Record<string, string>> {
    return this.enqueue("generateHashes", [text, algos], undefined, onProgress, abortSignal);
  }

  async generateFileHash(
    file: ArrayBuffer,
    algo: string,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return this.enqueue("generateFileHash", [file, algo], [file], onProgress, abortSignal);
  }

  async mergePdfs(
    files: ArrayBuffer[], 
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return this.enqueue("mergePdfs", [files], files, onProgress, abortSignal);
  }

  async compressImage(
    file: ArrayBuffer, 
    format: "image/jpeg" | "image/png" | "image/webp",
    quality: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return this.enqueue("compressImage", [file, format, quality], [file], onProgress, abortSignal);
  }

  async resizeImage(
    file: ArrayBuffer,
    width: number,
    height: number,
    format: "image/jpeg" | "image/png" | "image/webp",
    quality: number,
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    return this.enqueue("resizeImage", [file, width, height, format, quality], [file], onProgress, abortSignal);
  }

  async minifyCode(
    code: string,
    lang: "css" | "js" | "html",
    onProgress?: ProgressCallback,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return this.enqueue("minifyCode", [code, lang], undefined, onProgress, abortSignal);
  }

  terminateAll() {
    this.pool.forEach(p => p.worker.terminate());
    this.pool = [];
    this.queue = [];
  }
}

export const workerManager = new WorkerManager();
