import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "PDF Tools — Compress, Merge, and Convert PDFs",
  description: "Fast, private browser-side PDF tools. Merge, split, compress, and convert PDFs without uploading them to any server.",
  keywords: ["pdf tools", "merge pdf", "compress pdf", "split pdf", "image to pdf", "pdf converter"],
  alternates: {
    canonical: "/pdf-tools/",
  },
};

export default function PdfToolsPage() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  const tools = ALL_TOOLS.filter(t => t.category === "pdf");
  
  const groups = tools.reduce((acc, tool) => {
    const sub = tool.subCategory || 'Other';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 space-y-12">
      <StructuredData category={cat} />
      <div className="space-y-2">
        <Breadcrumbs category={cat} />
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">Process PDF files entirely in your browser — no data leaves your device.</p>
      </div>
      
      <div className="space-y-12">
        {Object.entries(groups).map(([groupName, groupTools]) => (
          <section key={groupName} className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest text-blue flex items-center gap-3">
              <span className="w-8 h-px bg-blue/20" />
              {groupName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {groupTools.map(tool => <ToolCard key={tool.id} tool={tool} compact />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
