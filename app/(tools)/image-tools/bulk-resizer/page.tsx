import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import BulkImageResizerClientWrapper from "./BulkImageResizerClientWrapper";

export const metadata: Metadata = generateToolMetadata("bulk-resizer");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  return (
    <ToolShell
      title="Bulk Image Resizer"
      description="Resize multiple images at once with shared dimension settings."
      category={cat}
    >
      <BulkImageResizerClientWrapper />
    </ToolShell>
  );
}
