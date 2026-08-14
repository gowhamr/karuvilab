"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

export default function ReorderPagesClient() {
  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <PdfOrganizer
          mode="reorder"
          toolId="reorder-pages"
          title="Reorder PDF Pages"
          description="Drag and drop to reorder pages in your PDF."
          actionLabel="Reorder PDF Pages"
        />
      }
    />
  );
}
