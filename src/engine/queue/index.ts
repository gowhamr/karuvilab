import { EngineTask, WorkerDomain } from '../types';

export class TaskQueue {
  private queue: EngineTask[] = [];

  enqueue(task: EngineTask) {
    this.queue.push(task);
    // Sort by priority weight
    this.queue.sort((a, b) => b.priority.weight - a.priority.weight);
  }

  dequeue(domain?: WorkerDomain): EngineTask | undefined {
    if (!domain) {
      return this.queue.shift();
    }
    const idx = this.queue.findIndex(t => t.domain === domain);
    if (idx !== -1) {
      return this.queue.splice(idx, 1)[0];
    }
    return undefined;
  }

  peek(): EngineTask | undefined {
    return this.queue[0];
  }

  get length() {
    return this.queue.length;
  }
}
