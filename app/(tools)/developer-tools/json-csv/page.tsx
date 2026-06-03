import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const JSONCSVConverterClient = dynamic(() => import("@/src/features/json-csv"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("json-csv");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "developer")!;
  return (
    <ToolShell
      title="JSON ↔ CSV Converter"
      description="Convert between JSON arrays and CSV format instantly with precision."
      category={cat}
    >
      <JSONCSVConverterClient />
    </ToolShell>
  );
}
