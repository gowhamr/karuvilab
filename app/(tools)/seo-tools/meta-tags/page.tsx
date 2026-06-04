import MetaTagsGeneratorClientWrapper from "./MetaTagsGeneratorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("meta-tags");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="Meta Tags Generator"
      description="Generate SEO-optimized HTML meta tags including Open Graph and Twitter Card tags."
      category={cat}
    >
      <MetaTagsGeneratorClientWrapper />
    </ToolShell>
  );
}
