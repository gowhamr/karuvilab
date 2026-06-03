import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const toolId = "word-to-pdf";

const WordToPdfClient = dynamic(() => import("@/src/features/word-to-pdf"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function WordToPdfPage() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Word to PDF"
      description="Convert Microsoft Word documents (.docx) to high-quality PDF files instantly. 100% private, browser-based conversion."
      category={cat}
      toolId={toolId}
    >
      <WordToPdfClient />
    </ToolShell>
  );
}
