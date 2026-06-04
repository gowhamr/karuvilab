import TextCaseConverterClientWrapper from "./TextCaseConverterClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";

const toolId = "text-case-converter";


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
      <TextCaseConverterClientWrapper />
    </ToolShell>
  );
}
