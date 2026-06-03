import { Metadata } from "next";
import { generateToolMetadata } from "@/src/lib/seo";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import HtmlViewerClientWrapper from "./HtmlViewerClientWrapper";

const toolId = "html-viewer";
const cat = CATEGORIES.find(c => c.id === "developer")!;

export const metadata: Metadata = generateToolMetadata(toolId);

export default function HtmlViewerPage() {
  return (
    <ToolShell
      title="HTML Online Viewer"
      description="Professional developer playground with multi-pane editor and secure real-time preview."
      category={cat}
      toolId={toolId}
    >
      <HtmlViewerClientWrapper />
    </ToolShell>
  );
}
