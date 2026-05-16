import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const PdfToWordClient = dynamic(() => import("@/src/features/pdf-to-word"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("pdf-to-word");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="PDF to Word"
      description="Extract text from PDF files. Full Word conversion requires server-side processing; this tool outputs plain text."
      category={cat}
    >
      <PdfToWordClient />
    </ToolShell>
  );
}
