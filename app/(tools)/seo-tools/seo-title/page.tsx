import SeoTitleTesterClientWrapper from "./SeoTitleTesterClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("seo-title");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  return (
    <ToolShell
      title="SEO Title Tester"
      description="Score your page title for SEO best practices and click-through rate potential."
      category={cat}
    >
      <SeoTitleTesterClientWrapper />
    </ToolShell>
  );
}
