"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

export default function RemovePagesClient() {
  return (
    <ToolWorkspace
      layout="stacked"
      output={
        <PdfOrganizer
          mode="organize"
          toolId="remove-pages"
          title="Remove PDF Pages"
          description="Select pages to permanently delete from your PDF file."
          actionLabel="Remove Selected Pages"
        />
      }
    />
  );
}
