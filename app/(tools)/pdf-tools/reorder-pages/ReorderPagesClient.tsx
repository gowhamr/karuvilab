"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function ReorderPagesClient() {
  return (
    <PdfOrganizer
      mode="reorder"
      toolId="reorder-pages"
      title="Reorder PDF Pages"
      description="Drag and drop to reorder pages in your PDF."
      actionLabel="Reorder PDF Pages"
    />
  );
}
