import { ToolEntry } from '../types';

export const calculator: ToolEntry = {
  id: "calculator",
  name: "Calculator",
  desc: "Unified calculator with seamless standard and scientific modes",
  href: "/calculators/calculator/",
  category: "calculators",
  icon: null,
  color: null,
  featured: true,
  popular: true,
  status: "stable",
  lastAdded: null,
  keywords: [
    "calculator",
    "math",
    "scientific",
    "standard",
    "trigonometry"
  ],
  input: null,
  output: null,
  related: ["unit-converter", "percentage-calculator"],
  subCategory: "Math",
  requiresNetwork: false
};
