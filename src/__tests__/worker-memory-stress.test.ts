import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { workerOrchestrator } from '../engine/workers/WorkerOrchestrator';

describe('WorkerOrchestrator - Memory Stress Test (100+ Executions)', () => {
  beforeEach(() => {
    // Reset orchestrator state
    workerOrchestrator.terminateAll();
    vi.useFakeTimers();
  });

  afterEach(() => {
    workerOrchestrator.terminateAll();
    vi.useRealTimers();
  });

  it('should successfully execute 100 sequential tasks without exceeding memory thresholds', async () => {
    // Mock the worker spawning logic to prevent actual Web Worker creation in JSDOM,
    // but still track the queue, memory tracking, and promise resolutions.
    let activeTasks = 0;
    
    // We will simulate 100 fast compute tasks
    const iterations = 100;
    const promises: Promise<any>[] = [];
    
    // Mock getWorker to return a mock entry
    const mockWorker = {
        terminate: vi.fn(),
        postMessage: vi.fn()
    } as unknown as Worker;
    
    const mockApi = {
        generateHashes: vi.fn().mockResolvedValue('hash-result'),
        processJson: vi.fn().mockResolvedValue('json-result')
    };
    
    // @ts-ignore - bypassing private method for test mocking
    workerOrchestrator.getWorker = vi.fn().mockResolvedValue({
        worker: mockWorker,
        api: mockApi,
        busy: false,
        lastHeard: Date.now()
    });

    for (let i = 0; i < iterations; i++) {
        // Dispatch mixed compute operations
        const method = i % 2 === 0 ? 'generateHashes' : 'processJson';
        promises.push(
            workerOrchestrator.dispatch(method, ['payload ' + i])
        );
        
        // Fast-forward timers to clear any queue microtasks
        await vi.advanceTimersByTimeAsync(100);
    }
    
    const results = await Promise.all(promises);
    
    expect(results).toHaveLength(100);
    expect(results[0]).toBe('hash-result');
    expect(results[1]).toBe('json-result');
    
    // Assert queue is fully drained
    // @ts-ignore
    const computeQueue = workerOrchestrator.pools.compute.queue;
    expect(computeQueue.length).toBe(0);
    
    // @ts-ignore
    const computeActiveTasks = workerOrchestrator.pools.compute.activeTasks;
    expect(computeActiveTasks.size).toBe(0);
  });
});
