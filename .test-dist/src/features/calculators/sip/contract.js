import { calculateDeterministicSip } from './engine';
export const sipContract = {
    name: 'calculate_sip',
    description: 'Calculates the future value of a Systematic Investment Plan (SIP) with options for step-up (annual increase), lumpsum addition, inflation adjustment, and taxation.',
    schema: {
        type: 'object',
        properties: {
            monthlyInvestment: { type: 'number', description: 'The monthly SIP amount.' },
            expectedAnnualReturn: { type: 'number', description: 'Expected annual return percentage (e.g. 12 for 12%).' },
            timeHorizonYears: { type: 'number', description: 'Investment duration in years.' },
            annualStepUpPercent: { type: 'number', description: 'Optional. Annual percentage increase in SIP amount.' },
            lumpsumAmount: { type: 'number', description: 'Optional. Initial lumpsum investment amount.' },
            annualInflationRate: { type: 'number', description: 'Optional. Expected inflation rate for calculating real future value.' },
            capitalGainsTaxRate: { type: 'number', description: 'Optional. Tax rate applied on total gains (e.g. 12.5 for LTCG).' },
            expenseRatio: { type: 'number', description: 'Optional. Expense ratio deducted from expected return.' }
        },
        required: ['monthlyInvestment', 'expectedAnnualReturn', 'timeHorizonYears']
    },
    execute: (input) => {
        return calculateDeterministicSip(input);
    }
};
