import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import WordToPdfClientWrapper from "./WordToPdfClientWrapper";

const toolId = "word-to-pdf";

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
      <WordToPdfClientWrapper />
    </ToolShell>
  );
}
