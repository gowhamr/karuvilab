import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Security Tools — KaruviLab",
  description: "Free security and encoding tools — hash generator, password generator, Base64, JWT decoder, and more.",
};

export default function SecurityToolsPage() {
  const cat = CATEGORIES.find(c => c.id === "security")!;
  const tools = ALL_TOOLS.filter(t => t.category === "security");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">Security and encoding tools — all processing happens locally in your browser.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} compact />)}
      </div>
    </div>
  );
}
