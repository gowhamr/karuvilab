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
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <StructuredData category={cat} />
      <div className="space-y-2">
        <Breadcrumbs category={cat} />
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">{cat.description}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} compact />
        ))}
      </div>
    </div>
  );
}
