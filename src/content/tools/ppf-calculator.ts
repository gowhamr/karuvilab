import { ToolContent } from '../../registry/types';

export const ppfCalculator: ToolContent = {
  detailedDescription: "The Public Provident Fund (PPF) is one of India's most popular long-term tax-saving investments. This calculator helps you estimate the maturity amount after the mandatory 15-year tenure, accounting for annual interest and maximum investment limits. It handles the specific PPF rules like annual compounding and interest calculation on the minimum balance between the 5th and last day of the month.",
  howTo: [
    "Enter your annual investment amount (Max ₹1.5 Lakh).",
    "The current PPF interest rate is usually pre-filled but can be adjusted.",
    "The tenure is fixed at 15 years by default.",
    "View the year-by-year balance and total interest earned."
  ],
  faq: [
    { question: "What is the maximum I can invest in PPF?", answer: "As per current Indian law, you can invest a maximum of ₹1,50,000 per financial year." },
    { question: "Is PPF interest tax-free?", answer: "Yes, PPF follows the EEE (Exempt-Exempt-Exempt) tax status, meaning the investment, interest, and maturity are all tax-exempt." }
  ],
  useCases: [
    "Retirement planning with tax-free returns",
    "Building a low-risk long-term corpus",
    "Optimizing Section 80C tax deductions"
  ],
  alternatives: ["BankBazaar", "ClearTax", "Indmoney"]
};
