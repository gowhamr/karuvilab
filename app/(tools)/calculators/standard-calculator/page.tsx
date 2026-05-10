import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const StandardCalculatorClient = dynamic(() => import("./StandardCalculatorClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("standard-calculator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Standard Calculator"
      description="Full-featured calculator with keyboard support."
      category={cat}
    >
      <StandardCalculatorClient />
    </ToolShell>
  );
}
