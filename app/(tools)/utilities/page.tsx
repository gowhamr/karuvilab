import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Daily Utilities — QR Code, Text, and Productivity Tools",
  description: "Simple, effective tools for daily tasks. Generate QR codes, edit Markdown, clean URLs, and manage tasks privately.",
  keywords: ["utility tools", "qr code generator", "text utility", "markdown editor", "url cleaner", "task reminder"],
  alternates: {
    canonical: "/utilities/",
  },
};

export default function UtilitiesPage() {
  const cat = CATEGORIES.find(c => c.id === "utilities")!;
  const tools = ALL_TOOLS.filter(t => t.category === "utilities");
  const groups = tools.reduce((acc, tool) => {
    const sub = tool.subCategory || 'Other';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <StructuredData category={cat} />
      <div className="space-y-2">
        <Breadcrumbs category={cat} />
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">Everyday tools for text, links, tasks, and more — no account needed.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} compact />)}
      </div>
    </div>
  );
}
