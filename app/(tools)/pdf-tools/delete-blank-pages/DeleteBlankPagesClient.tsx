"use client";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function DeleteBlankPagesClient() {
  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <PdfOrganizer
          mode="delete-blank"
          toolId="delete-blank-pages"
          title="Delete Blank Pages"
          description="Automatically detect and remove blank pages."
          actionLabel="Delete Blank Pages"
        />
      }
    />
  );
}
