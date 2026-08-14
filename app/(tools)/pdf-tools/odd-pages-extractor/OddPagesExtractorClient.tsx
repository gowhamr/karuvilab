"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

export default function OddPagesExtractorClient() {
  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <PdfOrganizer
          mode="organize"
          toolId="odd-pages-extractor"
          title="Extract Odd Pages"
          description="Automatically extract all odd pages from a PDF."
          actionLabel="Extract Odd Pages"
        />
      }
    />
  );
}
