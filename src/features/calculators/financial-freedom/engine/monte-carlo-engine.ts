import { FireInputs } from '../models/assumptions';
import { calculateProjection } from './projection-engine';

export interface MonteCarloResults {
  successRate: number; // 0 to 100
  totalTrials: number;
  medianTerminalCorpus: number;
  percentiles: {
    p5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
  };
  depletionYears: number[]; // the ages at which depletion happened
}

// Generate normally distributed random number using Box-Muller transform
function generateGaussian(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

export function runMonteCarloSimulation(
  inputs: Partial<FireInputs>,
  trials: number = 1000,
  stdDevMultiplier: number = 1.0
): MonteCarloResults {
  const currentAge = inputs.currentAge ?? 30;
  const longevityAge = inputs.longevityAge ?? 85;
  const targetAge = inputs.targetAge ?? 50;
  
  const yearsToLive = Math.max(1, longevityAge - currentAge);
  
  const accumulationMean = (inputs.expectedReturnRate ?? 12) / 100;
  // A typical standard deviation for 12% equity returns is ~15-20%
  const accumulationStdDev = 0.15 * stdDevMultiplier;
  
  const retirementMean = (inputs.retirementReturnRate ?? (inputs.expectedReturnRate ?? 12)) / 100;
  // A typical standard deviation for a more conservative 8% retirement portfolio is ~8-10%
  const retirementStdDev = 0.09 * stdDevMultiplier;

  let successCount = 0;
  const terminalCorpuses: number[] = [];
  const depletionAges: number[] = [];

  for (let i = 0; i < trials; i++) {
    // Generate a return sequence for this trial
    const returnsSequence: number[] = new Array(yearsToLive);
    for (let year = 1; year <= yearsToLive; year++) {
      const age = currentAge + year;
      const isAccumulation = age <= targetAge;
      
      const mean = isAccumulation ? accumulationMean : retirementMean;
      const stdDev = isAccumulation ? accumulationStdDev : retirementStdDev;
      
      returnsSequence[year - 1] = generateGaussian(mean, stdDev);
    }
    
    // Run the projection with this sequence
    const result = calculateProjection(inputs, returnsSequence);
    
    const terminalCorpus = result.projections[result.projections.length - 1]?.endCorpus ?? 0;
    terminalCorpuses.push(terminalCorpus);
    
    if (result.depletionAge === null) {
      successCount++;
    } else {
      depletionAges.push(result.depletionAge);
    }
  }

  // Calculate percentiles
  terminalCorpuses.sort((a, b) => a - b);
  
  const getPercentile = (p: number): number => {
    if (terminalCorpuses.length === 0) return 0;
    const index = Math.max(0, Math.min(terminalCorpuses.length - 1, Math.floor((p / 100) * terminalCorpuses.length)));
    return terminalCorpuses[index] ?? 0;
  };

  return {
    successRate: (successCount / trials) * 100,
    totalTrials: trials,
    medianTerminalCorpus: getPercentile(50),
    percentiles: {
      p5: getPercentile(5),
      p10: getPercentile(10),
      p25: getPercentile(25),
      p50: getPercentile(50),
      p75: getPercentile(75),
      p90: getPercentile(90),
      p95: getPercentile(95),
    },
    depletionYears: depletionAges
  };
}

// Historical Crisis Backtesting
// Data sources approximate the years following these crises. 
export const HISTORICAL_CRISES = {
  '1929_Great_Depression': [-0.08, -0.25, -0.43, -0.08, 0.54, -0.01, 0.47, 0.33, -0.35, 0.31],
  '1973_Oil_Shock': [-0.14, -0.26, 0.37, 0.23, -0.07, 0.06, 0.18, 0.32, -0.04, 0.21],
  '2000_Dot_Com': [-0.09, -0.11, -0.22, 0.28, 0.10, 0.04, 0.15, 0.05, -0.37, 0.26],
  '2008_GFC': [-0.37, 0.26, 0.15, 0.02, 0.16, 0.32, 0.13, 0.01, 0.11, 0.21],
  '2020_COVID': [-0.03, 0.28, 0.28, 0.10] // Shorter sequence
};

export function runHistoricalBacktest(
  inputs: Partial<FireInputs>,
  crisis: keyof typeof HISTORICAL_CRISES
) {
  const currentAge = inputs.currentAge ?? 30;
  const longevityAge = inputs.longevityAge ?? 85;
  const yearsToLive = Math.max(1, longevityAge - currentAge);
  
  const crisisSequence = HISTORICAL_CRISES[crisis];
  const returnsSequence: number[] = new Array(yearsToLive);
  
  const accumulationReturn = (inputs.expectedReturnRate ?? 12) / 100;
  const retirementReturn = (inputs.retirementReturnRate ?? (inputs.expectedReturnRate ?? 12)) / 100;
  const targetAge = inputs.targetAge ?? 50;

  for (let year = 1; year <= yearsToLive; year++) {
    const age = currentAge + year;
    const isAccumulation = age <= targetAge;
    const baseline = isAccumulation ? accumulationReturn : retirementReturn;
    
    // SRR usually matters most immediately post-retirement
    // But how do we align the crisis? We can start it at the target age.
    // Or we apply it immediately if we are already retired, etc.
    // Let's assume the crisis starts exactly at retirement age for SRR testing.
    
    const yearsIntoRetirement = age - targetAge;
    const crisisVal = crisisSequence[yearsIntoRetirement - 1];
    
    if (yearsIntoRetirement > 0 && yearsIntoRetirement <= crisisSequence.length && crisisVal !== undefined) {
      returnsSequence[year - 1] = crisisVal;
    } else {
      returnsSequence[year - 1] = baseline;
    }
  }
  
  return calculateProjection(inputs, returnsSequence);
}
