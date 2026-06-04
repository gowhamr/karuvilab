import SitemapGeneratorClientWrapper from "./SitemapGeneratorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("sitemap-generator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="Sitemap Generator"
      description="Generate a valid XML sitemap from your URLs."
      category={cat}
    >
      <SitemapGeneratorClientWrapper />
    </ToolShell>
  );
}
