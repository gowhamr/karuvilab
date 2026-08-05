import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StructuredData } from "@/src/lib/seo";

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
        <p className="text-text-3 text-lg">Developer productivity tools — format, validate, compare, and convert data.</p>
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
