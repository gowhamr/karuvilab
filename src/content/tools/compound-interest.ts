import { ToolContent } from '../../registry/types';

export const compoundInterest: ToolContent = {
  detailedDescription:
    "Calculate the future value of an investment using the compound interest formula. Supports different compounding frequencies (daily, monthly, quarterly, annually) and an optional regular contribution. Shows a year-by-year growth chart and breakdown. All calculations run locally.",
  howTo: [
    "Enter the principal (initial investment).",
    "Enter the annual interest rate.",
    "Enter the investment period in years.",
    "Choose compounding frequency.",
    "Optionally add a monthly contribution and click 'Calculate'.",
  ],
  faq: [
    {
      question: "What is the formula used?",
      answer:
        "A = P × (1 + r/n)^(n×t), where P = principal, r = annual rate, n = compounding periods per year, t = years.",
    },
    {
      question: "What compounding frequency is best?",
      answer:
        "More frequent compounding yields slightly higher returns. Daily compounding gives marginally more than annual, but the difference diminishes with lower rates.",
    },
    {
      question: "How does a regular contribution affect the result?",
      answer:
        "Regular contributions are compounded from the time they are added, significantly boosting long-term growth — this is the core principle behind SIP investing.",
    },
  ],
  useCases: [
    "Projecting the growth of a fixed deposit or savings account",
    "Comparing compounding frequencies when evaluating financial products",
    "Understanding how reinvesting dividends compounds returns",
    "Setting a savings goal and working backwards to find the required principal",
  ],
  commonErrors: [
    {
      error: "Result doesn't match the bank's stated maturity amount",
      fix: "Banks may use slightly different compounding conventions or charge fees. Use the bank's own calculator for precise figures.",
    },
    {
      error: "Entered rate as a decimal instead of percentage",
      fix: "Enter 8 for 8%, not 0.08. The tool expects a percentage value.",
    },
  ],
  alternatives: ["Investor.gov Compound Interest Calculator", "Excel FV function", "MoneyChimp"],
};
