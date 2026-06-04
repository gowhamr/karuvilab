import UnitConverterClientWrapper from "./UnitConverterClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("unit-converter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Unit Converter"
      description="Convert between Length, Weight, Volume, Temperature, Area, and Speed units."
      category={cat}
    >
      <UnitConverterClientWrapper />
    </ToolShell>
  );
}
