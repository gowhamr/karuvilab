import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { generateToolMetadata } from "@/src/lib/seo";
import { financialFreedomCalculator } from "@/src/content/tools/financial-freedom-calculator";

const FinancialFreedomCalculatorClient = dynamic(
  () => import("@/src/features/financial-freedom-calculator/FinancialFreedomCalculatorClient"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

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
