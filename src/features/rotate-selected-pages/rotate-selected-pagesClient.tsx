"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function RotateSelectedPagesClient() {
  return (
    <PdfOrganizer
      mode="rotate"
      toolId="rotate-selected-pages"
      title="Rotate Selected Pages"
      description="Select specific pages to rotate."
      actionLabel="Export Rotated PDF"
    />
  );
}
