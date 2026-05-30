import { ToolContent } from '../../registry/types';

export const emiCalculator: ToolContent = {
  detailedDescription: `
    <p>The EMI (Equated Monthly Installment) Calculator is a robust financial tool designed for precision and transparency in loan planning. Whether you are considering a home loan for your dream house, a car loan for your next vehicle, or a personal loan for unexpected expenses, this calculator provides the clarity needed to manage your finances effectively. Understanding your monthly repayment obligations is the first step toward responsible borrowing. By entering your loan amount, interest rate, and tenure, you can instantly see how much you will owe each month, allowing you to compare different loan offers and choose the one that best fits your budget.</p>

    <p>In today's complex financial world, small changes in interest rates or loan duration can significantly impact your total repayment. Our calculator goes beyond simple math by providing a detailed amortization schedule, showing how each payment is split between principal and interest over time. This helps you visualize the debt reduction process and evaluate the benefits of prepayments. Built with a local-first philosophy, all calculations happen entirely within your browser, ensuring your sensitive financial data remains private and secure. It is an essential companion for home buyers, students, and financial planners who demand accuracy without compromising privacy. Use it to simulate various scenarios and gain total control over your financial future.</p>
  `,
  howTo: [
    "Enter the total amount you wish to borrow in the 'Loan Principal' field.",
    "Input the annual interest rate offered by your lender (e.g., 8.5).",
    "Specify the loan duration in years or months to set the repayment period.",
    "Review the instantly updated EMI, total interest payable, and total amount.",
    "Explore the amortization schedule to see your balance reduce over time.",
  ],
  faq: [
    {
      question: "Is this EMI calculator free to use?",
      answer: "Yes, our EMI calculator is completely free and requires no subscription or registration.",
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes, once the page is loaded, the calculator works entirely in your browser without needing an internet connection.",
    },
    {
      question: "Is my financial data uploaded to any server?",
      answer: "No. KaruviLab follows a zero-upload policy. All calculations are performed locally on your device for maximum privacy.",
    },
    {
      question: "What types of loans can I calculate with this tool?",
      answer: "You can use it for any loan with fixed monthly installments, including home, car, personal, and education loans.",
    },
    {
      question: "Are there any limitations to these calculations?",
      answer: "This tool assumes a fixed interest rate and does not account for processing fees, insurance, or taxes that your lender might charge.",
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
      input: "Principal: $100,000 | Rate: 7% | Tenure: 15 Years",
      output: "EMI: $898.83 | Total Interest: $61,789 | Total Pay: $161,789",
      description: "A typical 15-year mortgage scenario showing significant interest over time.",
    },
    {
      input: "Principal: $25,000 | Rate: 5% | Tenure: 5 Years",
      output: "EMI: $471.78 | Total Interest: $3,307 | Total Pay: $28,307",
      description: "A standard auto loan example with a shorter tenure and lower interest impact.",
    },
    {
      input: "Principal: $10,000 | Rate: 12% | Tenure: 3 Years",
      output: "EMI: $332.14 | Total Interest: $1,957 | Total Pay: $11,957",
      description: "A personal loan scenario illustrating higher interest rates but manageable total cost.",
    },
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
