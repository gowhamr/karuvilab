export interface FinancialInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  expectedAnnualReturn: number; // in percentage
  safeWithdrawalRate: number; // in percentage
  inflationRate: number; // in percentage
  annualIncomeGrowth: number; // in percentage
  oneTimeWindfalls: string; // comma-separated
  postRetirementReturn: number; // in percentage
  withdrawalStrategy: 'Constant (4% rule)' | 'Dynamic (guardrails)' | 'Fixed Dollar';
}

export interface ProjectionData {
  age: number;
  year: number;
  netWorth: number;
  contributions: number;
  interest: number;
  withdrawal: number;
  targetCorpus: number; // Target corpus adjusted for inflation
}

export interface FinancialResults {
  requiredCorpus: number;
  yearsToFI: number;
  monthlySavingsNeeded: number; // Required savings to hit target by retirement age
  monthlySavingsShortfall: number; // Diff between actual savings capability and required
  actualMonthlySavings: number; // monthlyIncome - monthlyExpenses
  projectedRetirementCorpus: number; // The actual corpus that will be accumulated
  isAchievable: boolean;
  projections: ProjectionData[];
}

export interface Scenario {
  id: string;
  name: string;
  inputs: FinancialInputs;
  results: FinancialResults;
  dateSaved: string;
}
