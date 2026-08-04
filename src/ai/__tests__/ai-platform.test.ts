/**
 * KaruviLab (KV) AI Platform Unit Test Suite
 */

import { describe, it, expect, vi } from 'vitest';
import { AI_MODEL_REGISTRY, getModelManifest, listAllModels } from '../registry';
import { ai } from '../sdk';

describe('KaruviLab Local AI Platform Registry & SDK', () => {
  it('should list all registered AI manifests', () => {
    const models = listAllModels();
    expect(models.length).toBeGreaterThanOrEqual(4);
    expect(models.some(m => m.id === 'background-removal-rmbg')).toBe(true);
    expect(models.some(m => m.id === 'ocr-paddle')).toBe(true);
  });

  it('should return valid model manifest by ID', () => {
    const manifest = getModelManifest('background-removal-rmbg');
    expect(manifest).toBeDefined();
    expect(manifest.version).toBe('2.0');
    expect(manifest.sizeMB).toBe(18.4);
    expect(manifest.sha256).toBeDefined();
  });

  it('should throw error for non-existent model ID', () => {
    expect(() => getModelManifest('non-existent-model')).toThrow();
  });

  it('should initialize SDK and return capabilities', async () => {
    const caps = await ai.getCapabilities();
    expect(caps).toBeDefined();
    expect(caps.recommendedBackend).toBeDefined();
  });

  it('should return AI runtime status and diagnostics metrics', async () => {
    const status = await ai.getStatus();
    expect(status).toBeDefined();
    expect(status.version).toBe('1.0');
    expect(status.diagnostics).toBeDefined();
  });

  it('should verify SHA-256 model checksum integrity', async () => {
    const { modelManager } = await import('../model-manager');
    const dummyBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    // Digest of [1,2,3,4,5] is 74f81fe167d99b4cb4142934e904b3915c4a7338b4b7f08f0301f4b95d13a401
    const isValid = await modelManager.verifyModelIntegrity(dummyBuffer, '74f81fe167d99b4cb4142934e904b3915c4a7338b4b7f08f0301f4b95d13a401');
    expect(isValid).toBe(true);

    const isInvalid = await modelManager.verifyModelIntegrity(dummyBuffer, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    expect(isInvalid).toBe(false);
  });

  it('should execute ai.run() and support releaseSession()', async () => {
    const input = { tensor: [1, 2, 3] };
    const result = await ai.run({
      model: 'background-removal-rmbg',
      input
    });
    expect(result).toBeDefined();
    
    await ai.releaseSession('background-removal-rmbg');
    const status = await ai.getStatus();
    expect(status.loadedModels.includes('background-removal-rmbg')).toBe(false);
  });
});
