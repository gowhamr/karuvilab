/**
 * KaruviLab Mermaid Render Queue & Concurrency Controller
 * Manages FIFO rendering tasks with strict concurrency limits (KL-02) and AbortController cancellation (KL-05).
 */
export class MermaidRenderQueue {
    queue = [];
    activeTasks = new Map();
    maxConcurrency;
    constructor() {
        const isMobile = typeof window !== 'undefined' &&
            (window.innerWidth < 768 ||
                /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator?.userAgent || ''));
        // Concurrency: max 1 on mobile, max 2 on desktop (KL-02)
        this.maxConcurrency = isMobile ? 1 : 2;
    }
    /**
     * Enqueue a new render task with cancellation support.
     */
    enqueue(id, run, priority = 0, externalSignal) {
        // Abort any existing queued or active task with the same ID
        this.cancel(id);
        const abortController = new AbortController();
        if (externalSignal) {
            if (externalSignal.aborted) {
                abortController.abort();
            }
            else {
                externalSignal.addEventListener('abort', () => abortController.abort(), { once: true });
            }
        }
        let taskResolve;
        let taskReject;
        const promise = new Promise((res, rej) => {
            taskResolve = res;
            taskReject = rej;
        });
        const task = {
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
        }
        else {
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
    cancel(id) {
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
    cancelAll() {
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
    get pendingCount() {
        return this.queue.length + this.activeTasks.size;
    }
    async processNext() {
        if (this.activeTasks.size >= this.maxConcurrency || this.queue.length === 0) {
            return;
        }
        const task = this.queue.shift();
        if (!task)
            return;
        if (task.abortController.signal.aborted) {
            this.processNext();
            return;
        }
        this.activeTasks.set(task.id, task);
        try {
            const result = await task.run(task.abortController.signal);
            if (!task.abortController.signal.aborted) {
                task.resolve(result);
            }
            else {
                task.reject(new DOMException('Render completed but was aborted', 'AbortError'));
            }
        }
        catch (err) {
            task.reject(err);
        }
        finally {
            this.activeTasks.delete(task.id);
            this.processNext();
        }
    }
}
export const mermaidQueue = new MermaidRenderQueue();
