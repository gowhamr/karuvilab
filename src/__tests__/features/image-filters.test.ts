import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workerManager } from '@/src/workers/manager';

// Mock workerManager to prevent actual web worker spawning in test environment
vi.mock('@/src/workers/manager', () => ({
  workerManager: {
    applyImageFilter: vi.fn().mockResolvedValue(new Uint8Array([137, 80, 78, 71]))
  }
}));

describe('Image Filters via Worker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const dummyBuffer = new ArrayBuffer(10);
  const mimeType = 'image/png';

  it('should call applyImageFilter with correct parameters for brightness', async () => {
    await workerManager.applyImageFilter(dummyBuffer, mimeType, 'brightness', 20);
    expect(workerManager.applyImageFilter).toHaveBeenCalledWith(dummyBuffer, mimeType, 'brightness', 20);
  });

  it('should call applyImageFilter with correct parameters for sharpen', async () => {
    await workerManager.applyImageFilter(dummyBuffer, mimeType, 'sharpen', 50);
    expect(workerManager.applyImageFilter).toHaveBeenCalledWith(dummyBuffer, mimeType, 'sharpen', 50);
  });

  it('should call applyImageFilter with correct parameters for gamma', async () => {
    await workerManager.applyImageFilter(dummyBuffer, mimeType, 'gamma', 2.2);
    expect(workerManager.applyImageFilter).toHaveBeenCalledWith(dummyBuffer, mimeType, 'gamma', 2.2);
  });

  it('should return a Uint8Array representing the processed image', async () => {
    const result = await workerManager.applyImageFilter(dummyBuffer, mimeType, 'sepia', 100);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.byteLength).toBeGreaterThan(0);
  });
});
