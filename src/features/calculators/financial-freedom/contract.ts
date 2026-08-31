import { ToolContract } from '@/src/webmcp/types';
import { calculateFire } from './fire-utils';
import { FireInputs, FireVariant } from './models/assumptions';
import { FireResults } from './models/projection-types';

export const financialFreedomContract: ToolContract<Partial<FireInputs>, FireResults> = {
  name: 'calculate_financial_freedom',
  description: 'Calculates Financial Independence Retire Early (FIRE) projections, including corpus required, accumulation path, withdrawal schedules, and simulated events over a timeline.',
  schema: {
    type: 'object',
    properties: {
      currentAge: { type: 'number', description: 'Current chronological age' },
      targetAge: { type: 'number', description: 'Target age for retirement/FIRE' },
      currentIncome: { type: 'number', description: 'Current monthly income' },
      currentExpenses: { type: 'number', description: 'Current monthly living expenses' },
      currentCorpus: { type: 'number', description: 'Total currently accumulated savings' },
      monthlySip: { type: 'number', description: 'Monthly investment amount' },
      expectedReturnRate: { type: 'number', description: 'Annual return rate during accumulation (%)' },
      expectedInflationRate: { type: 'number', description: 'Annual inflation rate (%)' },
      withdrawalRate: { type: 'number', description: 'Safe withdrawal rate (%)' },
      fireVariant: { 
        type: 'string', 
        enum: ['regular', 'lean', 'fat', 'coast', 'barista'],
        description: 'Selected FIRE strategy'
      }
    },
    required: [
      'currentAge',
      'targetAge',
      'currentIncome',
      'currentExpenses',
      'currentCorpus',
      'monthlySip',
      'expectedReturnRate',
      'expectedInflationRate',
      'withdrawalRate'
    ]
  },
  execute: (input) => {
    return calculateFire(input);
  }
};
