import SplitPdfClientWrapper from "./SplitPdfClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("split-pdf");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Split PDF"
      description="Extract specific page ranges from a PDF file."
      category={cat}
    >
      <SplitPdfClientWrapper />
    </ToolShell>
  );
}
