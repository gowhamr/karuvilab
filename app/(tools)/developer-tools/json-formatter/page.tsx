import JSONFormatterClientWrapper from "./JSONFormatterClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("json-formatter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="JSON Formatter"
      description="Beautify, minify, validate JSON and explore it as a tree."
      category={cat}
    >
      <JSONFormatterClientWrapper />
    </ToolShell>
  );
}
