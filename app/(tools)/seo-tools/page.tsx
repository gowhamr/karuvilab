import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "SEO Tools — Meta Tags, Sitemaps, and Robots.txt Builders",
  description: "Free online SEO tools to optimize your website. Generate meta tags, sitemaps, robots.txt, and preview Open Graph cards privately.",
  keywords: ["seo tools", "meta tags generator", "sitemap generator", "robots.txt builder", "og preview", "slug generator"],
  alternates: {
    canonical: "/seo-tools/",
  },
};

export default function SeoToolsPage() {
  const cat = CATEGORIES.find(c => c.id === "seo")!;
  const tools = ALL_TOOLS.filter(t => t.category === "seo");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <Breadcrumbs category={cat} />
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">SEO tools to optimize pages, generate sitemaps, and preview social cards.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} compact />)}
      </div>
    </div>
  );
}
