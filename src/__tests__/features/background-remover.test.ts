/**
 * KaruviLab (KV) AI & Canvas Background Remover Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  STUDIO_PRESETS, 
  compositeCutoutWithBackdrop,
  autoDetectBackgroundColor
} from '@/src/features/background-remover/backdrop-compositor';
import { RMBG_MODEL_MANIFEST, U2NETP_MODEL_MANIFEST } from '@/src/features/background-remover/constants';

describe('Background Remover Feature Suite', () => {
  it('should define all studio backdrop presets with valid renderers', () => {
    expect(STUDIO_PRESETS.length).toBeGreaterThanOrEqual(5);
    for (const preset of STUDIO_PRESETS) {
      expect(preset.id).toBeDefined();
      expect(preset.name).toBeDefined();
      expect(preset.cssPreview).toBeDefined();
      expect(typeof preset.draw).toBe('function');
    }
  });

  it('should validate U2NETP_MODEL_MANIFEST configuration', () => {
    expect(U2NETP_MODEL_MANIFEST.id).toBe('u2netp-mobile');
    expect(U2NETP_MODEL_MANIFEST.sizeMB).toBeLessThan(10);
    expect(U2NETP_MODEL_MANIFEST.backend).toContain('wasm');
    expect(U2NETP_MODEL_MANIFEST.input.width).toBe(320);
    expect(U2NETP_MODEL_MANIFEST.input.height).toBe(320);
    expect(U2NETP_MODEL_MANIFEST.sha256).toBe('309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8');
  });

  it('should validate RMBG_MODEL_MANIFEST configuration', () => {
    expect(RMBG_MODEL_MANIFEST.id).toBe('background-removal-rmbg');
    expect(RMBG_MODEL_MANIFEST.sizeMB).toBe(168);
    expect(RMBG_MODEL_MANIFEST.backend).toContain('webgpu');
    expect(RMBG_MODEL_MANIFEST.input.width).toBe(1024);
    expect(RMBG_MODEL_MANIFEST.input.height).toBe(1024);
    expect(RMBG_MODEL_MANIFEST.cdnUrls?.length).toBeGreaterThan(0);
  });

  it('should correctly execute studio backdrop draw routines on offscreen canvas', () => {
    if (typeof OffscreenCanvas !== 'undefined') {
      const canvas = new OffscreenCanvas(200, 200);
      const ctx = canvas.getContext('2d');
      expect(ctx).toBeDefined();

      if (ctx) {
        for (const preset of STUDIO_PRESETS) {
          expect(() => preset.draw(ctx, 200, 200)).not.toThrow();
        }
      }
    }
  });
});
