import { ToolEntry } from '../types';
import { Award } from 'lucide-react';

export const gratuity_calculator: ToolEntry = {
  id: 'gratuity-calculator',
  name: 'Gratuity Calculator',
  desc: 'Calculate Gratuity amount for employees covered and not covered under the Payment of Gratuity Act 1972.',
  href: 'calculators/gratuity-calculator/',
  category: 'calculators',
  keywords: ['gratuity calculator', 'gratuity act 1972', 'severance', 'employee benefits', 'retirement'],
  status: 'new',
  popular: false,
  difficulty: 'beginner',
  priority: 0.7,
  searchIntent: 'action',
  related: ['salary-calculator', 'income-tax', 'nps-calculator'],
  seoContent: {
    detailedDescription: `The Gratuity Calculator is a secure, browser-native tool that estimates the gratuity amount payable to an employee upon resignation, retirement, or superannuation in India. It supports calculations for employees both covered and not covered by the Payment of Gratuity Act 1972, factoring in the ₹20 Lakh tax exemption limit.`,
    howTo: [
      'Enter your Last Drawn Salary (Basic + Dearness Allowance only).',
      'Input your total tenure (Years and additional Months).',
      'Select whether your employer is covered under the Payment of Gratuity Act.',
      'The tool will instantly show your total gratuity, the tax-exempt portion, and any taxable amount.'
    ],
    faq: [
      { question: 'Who is eligible for Gratuity?', answer: 'An employee who has rendered continuous service of at least 5 years (in reality, 4 years and 240 days) with the same employer is eligible for gratuity.' },
      { question: 'What is the formula for employees covered under the Act?', answer: 'Gratuity = (Last Drawn Salary × 15 × Tenure in Years) / 26.' },
      { question: 'How is tenure rounded for covered employees?', answer: 'If you have worked for more than 6 months in your final year, it is rounded up to the next full year. (e.g., 5 years 7 months = 6 years).' },
      { question: 'What is the formula for employees NOT covered under the Act?', answer: 'Gratuity = (Average Salary of last 10 months × 15 × Tenure in Years) / 30. Note: Tenure is not rounded up; only fully completed years are counted.' },
      { question: 'Is Gratuity taxable?', answer: 'Gratuity received up to ₹20,00,000 is tax-exempt for non-government employees. Any amount exceeding this limit is fully taxable as per your income tax slab.' }
    ]
  }
};
