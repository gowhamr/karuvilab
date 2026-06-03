import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const PdfToWordClient = dynamic(() => import("@/src/features/pdf-to-word"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata("pdf-to-word");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "pdf")!;
  return (
    <ToolShell
      title="PDF to Word"
      description="Extract text from PDF files and convert them into editable Microsoft Word (.docx) documents completely in your browser."
      category={cat}
    >
      <PdfToWordClient />
    </ToolShell>
  );
}
