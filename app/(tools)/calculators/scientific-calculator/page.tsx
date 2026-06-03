import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const toolId = "scientific-calculator";
const cat = CATEGORIES.find(c => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata(toolId);

const ScientificCalculatorClient = dynamic(() => import("./ScientificCalculatorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function ScientificCalculatorPage() {
  return (
    <ToolShell
      title="Scientific Calculator"
      description="Advanced mathematical calculator with trigonometry, logarithms, and complex functions."
      category={cat}
      toolId={toolId}
    >
      <ScientificCalculatorClient />
    </ToolShell>
  );
}
