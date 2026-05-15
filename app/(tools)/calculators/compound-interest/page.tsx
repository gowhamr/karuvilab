import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const CompoundInterestClient = dynamic(() => import("./CompoundInterestClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("compound-interest");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Compound Interest Calculator"
      description="Calculate compounded growth on your principal investment over time."
      category={cat}
    >
      <CompoundInterestClient />
    </ToolShell>
  );
}
