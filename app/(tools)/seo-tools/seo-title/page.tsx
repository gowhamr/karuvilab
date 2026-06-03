import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const SeoTitleTesterClient = dynamic(() => import("./SeoTitleTesterClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("seo-title");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="SEO Title Tester"
      description="Score your page title for SEO best practices and click-through rate potential."
      category={cat}
    >
      <SeoTitleTesterClient />
    </ToolShell>
  );
}
