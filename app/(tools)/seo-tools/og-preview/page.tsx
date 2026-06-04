import OgPreviewClientWrapper from "./OgPreviewClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("og-preview");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="Open Graph Preview"
      description="Preview how your page looks when shared on Google, Facebook, and Twitter."
      category={cat}
    >
      <OgPreviewClientWrapper />
    </ToolShell>
  );
}
