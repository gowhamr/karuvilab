import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Productivity Tools — Manage Your Workflow Privately",
  description: "Free, private productivity tools including Calendar. 100% browser-side with no data uploads.",
  keywords: ["productivity tools", "online calendar", "private calendar", "tamil calendar", "workflow tools"],
  alternates: {
    canonical: "/productivity/",
  },
};

export default function ProductivityPage() {
  const cat = CATEGORIES.find(c => c.id === "productivity")!;
  const tools = ALL_TOOLS.filter(t => t.category === "productivity");
  
  const groups = tools.reduce((acc, tool) => {
    const sub = tool.subCategory || 'General';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <div className="max-w-6xl mx-auto space-y-12 px-4 md:px-8 py-12">
      <StructuredData category={cat} />
      <div className="space-y-2">
        <Breadcrumbs category={cat} />
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">{cat.description}</p>
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
        {tools.length === 0 && (
          <div className="text-center py-20 bg-surface rounded-[32px] border border-border/40">
            <p className="text-text-4 font-black uppercase tracking-widest">More productivity tools coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
