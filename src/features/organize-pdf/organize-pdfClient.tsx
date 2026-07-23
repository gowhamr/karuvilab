"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function OrganizePdfClient() {
  return (
    <PdfOrganizer
      mode="organize"
      toolId="organize-pdf"
      title="Organize PDF Pages"
      description="Drag and drop to rearrange, rotate, or delete pages."
      actionLabel="Export Organized PDF"
    />
  );
}
