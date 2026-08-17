import { describe, it, expect } from 'vitest';
const ALLOWED_FORMATS = [
    'jpg', 'jpeg', 'jfif', 'png', 'gif',
    'webp', 'avif', 'tiff', 'tif', 'bmp',
    'heic', 'heif', 'pdf',
];
const DOC_RULES = {
    passport_photo: { label: 'Passport Photo', formats: ['jpg', 'jpeg', 'png'], minKB: 10, maxKB: 200, exactW: 200, exactH: 230 },
    signature: { label: 'Signature', formats: ['jpg', 'jpeg', 'png'], minKB: 4, maxKB: 50, exactW: 140, exactH: 60 },
    id_proof: { label: 'ID Proof', formats: ['jpg', 'jpeg', 'png', 'pdf'], minKB: 100, maxKB: 1000 },
    thumb_impression: { label: 'Thumb Impression', formats: ['jpg', 'jpeg'], minKB: 10, maxKB: 50 },
    general: { label: 'General', formats: ALLOWED_FORMATS, maxWidthPx: 2560 },
};
function checkFormat(ext, rule) {
    return rule.formats.includes(ext);
}
function checkSize(sizeKB, rule) {
    if (rule.minKB && sizeKB < rule.minKB)
        return false;
    if (rule.maxKB && sizeKB > rule.maxKB)
        return false;
    return true;
}
// ─── ALLOWED_FORMATS completeness ───────────────────────────────
describe('ALLOWED_FORMATS', () => {
    const required = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'pdf', 'bmp', 'tiff', 'heic'];
    required.forEach(ext => {
        it(`includes ${ext}`, () => {
            expect(ALLOWED_FORMATS).toContain(ext);
        });
    });
    it('contains no duplicates', () => {
        expect(ALLOWED_FORMATS.length).toBe(new Set(ALLOWED_FORMATS).size);
    });
});
// ─── DOC_RULES format checks ────────────────────────────────────
describe('checkFormat – passport_photo', () => {
    const rule = DOC_RULES.passport_photo;
    it('accepts jpg/jpeg/png', () => {
        expect(checkFormat('jpg', rule)).toBe(true);
        expect(checkFormat('jpeg', rule)).toBe(true);
        expect(checkFormat('png', rule)).toBe(true);
    });
    it('rejects pdf/gif/webp', () => {
        expect(checkFormat('pdf', rule)).toBe(false);
        expect(checkFormat('gif', rule)).toBe(false);
        expect(checkFormat('webp', rule)).toBe(false);
    });
});
describe('checkFormat – general', () => {
    const rule = DOC_RULES.general;
    it('accepts all listed formats', () => {
        ALLOWED_FORMATS.forEach(ext => {
            expect(checkFormat(ext, rule)).toBe(true);
        });
    });
});
// ─── DOC_RULES size checks ──────────────────────────────────────
describe('checkSize – signature (4–50 KB)', () => {
    const rule = DOC_RULES.signature;
    it('accepts sizes within range', () => {
        expect(checkSize(4, rule)).toBe(true);
        expect(checkSize(25, rule)).toBe(true);
        expect(checkSize(50, rule)).toBe(true);
    });
    it('rejects sizes below minimum', () => {
        expect(checkSize(3, rule)).toBe(false);
        expect(checkSize(0, rule)).toBe(false);
    });
    it('rejects sizes above maximum', () => {
        expect(checkSize(51, rule)).toBe(false);
        expect(checkSize(1000, rule)).toBe(false);
    });
});
describe('checkSize – general (no size restriction)', () => {
    const rule = DOC_RULES.general;
    it('accepts any size', () => {
        expect(checkSize(0, rule)).toBe(true);
        expect(checkSize(500000, rule)).toBe(true);
    });
});
describe('checkSize – passport_photo (10–200 KB)', () => {
    const rule = DOC_RULES.passport_photo;
    it('accepts boundary values', () => {
        expect(checkSize(10, rule)).toBe(true);
        expect(checkSize(200, rule)).toBe(true);
    });
    it('rejects below 10 KB', () => {
        expect(checkSize(9, rule)).toBe(false);
    });
    it('rejects above 200 KB', () => {
        expect(checkSize(201, rule)).toBe(false);
    });
});
// ─── DOC_RULES dimension rules present ──────────────────────────
describe('DOC_RULES dimension correctness', () => {
    it('passport_photo has correct exact dimensions', () => {
        expect(DOC_RULES.passport_photo.exactW).toBe(200);
        expect(DOC_RULES.passport_photo.exactH).toBe(230);
    });
    it('signature has correct exact dimensions', () => {
        expect(DOC_RULES.signature.exactW).toBe(140);
        expect(DOC_RULES.signature.exactH).toBe(60);
    });
    it('general has maxWidthPx set', () => {
        expect(DOC_RULES.general.maxWidthPx).toBe(2560);
    });
});
