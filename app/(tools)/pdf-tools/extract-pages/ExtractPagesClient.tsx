"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function ExtractPagesClient() {
  return (
    <PdfOrganizer
      mode="organize"
      toolId="extract-pages"
      title="Extract PDF Pages"
      description="Extract selected pages into a new PDF document."
      actionLabel="Extract PDF Pages"
    />
  );
}
