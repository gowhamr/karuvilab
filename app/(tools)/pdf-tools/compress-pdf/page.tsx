import CompressPdfClientWrapper from "./CompressPdfClientWrapper";
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";



export const metadata: Metadata = generateToolMetadata("compress-pdf");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="Compress PDF"
      description="Reduce PDF file size by re-encoding with pdf-lib's object stream compression."
      category={cat}
    >
      <CompressPdfClientWrapper />
    </ToolShell>
  );
}
