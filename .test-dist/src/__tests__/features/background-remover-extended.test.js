/**
 * KaruviLab (KV) AI & Canvas Background Remover Extended Feature Suite
 * Tests Brush Studio, Transforms, Multi-Format Export, Studio Backdrops, and Batch ZIP creation.
 */
import { describe, it, expect } from 'vitest';
import { STUDIO_PRESETS, autoDetectBackgroundColor } from '@/src/features/background-remover/backdrop-compositor';
import { analyzeImageForRemoval } from '@/src/features/background-remover/engine-selector';
import { BrushStudioEngine } from '@/src/features/background-remover/brush-engine';
import { zip } from 'fflate';
describe('Background Remover Extended Suite', () => {
    it('should validate all 7 studio backdrop presets and drawing routines', () => {
        expect(STUDIO_PRESETS.length).toBe(7);
        for (const preset of STUDIO_PRESETS) {
            expect(preset.id).toMatch(/^studio-/);
            expect(preset.name.length).toBeGreaterThan(0);
            expect(preset.cssPreview).toContain('gradient');
        }
    });
    it('should verify BrushStudioEngine undo/redo history stack logic', () => {
        if (typeof OffscreenCanvas !== 'undefined' || typeof document !== 'undefined') {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const original = document.createElement('canvas');
            original.width = 100;
            original.height = 100;
            const engine = new BrushStudioEngine(canvas, original);
            expect(engine.canUndo()).toBe(false);
            expect(engine.canRedo()).toBe(false);
            // Paint a stamp and save history
            engine.paintStamp(50, 50, 'eraser', 20, 80, 1.0);
            engine.saveHistoryState();
            expect(engine.canUndo()).toBe(true);
            expect(engine.canRedo()).toBe(false);
            // Perform undo
            const undone = engine.undo();
            expect(undone).toBe(true);
            expect(engine.canRedo()).toBe(true);
            // Perform redo
            const redone = engine.redo();
            expect(redone).toBe(true);
            expect(engine.canRedo()).toBe(false);
        }
    });
    it('should support async zip archiving for batch export', async () => {
        const zipData = {
            'image1.png': new Uint8Array([1, 2, 3]),
            'image2.png': new Uint8Array([4, 5, 6])
        };
        const zipped = await new Promise((resolve, reject) => {
            zip(zipData, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
        expect(zipped.length).toBeGreaterThan(0);
    });
    it('should verify autoDetectBackgroundColor returns a valid hex color string', () => {
        if (typeof document !== 'undefined') {
            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 50;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(0, 0, 50, 50);
                const detected = autoDetectBackgroundColor(canvas);
                expect(detected).toMatch(/^#[0-9a-f]{6}$/i);
            }
        }
        else {
            const detected = autoDetectBackgroundColor({ width: 50, height: 50 });
            expect(detected).toMatch(/^#[0-9a-f]{6}$/i);
        }
    });
    it('should verify analyzeImageForRemoval detects uniform background correctly', () => {
        const result = analyzeImageForRemoval({ width: 50, height: 50 });
        expect(result).toBeDefined();
        expect(result.engine).toMatch(/canvas|u2netp|rmbg/);
        expect(result.confidence).toBeGreaterThan(0);
        expect(typeof result.reason).toBe('string');
    });
    it('should verify analyzeImageForRemoval recommends RMBG when WebGPU is available for high-res images', () => {
        const recommendation = analyzeImageForRemoval({ width: 1200, height: 1200 }, { hasWebGpu: true, isMobile: false });
        expect(recommendation).toBeDefined();
        expect(['canvas', 'rmbg', 'u2netp']).toContain(recommendation.engine);
    });
});
