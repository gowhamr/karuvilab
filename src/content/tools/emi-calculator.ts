import { ToolContent } from '../../registry/types';

export const emiCalculator: ToolContent = {
  detailedDescription:
    "Calculate the monthly Equated Monthly Installment (EMI) for any loan given the principal amount, annual interest rate, and loan tenure. Also shows a full amortisation schedule breaking down principal and interest per month. All calculations run in the browser.",
  howTo: [
    "Enter the loan principal amount.",
    "Enter the annual interest rate as a percentage.",
    "Enter the loan tenure in months or years.",
    "Click 'Calculate' to see the monthly EMI, total interest paid, and total repayment.",
    "Scroll down to view the month-by-month amortisation table.",
  ],
  faq: [
    {
      question: "What formula is used?",
      answer:
        "EMI = P × r × (1 + r)^n / ((1 + r)^n − 1), where P = principal, r = monthly interest rate (annual rate / 12 / 100), n = tenure in months.",
    },
    {
      question: "Does this account for processing fees or prepayment?",
      answer:
        "The standard EMI formula does not include fees. Add the fee to the principal to approximate the total cost.",
    },
    {
      question: "Can I compare multiple loan options?",
      answer:
        "Run the calculator multiple times with different inputs and compare the results side by side.",
    },
  ],
  useCases: [
    "Estimating monthly payments before applying for a home loan",
    "Comparing EMIs for different loan tenures to find an affordable option",
    "Understanding how much of each payment goes to interest vs. principal",
    "Planning a car loan budget",
  ],
  commonErrors: [
    {
      error: "EMI seems too high",
      fix: "Double-check that the interest rate is entered as an annual percentage (e.g., 8.5), not a monthly rate.",
    },
    {
      error: "Tenure entered in years but EMI is wrong",
      fix: "Ensure you selected the correct unit (years or months) for the tenure field.",
    },
  ],
  alternatives: ["BankBazaar EMI Calculator", "ET Money Calculator", "Excel PMT function"],
};
