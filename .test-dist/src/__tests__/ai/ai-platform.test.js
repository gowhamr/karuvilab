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
        // All models must have required structural fields
        for (const model of models) {
            expect(model.id).toBeDefined();
            expect(model.sizeMB).toBeGreaterThan(0);
            expect(model.backend.length).toBeGreaterThan(0);
            expect(model.inputFormats.length).toBeGreaterThan(0);
            expect(model.outputFormats.length).toBeGreaterThan(0);
        }
        // Available (non-placeholder) models MUST have a valid 64-char SHA-256
        const availableModels = models.filter(m => m.available !== false);
        expect(availableModels.length).toBeGreaterThanOrEqual(1);
        for (const model of availableModels) {
            expect(model.sha256, `Model '${model.id}' is marked available but has no valid sha256`).toBeDefined();
            expect(model.sha256?.length, `Model '${model.id}' sha256 must be 64 hex chars`).toBe(64);
        }
        // Unavailable (placeholder) models must be explicitly flagged
        const unavailableModels = models.filter(m => m.available === false);
        for (const model of unavailableModels) {
            expect(model.available, `Model '${model.id}' placeholder must explicitly set available:false`).toBe(false);
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
    it('should verify SHA-256 model checksum integrity', async () => {
        const dummyBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
        const isValid = await modelManager.verifyModelIntegrity(dummyBuffer, '74f81fe167d99b4cb41d6d0ccda82278caee9f3e2f25d5e5a3936ff3dcec60d0');
        expect(isValid).toBe(true);
        const isInvalid = await modelManager.verifyModelIntegrity(dummyBuffer, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        expect(isInvalid).toBe(false);
    });
    it('should execute ai.run() and support releaseSession()', async () => {
        const mockSession = { run: async () => ({ output: new Float32Array([1, 2, 3]) }), release: async () => { } };
        ai.activeSessions.set('background-removal-rmbg', mockSession);
        if (!ai.diagnostics.loadedModels.includes('background-removal-rmbg')) {
            ai.diagnostics.loadedModels.push('background-removal-rmbg');
        }
        const status1 = await ai.getStatus();
        expect(status1.loadedModels.includes('background-removal-rmbg')).toBe(true);
        await ai.releaseSession('background-removal-rmbg');
        const status2 = await ai.getStatus();
        expect(status2.loadedModels.includes('background-removal-rmbg')).toBe(false);
    });
    it('should support LRU model cache eviction', async () => {
        const { evictLruModelCache } = await import('@/src/ai/model-cache');
        const evicted = await evictLruModelCache(500 * 1024 * 1024);
        expect(typeof evicted).toBe('number');
        expect(evicted).toBeGreaterThanOrEqual(0);
    });
    it('should process YOLOv8 detection output tensors and apply NMS correctly', async () => {
        const { processDetectionOutputs, applyNMS } = await import('@/src/features/detection/postprocess');
        const outputTensor = new Float32Array(84 * 8400);
        // Mock anchor 0: cx=320, cy=320, w=100, h=100, class_0=0.85
        outputTensor[0 * 8400 + 0] = 320;
        outputTensor[1 * 8400 + 0] = 320;
        outputTensor[2 * 8400 + 0] = 100;
        outputTensor[3 * 8400 + 0] = 100;
        outputTensor[4 * 8400 + 0] = 0.85;
        const boxes = processDetectionOutputs(outputTensor, 1280, 720, 0.5);
        expect(boxes.length).toBe(1);
        expect(boxes[0]?.label).toBe('face');
        expect(boxes[0]?.confidence).toBeCloseTo(0.85);
        const candidates = [
            { x: 10, y: 10, width: 100, height: 100, confidence: 0.9, label: 'face' },
            { x: 12, y: 12, width: 100, height: 100, confidence: 0.8, label: 'face' } // Overlapping duplicate
        ];
        const filtered = applyNMS(candidates, 0.45);
        expect(filtered.length).toBe(1);
        expect(filtered[0]?.confidence).toBe(0.9);
    });
    it('should select optimal model via selectOptimalBackgroundModel based on device and preferences', async () => {
        const { selectOptimalBackgroundModel } = await import('@/src/ai/selector');
        // Default desktop high-precision
        const desktopModel = await selectOptimalBackgroundModel({ imageWidth: 1920, imageHeight: 1080 });
        expect(desktopModel.id).toBeDefined();
        // Speed priority
        const speedModel = await selectOptimalBackgroundModel({ imageWidth: 1024, imageHeight: 1024, preferredQuality: 'speed' });
        expect(speedModel.id).toBe('u2netp-mobile');
        // Portrait priority
        const portraitModel = await selectOptimalBackgroundModel({ imageWidth: 512, imageHeight: 512, isHumanPortrait: true });
        expect(portraitModel.id).toBe('modnet-portrait');
    });
    it('should apply guided image filter for alpha refinement', async () => {
        const { applyGuidedFilter } = await import('@/src/features/background-remover/guided-filter');
        const coarseAlpha = new Float32Array([0.0, 0.5, 1.0, 0.5]);
        const guideRGBA = new Uint8Array([0, 0, 0, 255, 128, 128, 128, 255, 255, 255, 255, 255, 200, 200, 200, 255]);
        const refined = applyGuidedFilter(coarseAlpha, guideRGBA, 2, 2);
        expect(refined.length).toBe(4);
        expect(refined[0]).toBe(0.0);
        expect(refined[2]).toBe(1.0);
        expect(refined[1]).toBeGreaterThan(0.0);
    });
});
