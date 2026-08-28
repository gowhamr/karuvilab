import { describe, it, expect } from 'vitest';
import { calculateForwardDiscount, calculateFindDiscount, calculateFindOriginal, } from '@/src/features/calculators/discount';
describe('Phase 1 — Pure Deterministic Engine: calculateForwardDiscount', () => {
    it('calculates single percentage discount accurately', () => {
        const res = calculateForwardDiscount({
            originalPrice: 1000,
            discountPercent: 20,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.finalPayable).toBe(800);
            expect(res.data.totalSavings).toBe(200);
            expect(res.data.effectiveDiscountPercent).toBe(20);
            expect(res.data.taxAmount).toBe(0);
        }
    });
    it('calculates double-stacked discounts multiplicatively (e.g. 20% + 10% = 28%)', () => {
        const res = calculateForwardDiscount({
            originalPrice: 1000,
            discountPercent: 20,
            extraDiscountPercent: 10,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.firstDiscountSavings).toBe(200);
            expect(res.data.extraDiscountSavings).toBe(80); // 10% of 800
            expect(res.data.preTaxPrice).toBe(720);
            expect(res.data.totalSavings).toBe(280);
            expect(res.data.effectiveDiscountPercent).toBe(28);
            expect(res.data.finalPayable).toBe(720);
        }
    });
    it('calculates stacked discount with sales tax added on post-discount subtotal', () => {
        const res = calculateForwardDiscount({
            originalPrice: 1000,
            discountPercent: 20,
            extraDiscountPercent: 10,
            taxPercent: 5,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.preTaxPrice).toBe(720);
            expect(res.data.taxAmount).toBe(36); // 5% of 720
            expect(res.data.finalPayable).toBe(756); // 720 + 36
        }
    });
});
describe('Phase 1 — Pure Deterministic Engine: calculateFindDiscount', () => {
    it('calculates required discount percentage to hit target price', () => {
        const res = calculateFindDiscount({
            originalPrice: 1000,
            targetPrice: 750,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.requiredDiscountPercent).toBe(25);
            expect(res.data.totalSavings).toBe(250);
        }
    });
    it('rejects target price higher than original price in discount calculation', () => {
        const res = calculateFindDiscount({
            originalPrice: 1000,
            targetPrice: 1200,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('TARGET_EXCEEDS_ORIGINAL');
        }
    });
});
describe('Phase 1 — Pure Deterministic Engine: calculateFindOriginal', () => {
    it('calculates original price from discounted sale price (e.g. 800 after 20% off -> 1000)', () => {
        const res = calculateFindOriginal({
            finalPrice: 800,
            discountPercent: 20,
        });
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data.originalPrice).toBe(1000);
            expect(res.data.totalSavings).toBe(200);
        }
    });
    it('rejects discount of 100% or greater in reverse calculation', () => {
        const res = calculateFindOriginal({
            finalPrice: 500,
            discountPercent: 100,
        });
        expect(res.success).toBe(false);
        if (!res.success) {
            expect(res.error.code).toBe('DISCOUNT_100_OR_MORE');
        }
    });
});
describe('Phase 2 — URL Contract', () => {
    it('constructs and parses canonical discount parameters', () => {
        const url = 'https://karuvilab.com/calculators/discount-calculator/?mode=forward&price=2500&discount=30&extra=5&tax=8';
        const parsed = new URL(url);
        expect(parsed.searchParams.get('mode')).toBe('forward');
        expect(parsed.searchParams.get('price')).toBe('2500');
        expect(parsed.searchParams.get('discount')).toBe('30');
        expect(parsed.searchParams.get('extra')).toBe('5');
        expect(parsed.searchParams.get('tax')).toBe('8');
        const res = calculateForwardDiscount({
            originalPrice: Number(parsed.searchParams.get('price')),
            discountPercent: Number(parsed.searchParams.get('discount')),
            extraDiscountPercent: Number(parsed.searchParams.get('extra')),
            taxPercent: Number(parsed.searchParams.get('tax')),
        });
        expect(res.success).toBe(true);
    });
});
describe('Phase 3 — Semantic DOM Contract Spec', () => {
    it('defines stable semantic data attributes for Discount Calculator', () => {
        const expected = {
            tool: 'discount-calculator',
            inputs: [
                'original-price',
                'discount-percent',
                'extra-discount-percent',
                'tax-percent',
                'target-price',
                'final-price',
            ],
            results: [
                'final-price',
                'total-savings',
                'effective-discount',
                'tax-amount',
                'required-discount',
                'original-price',
            ],
        };
        expect(expected.tool).toBe('discount-calculator');
        expect(expected.inputs).toContain('original-price');
        expect(expected.inputs).toContain('discount-percent');
        expect(expected.results).toContain('final-price');
        expect(expected.results).toContain('total-savings');
    });
});
describe('Phase 5 — Schema.org & llms.txt Contract', () => {
    it('validates tool content meets E-E-A-T requirements', async () => {
        const { discountCalculator } = await import('@/src/content/tools/discount-calculator');
        expect(discountCalculator.faq?.length).toBeGreaterThanOrEqual(5);
        expect(discountCalculator.examples?.length).toBeGreaterThanOrEqual(3);
        expect(discountCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
        expect(discountCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
    });
    it('validates public/llms.txt contains canonical discount calculator specification', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
        expect(llmsContent).toContain('[Discount Calculator](https://karuvilab.com/calculators/discount-calculator/)');
    });
});
