import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const SmartConverterClient = dynamic(() => import("./SmartConverterClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("smart-converter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Smart Unit Converter"
      description="Type a natural language conversion query like '5 kg to lbs' or '100 USD to EUR'."
      category={cat}
    >
      <SmartConverterClient />
    </ToolShell>
  );
}
