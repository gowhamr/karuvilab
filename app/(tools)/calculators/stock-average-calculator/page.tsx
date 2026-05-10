import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const StockAverageCalculatorClient = dynamic(() => import("./StockAverageCalculatorClient"), {
  loading: () => null,
});
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("stock-average-calculator");

export default function StockAverageCalculator() {
  return (
    <ToolShell
      title="Stock Average Calculator"
      description="Calculate the weighted average buy price of your stock holdings."
      category={cat}
    >
      <StockAverageCalculatorClient />
    </ToolShell>
  );
}
