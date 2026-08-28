import { describe, it, expect } from 'vitest';
import {
  projectMedicalExpense,
  calculateMedicalBuffer
} from '../engine/healthcare-engine';

describe('Healthcare Engine', () => {
  it('projects medical expenses independently under higher medical inflation', () => {
    // 10,000 monthly medical at 12% inflation for 15 years
    // 120,000 * 1.12^15 = 120,000 * 5.47356576 ≈ 656,827.89
    const projected = projectMedicalExpense(10000, 12, 15);
    expect(projected.annualAtTarget).toBeCloseTo(656827.89, 0);
    expect(projected.monthlyAtTarget).toBeCloseTo(656827.89 / 12, 0);
  });

  it('calculates emergency medical buffer for retirement years', () => {
    // 5,000 monthly medical at 10% inflation for 20 years with 3-year buffer
    // 60,000 * 1.10^20 ≈ 60,000 * 6.7275 = 403,650
    // 3-year buffer = 403,650 * 3 = 1,210,950
    const buffer = calculateMedicalBuffer(5000, 10, 20, 3);
    expect(buffer).toBeCloseTo(1210950, -2);
  });

  it('handles zero base medical expenses gracefully', () => {
    const buffer = calculateMedicalBuffer(0, 12, 20, 3);
    expect(buffer).toBe(0);
  });
});
