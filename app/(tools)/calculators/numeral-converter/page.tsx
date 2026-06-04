import NumeralConverterClientWrapper from "./NumeralConverterClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("numeral-converter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Numeral Converter"
      description="Convert numbers between Binary, Octal, Decimal, and Hexadecimal bases."
      category={cat}
    >
      <NumeralConverterClientWrapper />
    </ToolShell>
  );
}
