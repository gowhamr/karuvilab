"use client";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function DuplicatePagesClient() {
  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <PdfOrganizer
          mode="organize"
          toolId="duplicate-pages"
          title="Duplicate PDF Pages"
          description="Duplicate specific pages within your PDF."
          actionLabel="Duplicate PDF Pages"
        />
      }
    />
  );
}
