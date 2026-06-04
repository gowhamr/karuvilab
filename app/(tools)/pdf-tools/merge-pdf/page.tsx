import MergePdfClientWrapper from "./MergePdfClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("merge-pdf");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      toolId="merge-pdf"
      title="Merge PDF"
      description="Combine multiple PDF files into one — all processing happens in your browser."
      category={cat}
    >
      <MergePdfClientWrapper />
    </ToolShell>
  );
}
