import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import FinancialFreedomCalculatorClient from "@/src/features/financial-freedom-calculator/FinancialFreedomCalculatorClient";
import { financialFreedomCalculator } from "@/src/content/tools/financial-freedom-calculator";

const toolId = "financial-freedom-calculator";
const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function FinancialFreedomCalculator() {
  return (
    <ToolShell
      title="Financial Freedom Calculator"
      description="Calculate your path to FIRE and plan your retirement. Project your net worth, determine your required corpus, and find out exactly when you can safely retire."
      category={cat}
      toolId={toolId}
      content={financialFreedomCalculator}
    >
      <FinancialFreedomCalculatorClient />
    </ToolShell>
  );
}
