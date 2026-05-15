import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Developer Tools — JSON, Regex, and Code Utilities",
  description: "Essential tools for developers. Format JSON, test regex, compare diffs, and minify code — 100% private and browser-side.",
  keywords: ["developer tools", "json formatter", "regex tester", "diff checker", "code minifier", "code formatter"],
  alternates: {
    canonical: "/developer-tools/",
  },
};

export default function DeveloperToolsPage() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  const tools = ALL_TOOLS.filter(t => t.category === "developer");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <Breadcrumbs category={cat} />
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">Developer productivity tools — format, validate, compare, and convert data.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} compact />)}
      </div>
    </div>
  );
}
