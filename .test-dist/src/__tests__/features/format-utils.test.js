import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isImage, needsSpecialRead, colorFor, FORMAT_INFO } from '@/src/format-utils';
describe('Format Utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('isImage', () => {
        it('should correctly identify standard image extensions', () => {
            expect(isImage(new File([], 'test.jpg'))).toBe(true);
            expect(isImage(new File([], 'test.png'))).toBe(true);
            expect(isImage(new File([], 'test.webp'))).toBe(true);
        });
        it('should correctly identify special image extensions', () => {
            expect(isImage(new File([], 'test.heic'))).toBe(true);
            expect(isImage(new File([], 'test.tiff'))).toBe(true);
            expect(isImage(new File([], 'test.bmp'))).toBe(true);
        });
        it('should identify images based on MIME type even without proper extension', () => {
            expect(isImage(new File([], 'test.unknown', { type: 'image/jpeg' }))).toBe(true);
            expect(isImage(new File([], 'test.unknown', { type: 'image/png' }))).toBe(true);
        });
        it('should return false for non-image files', () => {
            expect(isImage(new File([], 'test.txt', { type: 'text/plain' }))).toBe(false);
            expect(isImage(new File([], 'test.pdf', { type: 'application/pdf' }))).toBe(false);
        });
    });
    describe('needsSpecialRead', () => {
        it('should return true for HEIC/HEIF files', () => {
            expect(needsSpecialRead(new File([], 'photo.heic'))).toBe(true);
            expect(needsSpecialRead(new File([], 'photo.heif'))).toBe(true);
        });
        it('should return true for TIFF files', () => {
            expect(needsSpecialRead(new File([], 'document.tiff'))).toBe(true);
            expect(needsSpecialRead(new File([], 'document.tif'))).toBe(true);
        });
        it('should return false for standard web formats', () => {
            expect(needsSpecialRead(new File([], 'photo.jpg'))).toBe(false);
            expect(needsSpecialRead(new File([], 'photo.png'))).toBe(false);
            expect(needsSpecialRead(new File([], 'photo.webp'))).toBe(false);
            expect(needsSpecialRead(new File([], 'photo.avif'))).toBe(false);
        });
    });
    describe('colorFor', () => {
        it('should return correct color mappings', () => {
            expect(colorFor('png')).toBe(FORMAT_INFO.png.color);
            expect(colorFor('jpg')).toBe(FORMAT_INFO.jpg.color);
            expect(colorFor('jpeg')).toBe(FORMAT_INFO.jpg.color); // Aliased
            expect(colorFor('heic')).toBe(FORMAT_INFO.heic.color);
            expect(colorFor('heif')).toBe(FORMAT_INFO.heic.color); // Aliased
            expect(colorFor('tiff')).toBe(FORMAT_INFO.tiff.color);
            expect(colorFor('tif')).toBe(FORMAT_INFO.tiff.color); // Aliased
        });
        it('should return default color for unknown formats', () => {
            expect(colorFor('unknown')).toBe('#6366f1');
        });
    });
});
