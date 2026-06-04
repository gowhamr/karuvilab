import JSONCSVConverterClientWrapper from "./JSONCSVConverterClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("json-csv");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="JSON ↔ CSV Converter"
      description="Convert between JSON arrays and CSV format instantly with precision."
      category={cat}
    >
      <JSONCSVConverterClientWrapper />
    </ToolShell>
  );
}
