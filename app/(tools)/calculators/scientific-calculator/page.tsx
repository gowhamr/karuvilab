import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import ScientificCalculatorClientWrapper from "./ScientificCalculatorClientWrapper";

const toolId = "scientific-calculator";
const cat = CATEGORIES.find(c => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function ScientificCalculatorPage() {
  return (
    <ToolShell
      title="Scientific Calculator"
      description="Advanced mathematical calculator with trigonometry, logarithms, and complex functions."
      category={cat}
      toolId={toolId}
    >
      <ScientificCalculatorClientWrapper />
    </ToolShell>
  );
}
