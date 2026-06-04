import PercentageCalculatorClientWrapper from "./PercentageCalculatorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("percentage-calculator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Percentage Calculator"
      description="Three modes: find a percentage, find what percent X is of Y, and calculate percentage change."
      category={cat}
    >
      <PercentageCalculatorClientWrapper />
    </ToolShell>
  );
}
