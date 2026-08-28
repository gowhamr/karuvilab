import { ToolContent } from '../../registry/types';

export const emiCalculator: ToolContent = {
  detailedDescription: `
<p>The KaruviLab EMI Loan Calculator is an offline-first, mathematical loan simulation engine designed to model equated monthly installments, reducing balance amortization schedules, prepayment savings, moratorium periods, and floating interest rate stress tests. Executing 100% locally in your browser with zero network latency, zero tracking, and zero server round-trips, it gives borrowers total visibility into bank loan economics.</p>

<p>When taking a home loan, car loan, or personal loan, banks offer a flat, equated monthly payment (EMI). However, the internal distribution of that installment changes drastically over time due to <strong>reducing balance amortization</strong>:</p>
<ul>
  <li><strong>The Amortization Formula:</strong> $E = P \\cdot r \\cdot \\frac{(1 + r)^n}{(1 + r)^n - 1}$, where $P$ is principal, $r$ is monthly interest rate (annual rate / 12 / 100), and $n$ is the total tenure in months.</li>
  <li><strong>Front-Loaded Interest:</strong> In the early years of a long-term mortgage, over 70% to 80% of every monthly payment goes exclusively toward servicing interest, while only a small fraction pays down the principal debt.</li>
  <li><strong>The Tenure Trap:</strong> Extending a loan tenure from 15 years to 30 years slightly lowers the monthly EMI payment but dramatically doubles or triples the total interest paid to the lender over the loan lifespan.</li>
  <li><strong>Prepayment Acceleration:</strong> Making recurring or lump-sum principal prepayments in early years directly attacks the interest-compounding principal balance, saving lakhs in interest and cutting years off your debt burden.</li>
  <li><strong>Floating Rate Stress Testing:</strong> Simulating benchmark rate hikes (+0.5% to +2.5%) helps assess future repayment resilience before committing to a mortgage.</li>
</ul>

<p>All calculations run locally in your browser memory. Your loan amounts, salaries, and financial scenarios remain completely private on your device.</p>
`,
  howTo: [
    "<strong>Enter Loan Details:</strong> Specify the Principal Loan Amount (₹), Annual Interest Rate (%), and Loan Tenure in Years or Months.",
    "<strong>Simulate Prepayments (Optional):</strong> Add lump-sum prepayments or recurring monthly extra payments to view interest and tenure savings.",
    "<strong>Stress Test Floating Rates:</strong> Toggle floating rate adjustments to observe how rate hikes impact your monthly EMI and total interest.",
    "<strong>Analyze Amortization Schedule:</strong> Review the month-by-month and year-by-year principal vs interest payoff trajectories.",
  ],
  faq: [
    {
      question: "How is Equated Monthly Installment (EMI) calculated?",
      answer: "EMI is calculated using the reducing balance formula: E = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is principal loan amount, r is periodic monthly interest rate (Annual Rate / 1200), and n is the tenure in months.",
    },
    {
      question: "Why is the total interest so high on a 20 or 30-year loan?",
      answer: "Because interest is calculated each month on the outstanding principal balance. Over long time horizons, the compounding effect means total interest paid often exceeds the original borrowed principal.",
    },
    {
      question: "How does making extra prepayments save money?",
      answer: "Prepayments are deducted directly from the outstanding principal balance. Reducing the principal early stops that portion from compounding interest for the entire remaining tenure, accelerating debt freedom.",
    },
    {
      question: "What is the difference between Fixed and Floating interest rates?",
      answer: "A fixed interest rate remains unchanged throughout the loan duration. A floating interest rate fluctuates in tandem with the central bank's benchmark repo rate, meaning your EMI or tenure may increase when rates rise.",
    },
    {
      question: "Does KaruviLab store my loan numbers or credit profile?",
      answer: "No. KaruviLab operates with a strict offline-first architecture. All calculations and amortization tables are computed entirely in your local browser memory.",
    },
  ],
  useCases: [
    "Comparing home loan offers across different banks and interest rates.",
    "Calculating car loan and bike loan monthly installments before visiting dealerships.",
    "Planning prepayments to become mortgage-free 5 to 10 years earlier.",
    "Evaluating personal loan and education loan repayment timelines.",
  ],
  examples: [
    {
      input: "Loan: ₹50,00,000 | Rate: 8.5% | Tenure: 20 Years (240 Months)",
      output: "Monthly EMI: ₹43,391 | Total Interest: ₹54,13,879 | Total Payment: ₹1,04,13,879",
      description: "Standard 20-year home loan reducing balance calculation."
    },
    {
      input: "Loan: ₹50,00,000 | Rate: 8.5% | Tenure: 20 Years | Recurring Prepayment: ₹5,000/month",
      output: "Tenure reduced by ~4 years | Total Interest saved: ₹12,00,000+",
      description: "Prepayment acceleration strategy."
    },
    {
      input: "Loan: ₹10,00,000 | Rate: 10.5% | Tenure: 5 Years (60 Months)",
      output: "Monthly EMI: ₹21,494 | Total Interest: ₹2,89,634",
      description: "Standard auto / personal loan installment."
    }
  ],
  commonErrors: [
    {
      error: "Flat Rate vs Reducing Balance Confusion",
      fix: "Ensure your lender quotes a reducing balance rate. A 10% flat rate is equivalent to approximately 18% reducing balance APR.",
    },
    {
      error: "Focusing Solely on Low Monthly EMI",
      fix: "Extending tenure lowers monthly EMI but significantly increases the total interest paid over the life of the loan.",
    },
  ],
  alternatives: ["BankBazaar EMI Calculator", "HDFC Loan Calculator", "SBI Home Loan Portal"],
};
