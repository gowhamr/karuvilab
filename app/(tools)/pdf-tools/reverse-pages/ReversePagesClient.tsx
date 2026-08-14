"use client";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";

export default function ReversePagesClient() {
  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <PdfOrganizer
          mode="reorder"
          toolId="reverse-pages"
          title="Reverse PDF Pages"
          description="Reverse the order of pages in your PDF."
          actionLabel="Reverse PDF Pages"
        />
      }
    />
  );
}
