import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "timezone-converter";
const category = CATEGORIES.find(c => c.id === "productivity")!;

const TimeZoneConverterClient = dynamic(() => import("./TimeZoneConverterClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function TimeZoneConverterPage() {
  return (
    <ToolShell
      title="Time Zone Converter"
      description="Compare and convert times across different regions. Perfect for scheduling meetings and remote work."
      category={category}
      toolId={toolId}
    >
      <TimeZoneConverterClient />
    </ToolShell>
  );
}
