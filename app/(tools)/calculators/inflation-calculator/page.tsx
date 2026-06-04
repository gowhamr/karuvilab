import InflationCalculatorClientWrapper from "./InflationCalculatorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("inflation-calculator");

export default function InflationCalculator() {
  return (
    <ToolShell
      title="Inflation Calculator"
      description="Calculate the effect of inflation on your money's purchasing power over time."
      category={cat}
    >
      <InflationCalculatorClientWrapper />
    </ToolShell>
  );
}
