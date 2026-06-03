import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const toolId = "text-case-converter";
const TextCaseConverterClient = dynamic(() => import("./TextCaseConverterClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata(toolId);

export default function TextCaseConverterPage() {
  const cat = CATEGORIES.find(c => c.id === 'productivity')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Text Case Converter"
      description="Convert text between UPPERCASE, lowercase, Sentence case, Title Case, camelCase, PascalCase, snake_case, kebab-case, and alternating case."
      category={cat}
    >
      <TextCaseConverterClient />
    </ToolShell>
  );
}
