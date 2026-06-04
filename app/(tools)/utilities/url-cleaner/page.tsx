import URLCleanerClientWrapper from "./URLCleanerClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("url-cleaner");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  return (
    <ToolShell
      title="URL Cleaner / UTM Stripper"
      description="Remove UTM tags, fbclid, gclid and other tracking parameters from URLs."
      category={cat}
    >
      <URLCleanerClientWrapper />
    </ToolShell>
  );
}
