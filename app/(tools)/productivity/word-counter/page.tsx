import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const toolId = "word-counter";
const WordCounterClient = dynamic(() => import("./WordCounterClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function WordCounterPage() {
  const cat = CATEGORIES.find(c => c.id === 'productivity')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in real-time. Estimate reading time and analyze your text."
      category={cat}
    >
      <WordCounterClient />
    </ToolShell>
  );
}
