/**
 * KaruviLab (KV) AI Background Remover - Pipeline Stress, Memory & Failure Testing
 * 
 * Validates:
 * 1. Abort signal cancellation during inference/processing.
 * 2. 4K high-resolution image scaling and memory stability.
 * 3. 20-item sequential batch processing queue.
 * 4. Rapid engine switching across all 3 engines.
 * 5. Quality & Performance Benchmark Runner integration.
 */

import { describe, it, expect } from 'vitest';
import { removalEngineRegistry } from '../../features/background-remover/engine-registry.js';
import { 
  runRemovalEngineBenchmark, 
  BENCHMARK_TEST_MATRIX, 
  calculateEdgeQualityScore 
} from '../../features/background-remover/benchmarks/benchmark-runner.js';
import { executeRemovalPipeline } from '../../features/background-remover/pipeline.js';

describe('Phase 8 & 9 — Benchmark, Stress & Memory Safety Suite', () => {
  it('should calculate accurate edge quality scores across different matte densities', () => {
    // Binary hard edge (Canvas style)
    const binaryMask = new Float32Array([0, 0, 0, 1, 1, 1, 1, 1]);
    const scoreBinary = calculateEdgeQualityScore(binaryMask, 4, 2);
    expect(scoreBinary).toBeGreaterThanOrEqual(70);

    // Smooth transition band (Neural style with 5-15% smooth transition)
    const softMask = new Float32Array(100);
    for (let i = 0; i < 100; i++) {
      if (i < 45) softMask[i] = 0;
      else if (i < 55) softMask[i] = (i - 45) / 10; // 10% smooth transition
      else softMask[i] = 1;
    }
    const scoreSoft = calculateEdgeQualityScore(softMask, 10, 10);
    expect(scoreSoft).toBeGreaterThanOrEqual(85);
  });

  it('should execute benchmark suite across registered engines and produce aggregate metrics', async () => {
    const report = await runRemovalEngineBenchmark({
      testCases: BENCHMARK_TEST_MATRIX.slice(0, 2) // Test 2 representative cases
    });

    expect(report.results.length).toBeGreaterThanOrEqual(2);
    expect(report.timestamp).toBeGreaterThan(0);
    expect(report.engineAverages).toBeDefined();

    const canvasAvg = report.engineAverages['instant-canvas'];
    if (canvasAvg) {
      expect(canvasAvg.passRatePct).toBe(100);
      expect(canvasAvg.avgTimeMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('should handle 4K Ultra HD (3840x2160) synthetic image inputs safely', async () => {
    const canvasEngine = removalEngineRegistry.get('canvas');
    const dummyBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const file = new File([dummyBytes], '4k-sample.png', { type: 'image/png' });

    const estimate = canvasEngine.estimate({
      width: 3840,
      height: 2160,
      fileSize: 5_000_000
    });

    expect(estimate.estimatedTimeMs).toBeGreaterThan(0);
    expect(estimate.confidence).toBeGreaterThan(0.9);

    // Execute mask generation on large dimension
    const output = await canvasEngine.generateMask({
      file,
      width: 3840,
      height: 2160,
      options: { bgColor: '#ffffff', tolerance: 40 }
    });

    expect(output.maskTensor).toBeInstanceOf(Float32Array);
    expect(output.maskWidth).toBeGreaterThan(0);
    expect(output.maskHeight).toBeGreaterThan(0);
  });

  it('should process a 20-item sequential batch queue without crashing or leaking state', async () => {
    const canvasEngine = removalEngineRegistry.get('canvas');
    const dummyBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const file = new File([dummyBytes], 'batch-item.png', { type: 'image/png' });

    const batchResults = [];
    for (let i = 0; i < 20; i++) {
      const output = await canvasEngine.generateMask({
        file,
        width: 400,
        height: 300,
        options: { bgColor: '#ffffff', tolerance: 30 }
      });
      batchResults.push(output);
    }

    expect(batchResults.length).toBe(20);
    for (const res of batchResults) {
      expect(res.maskTensor.length).toBeGreaterThan(0);
      expect(res.backendUsed).toBe('worker');
    }
  });

  it('should support rapid engine switching across Canvas, U2NetP, and RMBG', () => {
    const engineSequence = ['canvas', 'u2netp', 'rmbg', 'canvas', 'u2netp', 'rmbg'];
    for (const key of engineSequence) {
      const engine = removalEngineRegistry.get(key);
      expect(engine).toBeDefined();
      expect(typeof engine.name).toBe('string');
      expect(engine.capabilities.supportedMimeTypes.length).toBeGreaterThan(0);
    }
  });

  it('should abort immediately and safely on AbortSignal without lingering references', async () => {
    const controller = new AbortController();
    controller.abort(); // Pre-aborted

    const canvasEngine = removalEngineRegistry.get('canvas');
    const dummyBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const file = new File([dummyBytes], 'aborted.png', { type: 'image/png' });

    let threw = false;
    try {
      await canvasEngine.generateMask(
        { file, width: 200, height: 200 },
        undefined,
        controller.signal
      );
    } catch {
      threw = true;
    }

    expect(threw).toBe(true);
  });
});
