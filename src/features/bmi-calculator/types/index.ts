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

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  threshold: BMIThreshold;
  healthyWeightMin: number;
  healthyWeightMax: number;
  weightToLose: number | null;
  weightToGain: number | null;
  asianCategory: BMICategory;
  asianDiffers: boolean;
}
