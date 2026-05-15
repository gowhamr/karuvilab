import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const InflationCalculatorClient = dynamic(() => import("./InflationCalculatorClient"), {
  loading: () => <ToolSkeleton />,
});
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
      <InflationCalculatorClient />
    </ToolShell>
  );
}
