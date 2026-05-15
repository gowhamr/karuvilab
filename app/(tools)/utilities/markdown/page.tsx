import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const MarkdownEditorClient = dynamic(() => import("./MarkdownEditorClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("markdown");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="Markdown Editor"
      description="Write markdown with live preview. Supports headings, lists, links, code blocks, and more."
      category={cat}
    >
      <MarkdownEditorClient />
    </ToolShell>
  );
}
