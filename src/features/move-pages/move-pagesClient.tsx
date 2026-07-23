"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function MovePagesClient() {
  return (
    <PdfOrganizer
      mode="move"
      toolId="move-pages"
      title="Move PDF Pages"
      description="Move pages around to reorder your PDF document."
      actionLabel="Export Modified PDF"
    />
  );
}
