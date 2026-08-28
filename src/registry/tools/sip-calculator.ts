import { ToolEntry } from '../types';

export const sipCalculator: ToolEntry = {
  id: "sip-calculator",
  name: "SIP Calculator",
  desc: "Project mutual fund and equity SIP returns with step-up compounding, lumpsum deposits, tax deductions, and inflation adjustments",
  href: "/calculators/sip-calculator/",
  category: "calculators",
  subCategory: "Finance & Investment",
  keywords: [
    "sip",
    "sip calculator",
    "step up sip",
    "mutual fund calculator",
    "investment returns",
    "wealth planner",
    "systematic investment plan",
    "inflation adjusted sip",
    "compound growth"
  ],
  difficulty: "beginner",
  searchIntent: "transactional",
  priority: 0.8,
  schemaType: "WebApplication",
  related: [
    "compound-interest",
    "cagr-calculator",
    "swp-calculator",
    "retirement-calculator",
    "emi-calculator"
  ],
  status: "stable",
  lastUpdated: "2026-08-27"
};
