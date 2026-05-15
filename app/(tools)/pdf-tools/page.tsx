import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

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
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <Breadcrumbs category={cat} />
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">Process PDF files entirely in your browser — no data leaves your device.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} compact />)}
      </div>
    </div>
  );
}
