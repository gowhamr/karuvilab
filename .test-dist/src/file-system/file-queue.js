export class FileQueue {
    queue = [];
    concurrency;
    activeCount = 0;
    processor;
    constructor(concurrency, processor) {
        this.concurrency = concurrency;
        this.processor = processor;
    }
    add(item) {
        this.queue.push(item);
        this.processNext();
    }
    async processNext() {
        if (this.activeCount >= this.concurrency || this.queue.length === 0) {
            return;
        }
        this.activeCount++;
        const item = this.queue.shift();
        try {
            await this.processor(item);
        }
        finally {
            this.activeCount--;
            this.processNext();
        }
    }
    clear() {
        this.queue = [];
    }
}
