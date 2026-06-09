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
      title="Numeral & Encoding Converter"
      description="Universal encoding converter. Paste hex, binary, Base64, URL-encoded, HTML entities, Unicode escapes, or plain text. Auto-detect format and convert to all others instantly."
      category={cat}
    >
      <NumeralConverterClientWrapper />
    </ToolShell>
  );
}
