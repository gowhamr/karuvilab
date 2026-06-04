import SafeToSpendClientWrapper from "./SafeToSpendClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("safe-to-spend");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Safe-to-Spend"
      description="Plan your monthly budget and find your daily/weekly spending limit."
      category={cat}
    >
      <SafeToSpendClientWrapper />
    </ToolShell>
  );
}
