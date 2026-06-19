import { ToolEntry } from '../types';
import { IndianRupee } from 'lucide-react';

export const income_tax: ToolEntry = {
  id: 'income-tax',
  name: 'Income Tax Calculator',
  desc: 'Calculate income tax for FY 2025-26. Compare Old vs New regime and find the best tax-saving strategy.',
  href: 'calculators/income-tax/',
  category: 'calculators',
  keywords: ['income tax', 'tax calculator', 'new regime', 'old regime', 'FY 2025-26', 'salary tax', 'tax india'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.95,
  searchIntent: 'action',
  related: ['hra-calculator', 'tds-calculator', 'salary-calculator'],
  seoContent: {
    detailedDescription: `Income Tax Calculator is a comprehensive, privacy-first tool tailored for the Indian tax system (FY 2025-26). It automatically compares the Old Tax Regime with the New Tax Regime, applying the latest standard deductions and rebates (e.g., u/s 87A) to recommend the most beneficial option for your salary structure.`,
    howTo: [
      'Enter your annual Gross Salary.',
      'Select your Age Group and Employee Type (Salaried/Self-Employed).',
      'If you have investments, switch to the Old Regime tab and enter your 80C, 80D, HRA, and Home Loan interest.',
      'The calculator will instantly display your total tax liability, effective tax rate, and monthly in-hand salary.',
      'Use the Comparison Mode to see exactly how much you save by choosing one regime over the other.'
    ],
    faq: [
      { question: 'What is the New Tax Regime for FY 2025-26?', answer: 'The New Tax Regime offers lower tax rates but removes most exemptions and deductions (like 80C, 80D, HRA). However, a standard deduction of ₹75,000 is now applicable.' },
      { question: 'What is the rebate under section 87A?', answer: 'For FY 2025-26, under the New Regime, you get a rebate up to ₹25,000, making income up to ₹7,00,000 tax-free. Under the Old Regime, the rebate is ₹12,500, making income up to ₹5,00,000 tax-free.' },
      { question: 'Is Standard Deduction available in both regimes?', answer: 'Yes, for salaried individuals, a standard deduction of ₹50,000 is available in the Old Regime, and it has been increased to ₹75,000 in the New Regime (FY 2025-26).' },
      { question: 'Which regime should I choose?', answer: 'It depends on your deductions. If you have significant investments (80C, 80D), home loan interest, and HRA, the Old Regime might be better. Otherwise, the New Regime is simpler and often beneficial.' },
      { question: 'Is my financial data secure?', answer: 'Absolutely. All tax calculations happen 100% locally in your browser. Your salary and investment details are never stored or sent to any server.' }
    ]
  }
};
