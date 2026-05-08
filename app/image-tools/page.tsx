import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Image Tools — KaruviLab",
  description: "Free online image tools — compress, convert, resize, crop, and remove backgrounds. Client-side only.",
};

export default function ImageToolsPage() {
  const cat = CATEGORIES.find(c => c.id === "image")!;
  const tools = ALL_TOOLS.filter(t => t.category === "image");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">Process images entirely in your browser using Canvas API and WebAssembly.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} compact />)}
      </div>
    </div>
  );
}
