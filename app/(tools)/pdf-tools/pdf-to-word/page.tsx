import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import PdfToWordClientWrapper from "./PdfToWordClientWrapper";

export const metadata: Metadata = generateToolMetadata("pdf-to-word");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="PDF to Word"
      description="Extract text from PDF files and convert them into editable Microsoft Word (.docx) documents completely in your browser."
      category={cat}
    >
      <PdfToWordClientWrapper />
    </ToolShell>
  );
}
