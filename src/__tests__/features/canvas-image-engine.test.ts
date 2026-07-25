/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flipImage, mirrorImage, ASPECT_RATIO_PRESETS } from '@/src/lib/canvas-image-engine';

describe('Canvas Image Engine', () => {
  let mockContext: any;
  let mockCanvas: any;
  let mockImage: any;

  beforeEach(() => {
    mockContext = {
      scale: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      setLineDash: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      stroke: vi.fn(),
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
    };

    mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(mockContext),
      toBlob: vi.fn((callback) => callback(new Blob(['mock blob content'], { type: 'image/png' }))),
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') return mockCanvas as any;
      return {} as any;
    });

    mockImage = {
      naturalWidth: 100,
      naturalHeight: 200,
    };
  });

  it('should export ASPECT_RATIO_PRESETS correctly', () => {
    expect(ASPECT_RATIO_PRESETS.length).toBeGreaterThan(0);
    expect(ASPECT_RATIO_PRESETS[0]?.label).toBe('1:1');
  });

  it('should flip image horizontally', async () => {
    const blob = await flipImage(mockImage as any, 'horizontal');
    expect(blob).toBeInstanceOf(Blob);
    expect(mockContext.scale).toHaveBeenCalledWith(-1, 1);
    expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, -100, 0, 100, 200);
  });

  it('should mirror image (horizontal flip alias)', async () => {
    const blob = await mirrorImage(mockImage as any);
    expect(blob).toBeInstanceOf(Blob);
    expect(mockContext.scale).toHaveBeenCalledWith(-1, 1);
  });
});
