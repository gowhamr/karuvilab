import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const BulkImageResizerClient = dynamic(() => import("./BulkImageResizerClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("bulk-resizer");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Bulk Image Resizer"
      description="Resize multiple images at once with shared dimension settings."
      category={cat}
    >
      <BulkImageResizerClient />
    </ToolShell>
  );
}
