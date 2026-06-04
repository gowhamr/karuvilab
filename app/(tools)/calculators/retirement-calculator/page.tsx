import RetirementCalculatorClientWrapper from "./RetirementCalculatorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("retirement-calculator");

export default function RetirementCalculator() {
  return (
    <ToolShell
      title="Retirement Planner"
      description="Estimate the corpus required to maintain your lifestyle after retirement."
      category={cat}
    >
      <RetirementCalculatorClientWrapper />
    </ToolShell>
  );
}
