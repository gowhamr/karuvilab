import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const WatermarkPdfClient = dynamic(() => import("@/src/features/watermark-pdf"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("watermark-pdf");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Watermark PDF"
      description="Add a text watermark to every page of a PDF."
      category={cat}
    >
      <WatermarkPdfClient />
    </ToolShell>
  );
}
