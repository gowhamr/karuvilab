"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function EvenPagesExtractorClient() {
  return (
    <PdfOrganizer
      mode="organize"
      toolId="even-pages-extractor"
      title="Extract Even Pages"
      description="Automatically extract all even pages from a PDF."
      actionLabel="Extract Even Pages"
    />
  );
}
