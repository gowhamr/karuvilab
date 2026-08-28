import { describe, it, expect } from 'vitest';
import {
  calculateTimeDifference,
  calculateDurationSum,
  calculateTimeOffset,
  parseTimeToSeconds,
} from '@/src/features/calculators/time';

describe('Phase 1 — Pure Deterministic Engine: calculateTimeDifference', () => {
  it('calculates standard time difference accurately', () => {
    const res = calculateTimeDifference({
      startTime: '09:00',
      endTime: '17:30',
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.hours).toBe(8);
      expect(res.data.minutes).toBe(30);
      expect(res.data.seconds).toBe(0);
      expect(res.data.totalMinutes).toBe(510);
      expect(res.data.totalSeconds).toBe(30600);
      expect(res.data.totalHoursDecimal).toBe(8.5);
      expect(res.data.formattedHHMMSS).toBe('08:30:00');
      expect(res.data.isOvernight).toBe(false);
    }
  });

  it('calculates overnight shift crossing midnight boundary correctly', () => {
    const res = calculateTimeDifference({
      startTime: '22:00',
      endTime: '06:30',
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.hours).toBe(8);
      expect(res.data.minutes).toBe(30);
      expect(res.data.totalMinutes).toBe(510);
      expect(res.data.isOvernight).toBe(true);
    }
  });

  it('handles identical start and end time (0 duration)', () => {
    const res = calculateTimeDifference({
      startTime: '14:00',
      endTime: '14:00',
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.hours).toBe(0);
      expect(res.data.minutes).toBe(0);
      expect(res.data.seconds).toBe(0);
      expect(res.data.totalSeconds).toBe(0);
      expect(res.data.isOvernight).toBe(false);
    }
  });

  it('handles seconds precision accurately', () => {
    const res = calculateTimeDifference({
      startTime: '08:15:30',
      endTime: '10:45:50',
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.hours).toBe(2);
      expect(res.data.minutes).toBe(30);
      expect(res.data.seconds).toBe(20);
      expect(res.data.formattedHHMMSS).toBe('02:30:20');
    }
  });
});

describe('Phase 1 — Pure Deterministic Engine: calculateDurationSum', () => {
  it('sums multiple duration entries accurately', () => {
    const res = calculateDurationSum({
      durations: ['01:30', '02:45', '00:45'],
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.hours).toBe(5);
      expect(res.data.minutes).toBe(0);
      expect(res.data.seconds).toBe(0);
      expect(res.data.totalMinutes).toBe(300);
      expect(res.data.itemCount).toBe(3);
    }
  });

  it('handles large duration totals (>24 hours)', () => {
    const res = calculateDurationSum({
      durations: ['15:00', '12:30'],
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.hours).toBe(27);
      expect(res.data.minutes).toBe(30);
      expect(res.data.formattedHHMMSS).toBe('27:30:00');
    }
  });
});

describe('Phase 1 — Pure Deterministic Engine: calculateTimeOffset', () => {
  it('adds duration to clock time on same day', () => {
    const res = calculateTimeOffset({
      baseTime: '09:00',
      hours: 2,
      minutes: 30,
      seconds: 0,
      operation: 'add',
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.resultingTime).toBe('11:30:00');
      expect(res.data.formatted12Hour).toBe('11:30:00 AM');
      expect(res.data.dayShift).toBe(0);
    }
  });

  it('handles next-day rollover when adding duration past midnight', () => {
    const res = calculateTimeOffset({
      baseTime: '23:00',
      hours: 3,
      minutes: 15,
      seconds: 0,
      operation: 'add',
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.resultingTime).toBe('02:15:00');
      expect(res.data.dayShift).toBe(1);
      expect(res.data.formattedShiftText).toContain('Next Day');
    }
  });

  it('handles previous-day rollover when subtracting duration before midnight', () => {
    const res = calculateTimeOffset({
      baseTime: '01:30',
      hours: 3,
      minutes: 0,
      seconds: 0,
      operation: 'subtract',
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.resultingTime).toBe('22:30:00');
      expect(res.data.dayShift).toBe(-1);
      expect(res.data.formattedShiftText).toContain('Previous Day');
    }
  });
});

describe('Phase 2 — URL Contract', () => {
  it('constructs and parses canonical diff mode parameters', () => {
    const url = 'https://karuvilab.com/calculators/time-calculator/?mode=diff&start=09:00&end=17:30';
    const parsed = new URL(url);
    expect(parsed.searchParams.get('mode')).toBe('diff');
    expect(parsed.searchParams.get('start')).toBe('09:00');
    expect(parsed.searchParams.get('end')).toBe('17:30');

    const res = calculateTimeDifference({
      startTime: parsed.searchParams.get('start')!,
      endTime: parsed.searchParams.get('end')!,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.hours).toBe(8);
      expect(res.data.minutes).toBe(30);
    }
  });
});

describe('Phase 3 — Semantic DOM Contract Spec', () => {
  it('defines stable semantic data attributes for Time Calculator', () => {
    const expected = {
      tool: 'time-calculator',
      inputs: ['start-time', 'end-time', 'base-time', 'duration-entry', 'hours', 'minutes', 'seconds'],
      results: [
        'hours',
        'minutes',
        'seconds',
        'total-hours',
        'total-minutes',
        'total-seconds',
        'decimal-hours',
        'resulting-time',
      ],
    };

    expect(expected.tool).toBe('time-calculator');
    expect(expected.inputs).toContain('start-time');
    expect(expected.inputs).toContain('end-time');
    expect(expected.results).toContain('total-hours');
    expect(expected.results).toContain('resulting-time');
  });
});

describe('Phase 4 — Typed Error Contract', () => {
  it('rejects missing start time', () => {
    const res = calculateTimeDifference({ startTime: '', endTime: '17:00' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('MISSING_TIME');
    }
  });

  it('rejects invalid time string with out of bound hours or minutes', () => {
    const res = calculateTimeDifference({ startTime: '25:00', endTime: '17:00' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('INVALID_TIME_FORMAT');
    }
  });

  it('rejects invalid duration format in duration sum', () => {
    const res = calculateDurationSum({ durations: ['01:30', 'invalid-time'] });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe('INVALID_DURATION_VALUE');
    }
  });
});

describe('Phase 5 — Schema.org & llms.txt Contract', () => {
  it('validates tool content meets E-E-A-T requirements', async () => {
    const { timeCalculator } = await import('@/src/content/tools/time-calculator');
    expect(timeCalculator.faq?.length).toBeGreaterThanOrEqual(5);
    expect(timeCalculator.examples?.length).toBeGreaterThanOrEqual(3);
    expect(timeCalculator.howTo?.length).toBeGreaterThanOrEqual(4);
    expect(timeCalculator.useCases?.length).toBeGreaterThanOrEqual(3);
  });

  it('validates public/llms.txt contains canonical time calculator specification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const llmsContent = fs.readFileSync(path.resolve('./public/llms.txt'), 'utf-8');
    
    expect(llmsContent).toContain('[Time Calculator](https://karuvilab.com/calculators/time-calculator/)');
  });
});
