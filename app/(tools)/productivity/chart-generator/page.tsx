import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import ChartGeneratorClient from "./ChartGeneratorClient";

const toolId = "chart-generator";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = {
  title: "Chart & Graph Generator — KaruviLab",
  description: "Create professional bar charts, pie charts, and more instantly. Secure, private, and 100% client-side.",
};

export default function ChartGeneratorPage() {
  return (
    <ToolShell
      title="Chart & Graph Generator"
      description="Turn your data into beautiful visualizations. Perfect for reports, presentations, and quick insights."
      category={category}
      toolId={toolId}
    >
      <ChartGeneratorClient />
    </ToolShell>
  );
}
