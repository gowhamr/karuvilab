import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Developer Tools — KaruviLab",
  description: "Free developer tools — JSON formatter, regex tester, diff checker, code minifier, and more.",
};

export default function DeveloperToolsPage() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  const tools = ALL_TOOLS.filter(t => t.category === "developer");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">{cat.emoji} {cat.label}</h1>
        <p className="text-text-3 text-lg">Developer productivity tools — format, validate, compare, and convert data.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
      </div>
    </div>
  );
}
