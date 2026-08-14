"use client";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

export default function RotateSelectedPagesClient() {
  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <PdfOrganizer
          mode="rotate"
          toolId="rotate-selected-pages"
          title="Rotate Specific Pages"
          description="Rotate only the pages you select."
          actionLabel="Rotate Specific Pages"
        />
      }
    />
  );
}
