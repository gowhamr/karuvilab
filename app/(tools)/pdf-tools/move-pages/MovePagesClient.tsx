"use client";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function MovePagesClient() {
  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <PdfOrganizer
          mode="move"
          toolId="move-pages"
          title="Move PDF Pages"
          description="Move selected pages to a specific position in the PDF."
          actionLabel="Move PDF Pages"
        />
      }
    />
  );
}
