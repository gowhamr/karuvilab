import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const JSONFormatterClient = dynamic(() => import("@/src/features/json-formatter"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("json-formatter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="JSON Formatter"
      description="Beautify, minify, validate JSON and explore it as a tree."
      category={cat}
    >
      <JSONFormatterClient />
    </ToolShell>
  );
}
