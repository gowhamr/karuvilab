import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const SitemapGeneratorClient = dynamic(() => import("./SitemapGeneratorClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata("sitemap-generator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="Sitemap Generator"
      description="Generate a valid XML sitemap from your URLs."
      category={cat}
    >
      <SitemapGeneratorClient />
    </ToolShell>
  );
}
