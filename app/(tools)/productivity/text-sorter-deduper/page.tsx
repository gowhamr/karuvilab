import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "text-sorter-deduper";
const category = CATEGORIES.find(c => c.id === "productivity")!;

const TextSorterDeduperClient = dynamic(() => import("./TextSorterDeduperClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function TextSorterDeduperPage() {
  return (
    <ToolShell
      title="Text Sorter & Deduplicator"
      description="Clean up your lists and data. Sort alphabetically, by length, or remove redundant entries with one click."
      category={category}
      toolId={toolId}
    >
      <TextSorterDeduperClient />
    </ToolShell>
  );
}
