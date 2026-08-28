import { ToolEntry } from '../types';

export const rdCalculator: ToolEntry = {
  id: "rd-calculator",
  name: "Recurring Deposit (RD) Calculator",
  desc: "Calculate RD maturity amount, quarterly compound interest, senior citizen rate boost, and Section 194A TDS deductions",
  href: "/calculators/rd-calculator/",
  category: "calculators",
  subCategory: "Finance & Investment",
  keywords: [
    "rd calculator",
    "recurring deposit calculator",
    "rd interest calculator",
    "rd maturity calculator",
    "post office rd",
    "sbi rd calculator",
    "quarterly compounding rd",
    "senior citizen rd",
    "rd tds calculation"
  ],
  difficulty: "beginner",
  searchIntent: "transactional",
  priority: 0.8,
  schemaType: "WebApplication",
  related: [
    "fd-calculator",
    "sip-calculator",
    "ppf-calculator",
    "compound-interest",
    "interest-calculator"
  ],
  status: "stable",
  lastUpdated: "2026-08-28"
};
