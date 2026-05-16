export class FileQueue<T> {
  private queue: T[] = [];
  private concurrency: number;
  private activeCount = 0;
  private processor: (item: T) => Promise<void>;

  constructor(concurrency: number, processor: (item: T) => Promise<void>) {
    this.concurrency = concurrency;
    this.processor = processor;
  }

  add(item: T) {
    this.queue.push(item);
    this.processNext();
  }

  private async processNext() {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.activeCount++;
    const item = this.queue.shift()!;

    try {
      await this.processor(item);
    } finally {
      this.activeCount--;
      this.processNext();
    }
  }

  clear() {
    this.queue = [];
  }
}
