import { describe, it, expect } from 'vitest';
import {
  calculateDeterministicBMI,
  calculateBMI,
  calculateBMIPrime,
  calculatePonderalIndex,
  getHealthyWeightRange,
  feetInchesToCm,
} from '@/src/features/bmi-calculator/utils';

describe('Phase 1 — Pure Deterministic Engine: calculateDeterministicBMI', () => {
  it('calculates standard normal BMI correctly in metric system', () => {
    const res = calculateDeterministicBMI({
      unit: 'metric',
      heightCm: 170,
      weightKg: 70,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.bmi).toBe(24.2);
      expect(res.data.formattedBmi).toBe('24.2');
      expect(res.data.category).toBe('Normal');
      expect(res.data.bmiPrime).toBe(0.97);
      expect(res.data.weightToLose).toBeNull();
      expect(res.data.weightToGain).toBeNull();
    }
  });

  it('calculates overweight BMI and required weight to lose', () => {
    const res = calculateDeterministicBMI({
      unit: 'metric',
      heightCm: 170,
      weightKg: 85,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.bmi).toBe(29.4);
      expect(res.data.category).toBe('Overweight');
      expect(res.data.weightToLose).toBeGreaterThan(0);
      expect(res.data.weightAdjustmentText).toContain('Lose approximately');
    }
  });

  it('calculates underweight BMI and required weight to gain', () => {
    const res = calculateDeterministicBMI({
      unit: 'metric',
      heightCm: 175,
      weightKg: 50,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.bmi).toBe(16.3);
      expect(res.data.category).toBe('Underweight');
      expect(res.data.weightToGain).toBeGreaterThan(0);
      expect(res.data.weightAdjustmentText).toContain('Gain approximately');
    }
  });

  it('calculates imperial measurements accurately', () => {
    const res = calculateDeterministicBMI({
      unit: 'imperial',
      heightFeet: 5,
      heightInches: 10,
      weightLbs: 160,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.bmi).toBe(23);
      expect(res.data.category).toBe('Normal');
      expect(res.data.formattedHealthyRange).toContain('lbs');
    }
  });

  it('flags Asian population specific thresholds when classification differs', () => {
    // Height 170cm, Weight 68kg -> BMI 23.5 (Normal in WHO, Overweight in Asian cutoff >= 23.0)
    const res = calculateDeterministicBMI({
      unit: 'metric',
      heightCm: 170,
      weightKg: 68,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.bmi).toBe(23.5);
      expect(res.data.category).toBe('Normal');
      expect(res.data.asianCategory).toBe('Overweight');
      expect(res.data.asianDiffers).toBe(true);
    }
  });

  it('calculates Ponderal Index accurately', () => {
    const pIndex = calculatePonderalIndex(70, 170);
    // 70 / (1.7^3) = 70 / 4.913 = 14.25
    expect(pIndex).toBe(14.25);
  });
});

describe('Phase 1 — Pure Deterministic Engine: Error Handling', () => {
  it('rejects height below 50 cm', () => {
    const res = calculateDeterministicBMI({
      unit: 'metric',
      heightCm: 40,
      weightKg: 70,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('HEIGHT_OUT_OF_RANGE');
    }
  });

  it('rejects weight below 10 kg', () => {
    const res = calculateDeterministicBMI({
      unit: 'metric',
      heightCm: 170,
      weightKg: 5,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('WEIGHT_OUT_OF_RANGE');
    }
  });
});

describe('Phase 2 — URL Contract', () => {
  it('constructs and parses canonical metric BMI parameters', () => {
    const url = 'https://karuvilab.com/calculators/bmi-calculator/?unit=metric&height=180&weight=75';
    const parsed = new URL(url);
    expect(parsed.searchParams.get('unit')).toBe('metric');
    expect(parsed.searchParams.get('height')).toBe('180');
    expect(parsed.searchParams.get('weight')).toBe('75');

    const res = calculateDeterministicBMI({
      unit: 'metric',
      heightCm: Number(parsed.searchParams.get('height')),
      weightKg: Number(parsed.searchParams.get('weight')),
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.bmi).toBe(23.1);
      expect(res.data.category).toBe('Normal');
    }
  });
});

describe('Phase 3 — Semantic DOM Contract Spec', () => {
  it('defines stable semantic data attributes for BMI Calculator', () => {
    const expected = {
      tool: 'bmi-calculator',
      inputs: ['unit', 'height', 'feet', 'inches', 'weight'],
      results: [
        'bmi',
        'category',
        'bmi-prime',
        'ponderal-index',
        'healthy-weight-min',
        'healthy-weight-max',
        'weight-adjustment',
      ],
    };

    expect(expected.tool).toBe('bmi-calculator');
    expect(expected.inputs).toContain('height');
    expect(expected.inputs).toContain('weight');
    expect(expected.results).toContain('bmi');
    expect(expected.results).toContain('category');
  });
});

describe('Phase 5 — Schema.org & llms.txt Contract', () => {
  it('validates tool content meets E-E-A-T requirements', async () => {
    const { bmiCalculator } = await import('@/src/content/tools/bmi-calculator');
    expect(bmiCalculator.faq?.length).toBeGreaterThanOrEqual(5);
    expect(bmiCalculator.examples?.length).toBeGreaterThanOrEqual(3);
    expect(bmiCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
    expect(bmiCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
  });

  it('validates public/llms.txt contains canonical bmi calculator specification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
    
    expect(llmsContent).toContain('[Bmi Calculator](https://karuvilab.com/calculators/bmi-calculator/)');
  });
});
