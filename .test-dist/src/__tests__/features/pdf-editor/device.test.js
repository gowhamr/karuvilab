// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getDeviceTier, getMaxFileSize } from '../../../features/pdf-editor/utils/device';
describe('device memory heuristics', () => {
    let originalWindow;
    let originalNavigator;
    beforeEach(() => {
        if (typeof global.window === 'undefined') {
            global.window = { innerWidth: 1024 };
        }
        if (typeof global.navigator === 'undefined') {
            global.navigator = { hardwareConcurrency: 8 };
        }
        originalWindow = { innerWidth: window.innerWidth };
        originalNavigator = { hardwareConcurrency: navigator.hardwareConcurrency, deviceMemory: navigator.deviceMemory };
        Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
        Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, writable: true, configurable: true });
        Object.defineProperty(navigator, 'deviceMemory', { value: undefined, writable: true, configurable: true });
    });
    afterEach(() => {
        if (typeof window !== 'undefined') {
            Object.defineProperty(window, 'innerWidth', { value: originalWindow?.innerWidth ?? 1024, writable: true, configurable: true });
        }
        if (typeof navigator !== 'undefined') {
            Object.defineProperty(navigator, 'hardwareConcurrency', { value: originalNavigator?.hardwareConcurrency ?? 8, writable: true, configurable: true });
            Object.defineProperty(navigator, 'deviceMemory', { value: undefined, writable: true, configurable: true });
        }
    });
    it('uses deviceMemory directly if available (low)', () => {
        expect(getDeviceTier({ deviceMemory: 4 })).toBe('low');
    });
    it('uses deviceMemory directly if available (standard)', () => {
        expect(getDeviceTier({ deviceMemory: 8 })).toBe('standard');
    });
    it('uses deviceMemory directly if available (desktop)', () => {
        expect(getDeviceTier({ deviceMemory: 16 })).toBe('desktop');
    });
    it('falls back to viewport+cores for low tier', () => {
        expect(getDeviceTier({ hardwareConcurrency: 4 }, 400)).toBe('low');
    });
    it('falls back to viewport+cores for standard tier (narrow but many cores)', () => {
        expect(getDeviceTier({ hardwareConcurrency: 8 }, 400)).toBe('standard');
    });
    it('falls back to viewport+cores for standard tier (wide but few cores)', () => {
        expect(getDeviceTier({ hardwareConcurrency: 4 }, 1024)).toBe('standard');
    });
    it('falls back to viewport+cores for desktop tier (wide and many cores)', () => {
        expect(getDeviceTier({ hardwareConcurrency: 8 }, 1024)).toBe('desktop');
    });
    it('returns correct max file sizes', () => {
        expect(getMaxFileSize('low')).toBe(50 * 1024 * 1024);
        expect(getMaxFileSize('standard')).toBe(100 * 1024 * 1024);
        expect(getMaxFileSize('desktop')).toBe(200 * 1024 * 1024);
    });
});
