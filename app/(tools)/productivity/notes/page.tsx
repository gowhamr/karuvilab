import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import NotesClientWrapper from "./NotesClientWrapper";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "notes";
const category = CATEGORIES.find(c => c.id === "productivity")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function NotesToolPage() {
  return (
    <ToolShell
      title="KV Notes"
      description="Capture your thoughts privately. Fast, local, and offline-first."
      category={category}
      toolId={toolId}
    >
      <NotesClientWrapper />
    </ToolShell>
  );
}
