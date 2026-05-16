import { ToolContent } from '../../registry/types';

export const sipCalculator: ToolContent = {
  detailedDescription:
    "Calculate the future value of a Systematic Investment Plan (SIP) with optional annual step-up (increasing the monthly investment by a fixed percentage each year). Shows total invested, estimated returns, and final corpus. Uses standard compound interest formulas — all calculated locally.",
  howTo: [
    "Enter your monthly SIP amount.",
    "Enter the expected annual return rate (e.g., 12 for 12%).",
    "Enter the investment duration in years.",
    "Optionally enable step-up SIP and enter the annual increase percentage.",
    "Click 'Calculate' to see the projected wealth breakdown.",
  ],
  faq: [
    {
      question: "Is the return guaranteed?",
      answer:
        "No. The tool uses a fixed assumed return rate for illustration. Actual mutual fund returns vary and are not guaranteed.",
    },
    {
      question: "What is a step-up SIP?",
      answer:
        "A step-up SIP increases your monthly investment amount by a fixed percentage each year, helping you invest more as your income grows.",
    },
    {
      question: "Does the calculator account for inflation?",
      answer:
        "Not by default. To estimate real returns, subtract the expected inflation rate from your expected return rate.",
    },
    {
      question: "What return rate should I use?",
      answer:
        "Historical Indian equity mutual fund returns have averaged 10–15% annually over long periods. Use 10–12% for a conservative projection.",
    },
  ],
  useCases: [
    "Planning retirement savings with monthly mutual fund investments",
    "Comparing SIP returns at different investment horizons",
    "Understanding the power of compounding over 20+ years",
    "Setting a monthly savings goal to reach a target corpus",
  ],
  commonErrors: [
    {
      error: "Projected corpus seems unrealistically high",
      fix: "Verify the return rate entered. 20%+ is aggressive; use 10–12% for realistic long-term projections.",
    },
    {
      error: "Step-up SIP total differs from manual calculations",
      fix: "Step-up calculations are compounded annually. Each year's monthly amount is increased by the step-up %, which compounds the effect.",
    },
  ],
  alternatives: ["Groww SIP Calculator", "ET Money SIP Calculator", "Zerodha Varsity"],
};
