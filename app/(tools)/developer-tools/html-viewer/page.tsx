import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generateToolMetadata } from "@/src/lib/seo";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const toolId = "html-viewer";
const cat = CATEGORIES.find(c => c.id === "developer")!;

export const metadata: Metadata = generateToolMetadata(toolId);

const HtmlViewerClient = dynamic(() => import("@/src/features/html-viewer"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function HtmlViewerPage() {
  return (
    <ToolShell
      title="HTML Online Viewer"
      description="Professional developer playground with multi-pane editor and secure real-time preview."
      category={cat}
      toolId={toolId}
    >
      <HtmlViewerClient />
    </ToolShell>
  );
}
