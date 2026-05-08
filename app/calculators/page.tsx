import type { Metadata } from "next";
import { ALL_TOOLS, CATEGORIES } from "@/src/tool-registry";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Calculators — Financial, Date, and Math Tools",
  description: "Free, private online calculators — EMI, SIP, age, compound interest, GST, salary, and more. 100% browser-side with no data uploads.",
  keywords: ["online calculators", "emi calculator", "sip calculator", "gst calculator", "age calculator", "financial tools"],
  alternates: {
    canonical: "/calculators/",
  },
};

export default function CalculatorsPage() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  const tools = ALL_TOOLS.filter(t => t.category === "calculators");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">{cat.label}</h1>
        <p className="text-text-3 text-lg">Financial and everyday calculators that run entirely in your browser.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} compact />)}
      </div>
    </div>
  );
}
