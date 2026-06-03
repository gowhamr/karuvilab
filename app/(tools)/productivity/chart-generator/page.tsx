import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "chart-generator";
const category = CATEGORIES.find(c => c.id === "productivity")!;

const ChartGeneratorClient = dynamic(() => import("./ChartGeneratorClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

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
