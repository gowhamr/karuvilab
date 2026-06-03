import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const PercentageCalculatorClient = dynamic(() => import("./PercentageCalculatorClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata("percentage-calculator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Percentage Calculator"
      description="Three modes: find a percentage, find what percent X is of Y, and calculate percentage change."
      category={cat}
    >
      <PercentageCalculatorClient />
    </ToolShell>
  );
}
