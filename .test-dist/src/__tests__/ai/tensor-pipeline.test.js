/**
 * KaruviLab (KV) AI Platform v1.0 - Tensor Pipeline & SDK Unit Tests
 */
import { describe, it, expect, vi } from 'vitest';
import { createFloat32Tensor, normalizePixels, applySigmoid, applySoftmax, findArgmax, generateTiles } from '@/src/ai/pipeline';
import { ai } from '@/src/ai/sdk';
describe('AI Platform v1.0 - Generic Tensor Pipeline', () => {
    it('should allocate and reshape Float32 tensors correctly', () => {
        const tensor = createFloat32Tensor([1, 3, 256, 256], 0.5);
        expect(tensor.data.length).toBe(1 * 3 * 256 * 256);
        expect(tensor.dataType).toBe('float32');
        expect(tensor.data[0]).toBe(0.5);
    });
    it('should normalize pixels into float32 range [0.0, 1.0]', () => {
        const rgba = new Uint8ClampedArray([255, 128, 0, 255]);
        const normalized = normalizePixels(rgba, 1, 1, 'zero-to-one');
        expect(normalized.length).toBe(3);
        expect(normalized[0]).toBe(1.0);
        expect(Math.round((normalized[1] ?? 0) * 100) / 100).toBe(0.5);
        expect(normalized[2]).toBe(0.0);
    });
    it('should compute sigmoid activation correctly', () => {
        const input = new Float32Array([0.0, 2.0, -2.0]);
        const output = applySigmoid(input);
        expect(Math.round((output[0] ?? 0) * 100) / 100).toBe(0.5);
        expect((output[1] ?? 0)).toBeGreaterThan(0.8);
        expect((output[2] ?? 0)).toBeLessThan(0.2);
    });
    it('should compute softmax probabilities summing to 1.0', () => {
        const logits = new Float32Array([2.0, 1.0, 0.1]);
        const probs = applySoftmax(logits);
        const sum = probs.reduce((a, b) => a + b, 0);
        expect(Math.round(sum)).toBe(1);
        expect((probs[0] ?? 0)).toBeGreaterThan(probs[1] ?? 0);
    });
    it('should find argmax class index and confidence', () => {
        const probs = new Float32Array([0.1, 0.7, 0.2]);
        const result = findArgmax(probs);
        expect(result.maxIndex).toBe(1);
        expect(result.confidence).toBeCloseTo(0.7, 2);
    });
    it('should generate overlapping image tile bounds', () => {
        const tiles = generateTiles(500, 500, 256, 16);
        expect(tiles.length).toBeGreaterThan(1);
        expect(tiles[0]?.width).toBe(256);
        expect(tiles[0]?.height).toBe(256);
    });
    it('should ensure model availability via high-level SDK ai.ensureModel()', async () => {
        const { AI_MODEL_REGISTRY } = await import('@/src/ai/registry');
        const modelManifest = AI_MODEL_REGISTRY['background-removal-rmbg'];
        const originalAvailable = modelManifest.available;
        modelManifest.available = true;
        try {
            const { modelManager } = await import('@/src/ai/model-manager');
            vi.spyOn(modelManager, 'ensureModelAvailable').mockImplementation(async () => new Uint8Array([1, 2, 3]).buffer);
            const ok = await ai.ensureModel('background-removal-rmbg');
            expect(ok).toBe(true);
        }
        finally {
            modelManifest.available = originalAvailable ?? false;
        }
    });
});
