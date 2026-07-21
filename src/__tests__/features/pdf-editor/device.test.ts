// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getDeviceTier, getMaxFileSize } from '../../../features/pdf-editor/utils/device';

describe('device memory heuristics', () => {
  let originalWindow: any;
  let originalNavigator: any;

  beforeEach(() => {
    originalWindow = { ...window };
    originalNavigator = { ...navigator };
    
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, writable: true });
    Object.defineProperty(navigator, 'deviceMemory', { value: undefined, writable: true, configurable: true });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: originalWindow.innerWidth, writable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: originalNavigator.hardwareConcurrency, writable: true });
    Object.defineProperty(navigator, 'deviceMemory', { value: originalNavigator.deviceMemory, writable: true, configurable: true });
  });

  it('uses deviceMemory directly if available (low)', () => {
    Object.defineProperty(navigator, 'deviceMemory', { value: 4, writable: true, configurable: true });
    expect(getDeviceTier()).toBe('low');
  });

  it('uses deviceMemory directly if available (standard)', () => {
    Object.defineProperty(navigator, 'deviceMemory', { value: 8, writable: true, configurable: true });
    expect(getDeviceTier()).toBe('standard');
  });

  it('uses deviceMemory directly if available (desktop)', () => {
    Object.defineProperty(navigator, 'deviceMemory', { value: 16, writable: true, configurable: true });
    expect(getDeviceTier()).toBe('desktop');
  });

  it('falls back to viewport+cores for low tier', () => {
    Object.defineProperty(window, 'innerWidth', { value: 400, writable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, writable: true });
    expect(getDeviceTier()).toBe('low');
  });

  it('falls back to viewport+cores for standard tier (narrow but many cores)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 400, writable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, writable: true });
    expect(getDeviceTier()).toBe('standard');
  });

  it('falls back to viewport+cores for standard tier (wide but few cores)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, writable: true });
    expect(getDeviceTier()).toBe('standard');
  });

  it('falls back to viewport+cores for desktop tier (wide and many cores)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, writable: true });
    expect(getDeviceTier()).toBe('desktop');
  });

  it('returns correct max file sizes', () => {
    expect(getMaxFileSize('low')).toBe(50 * 1024 * 1024);
    expect(getMaxFileSize('standard')).toBe(100 * 1024 * 1024);
    expect(getMaxFileSize('desktop')).toBe(200 * 1024 * 1024);
  });
});
