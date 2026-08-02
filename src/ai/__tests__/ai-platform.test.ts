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
});
