import CodeMinifierClientWrapper from "./CodeMinifierClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("code-minifier");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="Code Minifier"
      description="Remove comments and whitespace from CSS, JavaScript, and HTML. Basic minification — not full AST-level."
      category={cat}
    >
      <CodeMinifierClientWrapper />
    </ToolShell>
  );
}
