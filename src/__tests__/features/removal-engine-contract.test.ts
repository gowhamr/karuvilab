/**
 * KaruviLab (KV) Removal Engine Architecture Contract Tests
 * Validates interface compliance, capability metadata, estimate models, and error handling.
 */

import { describe, it, expect } from 'vitest';
import { removalEngineRegistry } from '@/src/features/background-remover/engine-registry';
import { InstantCanvasEngine } from '@/src/features/background-remover/engines/instant-canvas.engine';
import { U2NetPEngine } from '@/src/features/background-remover/engines/u2netp.engine';
import { RMBGEngine } from '@/src/features/background-remover/engines/rmbg.engine';
import { EngineExecutionError } from '@/src/features/background-remover/contracts/removal-engine.contract';

describe('Removal Engine Contract Hardening Suite', () => {
  it('should register and resolve all 3 core engines and their aliases', () => {
    const engines = removalEngineRegistry.list();
    expect(engines.length).toBeGreaterThanOrEqual(3);

    const canvas = removalEngineRegistry.get('canvas');
    expect(canvas).toBeInstanceOf(InstantCanvasEngine);
    expect(canvas.id).toBe('instant-canvas');

    const u2netp = removalEngineRegistry.get('u2netp');
    expect(u2netp).toBeInstanceOf(U2NetPEngine);
    expect(u2netp.id).toBe('u2netp-mobile');

    const rmbg = removalEngineRegistry.get('rmbg');
    expect(rmbg).toBeInstanceOf(RMBGEngine);
    expect(rmbg.id).toBe('background-removal-rmbg');
  });

  it('should validate InstantCanvasEngine capabilities and estimate model', async () => {
    const engine = new InstantCanvasEngine();
    expect(engine.capabilities.requiresDownload).toBe(false);
    expect(engine.capabilities.downloadSizeBytes).toBe(0);
    expect(engine.capabilities.preferredBackend).toBe('worker');
    expect(engine.capabilities.latencyTier).toBe('instant');

    const available = await engine.isAvailable();
    expect(available).toBe(true);

    const estimate = engine.estimate({ width: 1920, height: 1080, fileSize: 1_500_000 });
    expect(estimate.estimatedTimeMs).toBeGreaterThan(0);
    expect(estimate.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('should validate U2NetPEngine capabilities and WASM configuration', async () => {
    const engine = new U2NetPEngine();
    expect(engine.capabilities.requiresDownload).toBe(true);
    expect(engine.capabilities.downloadSizeBytes).toBeGreaterThan(4_000_000);
    expect(engine.capabilities.preferredBackend).toBe('wasm');
    expect(engine.capabilities.supportsHairRefinement).toBe(true);

    const available = await engine.isAvailable();
    expect(typeof available).toBe('boolean');

    const estimate = engine.estimate({ width: 800, height: 600, fileSize: 500_000 });
    expect(estimate.estimatedTimeMs).toBeGreaterThan(0);
    expect(estimate.recommendedBackend).toBe('wasm');
  });

  it('should validate RMBGEngine capabilities and WebGPU configuration', async () => {
    const engine = new RMBGEngine();
    expect(engine.capabilities.requiresDownload).toBe(true);
    expect(engine.capabilities.downloadSizeBytes).toBeGreaterThan(150_000_000);
    expect(engine.capabilities.preferredBackend).toBe('webgpu');
    expect(engine.capabilities.supportsHairRefinement).toBe(true);

    const available = await engine.isAvailable();
    expect(typeof available).toBe('boolean');

    const estimate = engine.estimate({ width: 2048, height: 2048, fileSize: 4_000_000 });
    expect(estimate.estimatedTimeMs).toBeGreaterThan(0);
  });

  it('should handle AbortSignal cancellation and throw EngineExecutionError', async () => {
    const engine = new InstantCanvasEngine();
    const controller = new AbortController();
    controller.abort();

    const dummyFile = new File([new Uint8Array(10)], 'test.png', { type: 'image/png' });

    await expect(
      engine.generateMask(
        {
          file: dummyFile,
          width: 100,
          height: 100
        },
        undefined,
        controller.signal
      )
    ).rejects.toThrow(EngineExecutionError);
  });
});
