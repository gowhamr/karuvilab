import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const MetaTagsGeneratorClient = dynamic(() => import("./MetaTagsGeneratorClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("meta-tags");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="Meta Tags Generator"
      description="Generate SEO-optimized HTML meta tags including Open Graph and Twitter Card tags."
      category={cat}
    >
      <MetaTagsGeneratorClient />
    </ToolShell>
  );
}
