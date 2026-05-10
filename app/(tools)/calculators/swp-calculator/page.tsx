import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const SWPCalculatorClient = dynamic(() => import("./SWPCalculatorClient"), {
  loading: () => null,
});
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("swp-calculator");

export default function SWPCalculator() {
  return (
    <ToolShell
      title="SWP Calculator"
      description="Plan your Systematic Withdrawal Plan (SWP) from your mutual fund investments."
      category={cat}
    >
      <SWPCalculatorClient />
    </ToolShell>
  );
}
