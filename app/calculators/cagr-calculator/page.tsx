import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import CAGRCalculatorClient from "./CAGRCalculatorClient";
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("cagr-calculator");

export default function CAGRCalculator() {
  return (
    <ToolShell
      title="CAGR Calculator"
      description="Calculate Compound Annual Growth Rate (CAGR) for your investments."
      category={cat}
    >
      <CAGRCalculatorClient />
    </ToolShell>
  );
}
