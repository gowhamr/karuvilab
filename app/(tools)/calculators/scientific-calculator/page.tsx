import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import ScientificCalculatorClient from "./ScientificCalculatorClient";

const toolId = "scientific-calculator";
const category = CATEGORIES.find(c => c.id === "calculators")!;

export const metadata: Metadata = {
  title: "Scientific Calculator — KaruviLab",
  description: "Advanced scientific calculator with trigonometry, logarithms, and more. Fast, private, and precise.",
};

export default function ScientificCalculatorPage() {
  return (
    <ToolShell
      title="Scientific Calculator"
      description="Perform complex mathematical calculations with ease. Support for degrees, radians, and advanced functions."
      category={category}
      toolId={toolId}
    >
      <ScientificCalculatorClient />
    </ToolShell>
  );
}
