import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StructuredData } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Break Time — Brain-Training Games & Focus Breaks | KV",
  description:
    "Five-minute brain breaks: Tic-Tac-Toe, 2048, Memory Match and more. 100% offline, no sign-in, no ads — built for productive people.",
  keywords: ["break time", "games", "brain training", "tic tac toe", "2048", "memory match", "offline games"],
  alternates: {
    canonical: "/break-time-tools/",
  },
};

export default function BreakTimePage() {
  const cat = CATEGORIES.find((c) => c.id === "break-time")!;
  const tools = ALL_TOOLS
    .filter((t) => t.category === "break-time")
    .sort((a, b) => (b.priority || 0.5) - (a.priority || 0.5));
    
  // Group tools by subCategory
  const toolsBySubCategory = tools.reduce((acc, tool) => {
    const subCat = tool.subCategory || "Other";
    if (!acc[subCat]) acc[subCat] = [];
    acc[subCat].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  // Define a nice order for subcategories
  const subCategoryOrder = ["Games", "Puzzles", "Brain Training", "Skill Tests", "Word Games", "Other"];
  
  const sortedSubCategories = Object.keys(toolsBySubCategory).sort((a, b) => {
    const idxA = subCategoryOrder.indexOf(a);
    const idxB = subCategoryOrder.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <StructuredData category={cat} />
      <div className="space-y-2">
        <Breadcrumbs category={cat} />
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">{cat.description}</p>
      </div>
      
      <div className="space-y-10">
        {sortedSubCategories.map((subCat) => {
          const categoryTools = toolsBySubCategory[subCat];
          if (!categoryTools || categoryTools.length === 0) return null;
          
          return (
            <div key={subCat} className="space-y-4">
              <h2 className="text-2xl font-bold">{subCat}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} compact />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
