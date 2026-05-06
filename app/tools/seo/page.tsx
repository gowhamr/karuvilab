import type { Metadata } from "next";
import { TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "SEO Tools — KaruviLab",
  description: "Free SEO tools — meta tags generator, Open Graph preview, sitemap builder, robots.txt generator, and more.",
};

export default function SeoToolsPage() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  const tools = TOOLS.filter(t => t.category === "seo");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">{cat.emoji} {cat.label}</h1>
        <p className="text-text-3 text-lg">SEO tools to optimize pages, generate sitemaps, and preview social cards.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
      </div>
    </div>
  );
}
