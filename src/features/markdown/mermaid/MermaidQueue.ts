/**
 * KaruviLab Mermaid Render Queue & Concurrency Controller
 * Manages FIFO rendering tasks with strict concurrency limits (KL-02) and AbortController cancellation (KL-05).
 */

export interface MermaidQueueTask<T> {
  id: string;
  run: (signal: AbortSignal) => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: any) => void;
  abortController: AbortController;
  priority: number; // Higher number = higher priority
}

export class MermaidRenderQueue {
  private queue: MermaidQueueTask<any>[] = [];
  private activeTasks = new Map<string, MermaidQueueTask<any>>();
  private readonly maxConcurrency: number;

  constructor() {
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator?.userAgent || ''));
    // Concurrency: max 1 on mobile, max 2 on desktop (KL-02)
    this.maxConcurrency = isMobile ? 1 : 2;
  }

  /**
   * Enqueue a new render task with cancellation support.
   */
  public enqueue<T>(
    id: string,
    run: (signal: AbortSignal) => Promise<T>,
    priority: number = 0,
    externalSignal?: AbortSignal
  ): { promise: Promise<T>; abort: () => void } {
    // Abort any existing queued or active task with the same ID
    this.cancel(id);

    const abortController = new AbortController();

    if (externalSignal) {
      if (externalSignal.aborted) {
        abortController.abort();
      } else {
        externalSignal.addEventListener('abort', () => abortController.abort(), { once: true });
      }
    }

    let taskResolve!: (value: T) => void;
    let taskReject!: (reason: any) => void;

    const promise = new Promise<T>((res, rej) => {
      taskResolve = res;
      taskReject = rej;
    });

    const task: MermaidQueueTask<T> = {
      id,
      run,
      resolve: taskResolve,
      reject: taskReject,
      abortController,
      priority,
    };

    // Insert task sorted by priority (descending)
    const insertIndex = this.queue.findIndex(t => t.priority < priority);
    if (insertIndex === -1) {
      this.queue.push(task);
    } else {
      this.queue.splice(insertIndex, 0, task);
    }

    this.processNext();

    return {
      promise,
      abort: () => this.cancel(id),
    };
  }

  /**
   * Cancel a specific queued or active running task.
   */
  public cancel(id: string): void {
    // 1. Cancel in queue if waiting
    const index = this.queue.findIndex(t => t.id === id);
    if (index !== -1) {
      const removed = this.queue.splice(index, 1)[0];
      if (removed) {
        removed.abortController.abort();
        removed.reject(new DOMException('Mermaid render aborted by newer update', 'AbortError'));
      }
    }

    // 2. Abort if currently active / in-flight
    const active = this.activeTasks.get(id);
    if (active) {
      active.abortController.abort();
    }
  }

  /**
   * Cancel all pending tasks.
   */
  public cancelAll(): void {
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        task.abortController.abort();
        task.reject(new DOMException('Mermaid queue cleared', 'AbortError'));
      }
    }

    for (const active of this.activeTasks.values()) {
      active.abortController.abort();
    }
    this.activeTasks.clear();
  }

  public get pendingCount(): number {
    return this.queue.length + this.activeTasks.size;
  }

  private async processNext(): Promise<void> {
    if (this.activeTasks.size >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    if (task.abortController.signal.aborted) {
      this.processNext();
      return;
    }

    this.activeTasks.set(task.id, task);

    try {
      const result = await task.run(task.abortController.signal);
      if (!task.abortController.signal.aborted) {
        task.resolve(result);
      } else {
        task.reject(new DOMException('Render completed but was aborted', 'AbortError'));
      }
    } catch (err) {
      task.reject(err);
    } finally {
      this.activeTasks.delete(task.id);
      this.processNext();
    }
  }
}

export const mermaidQueue = new MermaidRenderQueue();
