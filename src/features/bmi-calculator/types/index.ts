export type UnitSystem = 'metric' | 'imperial';

export type BMICategory =
  | 'Severely Underweight'
  | 'Underweight'
  | 'Normal'
  | 'Overweight'
  | 'Obese Class I'
  | 'Obese Class II'
  | 'Obese Class III';

export interface BMIThreshold {
  label: BMICategory;
  min: number;
  max: number;
  color: string;
  bgColor: string;
  borderColor: string;
  gaugeColor: string;
  advice: string;
}

export interface BMIInput {
  unit: UnitSystem;
  heightCm?: number;
  heightFeet?: number;
  heightInches?: number;
  weightKg?: number;
  weightLbs?: number;
}

export interface BMIResult {
  bmi: number;
  formattedBmi: string;
  bmiPrime: number;
  ponderalIndex: number;
  category: BMICategory;
  threshold: BMIThreshold;
  healthyWeightMin: number;
  healthyWeightMax: number;
  formattedHealthyRange: string;
  weightToLose: number | null;
  weightToGain: number | null;
  weightAdjustmentText: string;
  asianCategory: BMICategory;
  asianDiffers: boolean;
  unit: UnitSystem;
  heightCm: number;
  weightKg: number;
}

export type BMICalculatorErrorCode =
  | 'INVALID_HEIGHT'
  | 'INVALID_WEIGHT'
  | 'HEIGHT_OUT_OF_RANGE'
  | 'WEIGHT_OUT_OF_RANGE';

export interface BMICalculatorError {
  code: BMICalculatorErrorCode;
  message: string;
}

export type BMICalculatorResponse =
  | { success: true; data: BMIResult }
  | { success: false; error: BMICalculatorError };
