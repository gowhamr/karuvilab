import SalaryCalculatorClientWrapper from "./SalaryCalculatorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("salary-calculator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Indian Salary Calculator"
      description="Break down your CTC into take-home pay under the new tax regime (FY 2024-25)."
      category={cat}
    >
      <SalaryCalculatorClientWrapper />
    </ToolShell>
  );
}
