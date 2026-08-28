import { ToolEntry } from '../types';

export const salaryCalculator: ToolEntry = {
  id: 'salary-calculator',
  name: 'Salary & Take-Home Pay Calculator',
  desc: 'Calculate Indian take-home monthly salary, gross vs net CTC breakdown, EPF, professional tax, and income tax under Old vs New Regime',
  href: '/calculators/salary-calculator/',
  category: 'calculators',
  subCategory: 'Finance & Payroll',
  keywords: [
    'salary calculator',
    'take home salary calculator',
    'in hand salary calculator',
    'ctc to in hand calculator',
    'ctc calculator',
    'salary breakdown india',
    'income tax salary calculator',
    'epf deduction calculator',
    'new tax regime salary',
    'old tax regime salary',
    'gross to net salary'
  ],
  difficulty: 'beginner',
  searchIntent: 'transactional',
  priority: 0.85,
  schemaType: 'WebApplication',
  related: [
    'income-tax',
    'hra-calculator',
    'gratuity-calculator',
    'tds-calculator',
    'financial-freedom-calculator'
  ],
  status: 'stable',
  lastUpdated: '2026-08-27'
};
