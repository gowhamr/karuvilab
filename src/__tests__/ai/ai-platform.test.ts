/**
 * KaruviLab (KV) AI Platform v1.0 - End-to-End Governance Tests
 */

import { describe, it, expect } from 'vitest';
import { AI_MODEL_REGISTRY, getModelManifest } from '@/src/ai/registry';
import { ai } from '@/src/ai/sdk';
import { modelManager } from '@/src/ai/model-manager';

describe('AI Platform Governance Suite', () => {
  it('should validate all registered model manifests contain valid SHA-256 checksums and metadata', () => {
    const models = Object.values(AI_MODEL_REGISTRY);
    expect(models.length).toBeGreaterThanOrEqual(4);

    for (const model of models) {
      expect(model.id).toBeDefined();
      expect(model.sha256).toBeDefined();
      expect(model.sha256?.length).toBe(64);
      expect(model.sizeMB).toBeGreaterThan(0);
      expect(model.backend.length).toBeGreaterThan(0);
      expect(model.inputFormats.length).toBeGreaterThan(0);
      expect(model.outputFormats.length).toBeGreaterThan(0);
    }
  });

  it('should retrieve manifest correctly via getModelManifest()', () => {
    const rmbg = getModelManifest('background-removal-rmbg');
    expect(rmbg.name).toContain('RMBG');
    expect(rmbg.category).toBe('segmentation');
  });

  it('should compute storage metrics via modelManager.getStorageMetrics()', async () => {
    const metrics = await modelManager.getStorageMetrics();
    expect(metrics.totalModels).toBeGreaterThanOrEqual(0);
    expect(metrics.totalSizeMB).toBeGreaterThanOrEqual(0);
  });

  it('should initialize SDK and report capabilities and diagnostics', async () => {
    const caps = await ai.getCapabilities();
    expect(caps.recommendedBackend).toBeDefined();

    const diagnostics = ai.getDiagnostics();
    expect(diagnostics.activeBackend).toBeDefined();
  });
});
