import { BMIResult, UnitSystem, BMIInput, BMICalculatorResponse } from "../types";
import { STANDARD_THRESHOLDS, ASIAN_THRESHOLDS } from "../constants";

export function lbsToKg(lbs: number): number {
  return lbs * 0.45359237;
}

export function kgToLbs(kg: number): number {
  return kg * 2.20462262;
}

export function cmToInches(cm: number): number {
  return cm / 2.54;
}

export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

export function feetInchesToCm(feet: number, inches: number): number {
  return inchesToCm((feet * 12) + inches);
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cmToInches(cm);
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function calculateBMIPrime(bmi: number): number {
  // BMI Prime = BMI / 25 (where 25 is upper limit of normal weight)
  return Number((bmi / 25.0).toFixed(2));
}

export function calculatePonderalIndex(weightKg: number, heightCm: number): number {
  // Ponderal Index = weight (kg) / height^3 (m^3)
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM * heightM)).toFixed(2));
}

export function getHealthyWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: 18.5 * (heightM * heightM),
    max: 24.9 * (heightM * heightM)
  };
}

export function calculateDeterministicBMI(input: BMIInput): BMICalculatorResponse {
  const { unit } = input;
  let heightCm: number;
  let weightKg: number;

  if (unit === 'imperial') {
    const feet = input.heightFeet ?? 5;
    const inches = input.heightInches ?? 7;
    const lbs = input.weightLbs ?? 154;

    if (isNaN(feet) || isNaN(inches) || feet < 0 || inches < 0) {
      return {
        success: false,
        error: { code: 'INVALID_HEIGHT', message: 'Please enter valid feet and inches for height.' },
      };
    }
    if (isNaN(lbs) || lbs <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_WEIGHT', message: 'Please enter a valid positive weight in pounds.' },
      };
    }

    heightCm = feetInchesToCm(feet, inches);
    weightKg = lbsToKg(lbs);
  } else {
    heightCm = input.heightCm ?? 170;
    weightKg = input.weightKg ?? 70;

    if (isNaN(heightCm) || heightCm <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_HEIGHT', message: 'Please enter a valid positive height in centimeters.' },
      };
    }
    if (isNaN(weightKg) || weightKg <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_WEIGHT', message: 'Please enter a valid positive weight in kilograms.' },
      };
    }
  }

  // Bounds validation
  if (heightCm < 50 || heightCm > 300) {
    return {
      success: false,
      error: {
        code: 'HEIGHT_OUT_OF_RANGE',
        message: 'Height must be between 50 cm (1.6 ft) and 300 cm (9.8 ft).',
      },
    };
  }

  if (weightKg < 10 || weightKg > 600) {
    return {
      success: false,
      error: {
        code: 'WEIGHT_OUT_OF_RANGE',
        message: 'Weight must be between 10 kg (22 lbs) and 600 kg (1320 lbs).',
      },
    };
  }

  const rawBmi = calculateBMI(weightKg, heightCm);
  const bmi = Math.round(rawBmi * 10) / 10;
  const bmiPrime = calculateBMIPrime(bmi);
  const ponderalIndex = calculatePonderalIndex(weightKg, heightCm);

  const threshold =
    STANDARD_THRESHOLDS.find((t) => bmi >= t.min && bmi < t.max) || STANDARD_THRESHOLDS[0]!;
  const healthyRangeKg = getHealthyWeightRange(heightCm);
  const asianCat =
    ASIAN_THRESHOLDS.find((t) => bmi >= t.min && bmi < t.max)?.label || 'Obese Class I';

  let weightToLose: number | null = null;
  let weightToGain: number | null = null;
  let weightAdjustmentText = 'Your weight is currently in the healthy range.';

  if (bmi >= 25) {
    const diffKg = weightKg - healthyRangeKg.max;
    weightToLose = unit === 'imperial' ? Math.round(kgToLbs(diffKg) * 10) / 10 : Math.round(diffKg * 10) / 10;
    weightAdjustmentText = `Lose approximately ${weightToLose} ${unit === 'imperial' ? 'lbs' : 'kg'} to reach normal BMI.`;
  } else if (bmi < 18.5) {
    const diffKg = healthyRangeKg.min - weightKg;
    weightToGain = unit === 'imperial' ? Math.round(kgToLbs(diffKg) * 10) / 10 : Math.round(diffKg * 10) / 10;
    weightAdjustmentText = `Gain approximately ${weightToGain} ${unit === 'imperial' ? 'lbs' : 'kg'} to reach normal BMI.`;
  }

  const healthyWeightMin =
    unit === 'imperial'
      ? Math.round(kgToLbs(healthyRangeKg.min) * 10) / 10
      : Math.round(healthyRangeKg.min * 10) / 10;

  const healthyWeightMax =
    unit === 'imperial'
      ? Math.round(kgToLbs(healthyRangeKg.max) * 10) / 10
      : Math.round(healthyRangeKg.max * 10) / 10;

  const formattedHealthyRange = `${healthyWeightMin} – ${healthyWeightMax} ${
    unit === 'imperial' ? 'lbs' : 'kg'
  }`;

  return {
    success: true,
    data: {
      bmi,
      formattedBmi: bmi.toFixed(1),
      bmiPrime,
      ponderalIndex,
      category: threshold.label,
      threshold,
      healthyWeightMin,
      healthyWeightMax,
      formattedHealthyRange,
      weightToLose,
      weightToGain,
      weightAdjustmentText,
      asianCategory: asianCat,
      asianDiffers: asianCat !== threshold.label,
      unit,
      heightCm: Math.round(heightCm * 10) / 10,
      weightKg: Math.round(weightKg * 10) / 10,
    },
  };
}

// Backward compatibility alias
export function calculateBMIResult(
  weightKg: number,
  heightCm: number,
  unit: UnitSystem
): BMIResult {
  const res = calculateDeterministicBMI({
    unit,
    heightCm,
    weightKg,
  });
  if (res.success) return res.data;
  // Fallback safe object
  return {
    bmi: 22.0,
    formattedBmi: '22.0',
    bmiPrime: 0.88,
    ponderalIndex: 12.5,
    category: 'Normal',
    threshold: STANDARD_THRESHOLDS[2]!,
    healthyWeightMin: 53.5,
    healthyWeightMax: 72.0,
    formattedHealthyRange: '53.5 – 72.0 kg',
    weightToLose: null,
    weightToGain: null,
    weightAdjustmentText: 'Your weight is currently in the healthy range.',
    asianCategory: 'Normal',
    asianDiffers: false,
    unit,
    heightCm,
    weightKg,
  };
}
