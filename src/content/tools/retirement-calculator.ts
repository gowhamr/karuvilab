import { ToolContent } from '../../registry/types';

export const retirementCalculator: ToolContent = {
  detailedDescription: "Planning for retirement requires accounting for current expenses, inflation, and life expectancy. This comprehensive tool estimates the 'Retirement Corpus' you need to maintain your lifestyle after you stop working. It factors in your current age, retirement age, expected inflation, and post-retirement return rates.",
  howTo: [
    "Enter your current age and planned retirement age.",
    "Enter your current monthly expenses.",
    "Set the expected inflation rate (usually 6-7% in India).",
    "Enter the expected return on your retirement corpus.",
    "The tool calculates the total corpus required and the monthly savings needed to reach it."
  ],
  faq: [
    { question: "Why is inflation important in retirement planning?", answer: "Inflation reduces your purchasing power. ₹50,000 today might buy what ₹2 Lakh buys in 25 years." },
    { question: "What is the 'Safe Withdrawal Rate'?", answer: "It is the percentage of your corpus you can withdraw annually without running out of money, usually estimated at 3-4%." }
  ],
  useCases: [
    "Early retirement planning (FIRE movement)",
    "Determining if your current savings are on track",
    "Visualizing the impact of inflation on future expenses"
  ],
  alternatives: ["Vanguard Retirement Nest Egg", "Fidelity"]
};
