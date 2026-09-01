import { calculateSalary } from './engine';
export const salaryContract = {
    name: 'calculate_salary_tax',
    description: 'Calculates Indian Income Tax (Old vs New Regime) and provides a detailed breakdown of CTC, deductions, and net take-home salary.',
    schema: {
        type: 'object',
        properties: {
            ctc: { type: 'number', description: 'Cost to Company (Annual Gross Salary).' },
            basicPercent: { type: 'number', description: 'Basic pay as a percentage of CTC (typically 40 or 50).' },
            hraPercent: { type: 'number', description: 'HRA as a percentage of Basic Pay (typically 40 or 50).' },
            lta: { type: 'number', description: 'Leave Travel Allowance (Annual).' },
            specialAllowance: { type: 'number', description: 'Special allowance (calculated automatically if 0, but can be overridden).' },
            bonus: { type: 'number', description: 'Annual bonus.' },
            pfPercent: { type: 'number', description: 'Employee PF contribution percentage of Basic (typically 12).' },
            employerPfPercent: { type: 'number', description: 'Employer PF contribution percentage of Basic (typically 12).' },
            professionalTax: { type: 'number', description: 'Annual Professional Tax (e.g. 2400 for most states).' },
            cityType: { type: 'string', enum: ['metro', 'non-metro'], description: 'City type for HRA calculation.' },
            actualRentPaid: { type: 'number', description: 'Actual annual rent paid for HRA exemption in Old Regime.' },
            deduction80C: { type: 'number', description: 'Section 80C deductions (max 1,50,000) for Old Regime.' },
            deduction80D: { type: 'number', description: 'Section 80D (Health Insurance) deductions for Old Regime.' },
            deduction80G: { type: 'number', description: 'Section 80G (Charity) deductions for Old Regime.' },
            otherDeductions: { type: 'number', description: 'Any other deductions (e.g. Home loan interest Sec 24b) for Old Regime.' }
        },
        required: ['ctc', 'basicPercent', 'hraPercent', 'pfPercent', 'employerPfPercent', 'professionalTax', 'cityType']
    },
    execute: (input) => {
        return calculateSalary(input);
    }
};
