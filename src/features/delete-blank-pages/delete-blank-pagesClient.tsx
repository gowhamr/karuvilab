"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function DeleteBlankPagesClient() {
  return (
    <PdfOrganizer
      mode="delete-blank"
      toolId="delete-blank-pages"
      title="Delete Blank Pages"
      description="Upload a PDF. Blank pages will be detected and removed automatically."
      actionLabel="Export Cleaned PDF"
    />
  );
}
