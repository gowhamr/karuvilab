import { BMIResult, BMICategory, UnitSystem } from "../types";
import { STANDARD_THRESHOLDS, ASIAN_THRESHOLDS } from "../constants";

export function lbsToKg(lbs: number): number { return lbs * 0.453592; }
export function kgToLbs(kg: number): number { return kg * 2.20462; }
export function cmToInches(cm: number): number { return cm * 0.393701; }
export function inchesToCm(inches: number): number { return inches * 2.54; }
export function feetInchesToCm(feet: number, inches: number): number {
  return inchesToCm((feet * 12) + inches);
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getHealthyWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: 18.5 * (heightM * heightM),
    max: 24.9 * (heightM * heightM)
  };
}

export function calculateBMIResult(weightKg: number, heightCm: number, unit: UnitSystem): BMIResult {
  const bmi = calculateBMI(weightKg, heightCm);
  const threshold = STANDARD_THRESHOLDS.find(t => bmi >= t.min && bmi < t.max) || STANDARD_THRESHOLDS[0]!;
  const healthyRange = getHealthyWeightRange(heightCm);
  const asianCat = ASIAN_THRESHOLDS.find(t => bmi >= t.min && bmi < t.max)?.label || 'Obese Class I';

  let weightToLose: number | null = null;
  let weightToGain: number | null = null;

  if (bmi >= 25) {
    weightToLose = weightKg - healthyRange.max;
  } else if (bmi < 18.5) {
    weightToGain = healthyRange.min - weightKg;
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    category: threshold.label,
    threshold,
    healthyWeightMin: healthyRange.min,
    healthyWeightMax: healthyRange.max,
    weightToLose: weightToLose ? (unit === 'imperial' ? kgToLbs(weightToLose) : weightToLose) : null,
    weightToGain: weightToGain ? (unit === 'imperial' ? kgToLbs(weightToGain) : weightToGain) : null,
    asianCategory: asianCat,
    asianDiffers: asianCat !== threshold.label
  };
}
