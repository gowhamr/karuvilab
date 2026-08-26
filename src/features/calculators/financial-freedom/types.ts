export interface FireInputs {
  currentAge: number;
  targetAge: number;
  currentIncome: number;
  currentExpenses: number;
  currentCorpus: number;          // Current Savings/Investments combined
  monthlySip: number;             // Current Monthly Investment
  expectedReturnRate: number;     // e.g., 12%
  expectedInflationRate: number;  // e.g., 6%
  incomeGrowthRate: number;       // e.g., 10%
  expenseGrowthRate: number;      // e.g., 8%
  withdrawalRate: number;         // Defaults to 4%
}

export interface YearlyProjection {
  age: number;
  year: number;
  annualIncome: number;
  annualExpenses: number;
  startCorpus: number;
  totalInvested: number;
  interestEarned: number;
  endCorpus: number;
  isFinanciallyFree: boolean;
}

export interface FireResults {
  targetCorpus: number;                 // The magic FIRE number at target age
  targetMonthlyExpense: number;         // Monthly expense at target age
  projectedCorpus: number;              // What they will actually have at target age
  shortfallOrSurplus: number;
  requiredMonthlySip: number;           // Adjusted SIP needed today to hit target
  estimatedFreedomAge: number;          // The age they actually cross the corpus
  yearsToFreedom: number;
  projections: YearlyProjection[];      // Array for charts and tables
}
