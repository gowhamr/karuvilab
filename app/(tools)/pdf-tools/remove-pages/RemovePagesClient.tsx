"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function RemovePagesClient() {
  return (
    <PdfOrganizer
      mode="organize"
      toolId="remove-pages"
      title="Remove PDF Pages"
      description="Select pages to permanently delete from your PDF file."
      actionLabel="Remove Selected Pages"
    />
  );
}
