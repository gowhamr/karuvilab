import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const RDCalculatorClient = dynamic(() => import("./RDCalculatorClient"), {
  loading: () => <ToolSkeleton />,
});
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("rd-calculator");

export default function RDCalculator() {
  return (
    <ToolShell
      title="RD Calculator"
      description="Calculate maturity amount and interest earned on your Recurring Deposit (RD)."
      category={cat}
    >
      <RDCalculatorClient />
    </ToolShell>
  );
}
