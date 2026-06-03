import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import TextSorterDeduperClient from "./TextSorterDeduperClient";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "text-sorter-deduper";
const category = CATEGORIES.find(c => c.id === "productivity")!;

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
