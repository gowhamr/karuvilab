import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "PDF Tools — KaruviLab",
  description: "Free online PDF tools — compress, merge, split, convert, and more. Fully private, runs in browser.",
};

export default function PdfToolsPage() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  const tools = ALL_TOOLS.filter(t => t.category === "pdf");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">{cat.emoji} {cat.label}</h1>
        <p className="text-text-3 text-lg">Process PDF files entirely in your browser — no data leaves your device.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
      </div>
    </div>
  );
}
