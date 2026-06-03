import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const UnitConverterClient = dynamic(() => import("./UnitConverterClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("unit-converter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Unit Converter"
      description="Convert between Length, Weight, Volume, Temperature, Area, and Speed units."
      category={cat}
    >
      <UnitConverterClient />
    </ToolShell>
  );
}
