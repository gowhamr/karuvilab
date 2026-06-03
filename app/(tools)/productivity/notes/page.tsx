import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "notes";
const category = CATEGORIES.find(c => c.id === "productivity")!;

const NotesPage = dynamic(() => import("@/src/features/notes/NotesPage.client"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function NotesToolPage() {
  return (
    <ToolShell
      title="KV Notes"
      description="Capture your thoughts privately. Fast, local, and offline-first."
      category={category}
      toolId={toolId}
    >
      <NotesPage />
    </ToolShell>
  );
}
