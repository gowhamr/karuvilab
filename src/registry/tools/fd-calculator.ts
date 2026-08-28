import { ToolEntry } from '../types';

export const fdCalculator: ToolEntry = {
  id: "fd-calculator",
  name: "Fixed Deposit (FD) Calculator",
  desc: "Calculate FD maturity value, interest payouts, senior citizen rates, APY, TDS deductions, and amortization schedule",
  href: "/calculators/fd-calculator/",
  category: "calculators",
  subCategory: "Finance & Investment",
  keywords: [
    "fd calculator",
    "fixed deposit calculator",
    "fd interest calculator",
    "fd maturity calculator",
    "senior citizen fd",
    "cumulative fd",
    "non-cumulative fd",
    "fd interest rate",
    "tds on fd",
    "effective annual yield",
    "apy calculator"
  ],
  difficulty: "beginner",
  searchIntent: "transactional",
  priority: 0.8,
  schemaType: "WebApplication",
  related: [
    "compound-interest",
    "rd-calculator",
    "ppf-calculator",
    "interest-calculator",
    "sip-calculator",
    "emi-calculator"
  ],
  status: "stable",
  lastUpdated: "2026-08-28"
};
