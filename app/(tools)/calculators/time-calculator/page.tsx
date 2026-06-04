import TimeCalculatorClientWrapper from "./TimeCalculatorClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("time-calculator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Time Calculator"
      description="Add multiple time durations or find the difference between two times."
      category={cat}
    >
      <TimeCalculatorClientWrapper />
    </ToolShell>
  );
}
