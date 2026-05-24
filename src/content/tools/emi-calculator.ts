import { ToolContent } from '../../registry/types';

export const emiCalculator: ToolContent = {
  detailedDescription: `
    <p>The EMI (Equated Monthly Installment) Calculator is a precise financial tool designed to help you plan your loans, whether it is for a home, car, education, or personal use. By providing clarity on your monthly financial obligations, this calculator empowers you to make informed borrowing decisions without the stress of manual calculations.</p>
    
    <p>In today’s economic landscape, understanding how interest rates, loan tenure, and principal amounts interact is crucial. Our browser-based tool allows you to input these variables instantly, providing a clear breakdown of your monthly EMI, the total interest payable over the life of the loan, and the overall repayment amount. Because KaruviLab operates on a local-first principle, you can perform these sensitive financial simulations with total privacy, knowing your data never leaves your browser.</p>

    <p>Beyond the simple EMI amount, our calculator generates a comprehensive amortisation schedule. This table breaks down exactly how much of your monthly payment is allocated to principal repayment versus interest accrual. This insight is particularly valuable for long-term loans like mortgages, where understanding the balance between principal and interest can help you decide whether to make prepayments to reduce your total debt burden earlier.</p>
  `,
  howTo: [
    "<strong>Enter Loan Principal:</strong> Input the total amount you intend to borrow in the 'Principal' field.",
    "<strong>Specify Interest Rate:</strong> Enter the annual interest rate (e.g., 8.5 for 8.5%) provided by your lender.",
    "<strong>Set Loan Tenure:</strong> Input the time period for the loan. You can switch between years or months depending on your loan structure.",
    "<strong>Calculate Results:</strong> Click 'Calculate'. The system will immediately display your monthly EMI, total interest, and final repayment amount.",
    "<strong>Review Amortisation:</strong> Scroll to the table section to view the month-by-month reduction of your principal balance.",
  ],
  faq: [
    {
      question: "How is the EMI calculated?",
      answer: "We use the standard banking formula: EMI = [P x r x (1+r)^n] / [(1+r)^n - 1], where P is the principal amount, r is the monthly interest rate (annual rate divided by 12 and then by 100), and n is the loan tenure in months.",
    },
    {
      question: "Is this calculator accurate for all banks?",
      answer: "Most banks use the standard formula above. However, some lenders may calculate interest daily instead of monthly. While our calculator is highly accurate for general planning, please verify exact terms with your lender's official loan portal.",
    },
    {
      question: "Does this tool store my financial data?",
      answer: "Absolutely not. KaruviLab operates on a zero-upload, local-first architecture. All calculations are performed within your browser's memory, and no information is sent to our servers.",
    },
    {
      question: "Can I use this for variable interest rate loans?",
      answer: "EMI calculators are generally designed for fixed-rate loans. If your interest rate is variable, use this tool to estimate your current payments, but remember that market fluctuations may change your EMI later.",
    },
    {
      question: "Should I include insurance or maintenance in the EMI?",
      answer: "This tool calculates loan repayment only. It does not account for additional costs like property insurance, maintenance fees, or loan processing charges, which should be calculated separately.",
    },
  ],
  useCases: [
    "Comparing monthly payments for home loan offers from different banks.",
    "Determining if a car loan fits into your current monthly budget.",
    "Strategizing how prepayments can shorten the loan tenure.",
    "Calculating total interest paid over 15 or 20 years to understand the 'true cost' of borrowing.",
  ],
  examples: [
    {
      input: "Principal: 5,000,000 | Rate: 8.5% | Tenure: 20 Years",
      output: "EMI: 43,391 | Total Interest: 5,413,912 | Total Repayment: 10,413,912",
      description: "A standard home loan calculation showing how total interest can often exceed the principal over long tenures."
    },
    {
      input: "Principal: 800,000 | Rate: 10% | Tenure: 5 Years",
      output: "EMI: 16,998 | Total Interest: 219,890 | Total Repayment: 1,019,890",
      description: "A short-term car or personal loan scenario demonstrating significantly lower total interest impact."
    }
  ],
  commonErrors: [
    {
      error: "EMI appears unexpectedly high",
      fix: "Check if you entered the annual interest rate as a whole number (e.g., 9) rather than a decimal representation (0.09). Our tool expects the whole percentage value.",
    },
    {
      error: "Result differs from the bank's quote",
      fix: "Check for 'hidden' charges. Lenders often add processing fees or insurance into the initial loan amount. Try adding these extra costs to your principal amount for a more accurate estimate.",
    },
  ],
  alternatives: ["BankBazaar EMI Calculator", "ET Money EMI Calculator", "Standard Excel PMT Function"],
};
