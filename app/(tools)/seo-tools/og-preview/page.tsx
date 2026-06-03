import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const OgPreviewClient = dynamic(() => import("./OgPreviewClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("og-preview");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="Open Graph Preview"
      description="Preview how your page looks when shared on Google, Facebook, and Twitter."
      category={cat}
    >
      <OgPreviewClient />
    </ToolShell>
  );
}
