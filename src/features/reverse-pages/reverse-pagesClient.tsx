"use client";
import { BasicPdfEditor } from "@/src/features/basic-pdf-editor/components/BasicPdfEditor";

export default function ReversePagesClient() {
  return (
    <BasicPdfEditor
      mode="reverse"
      toolId="reverse-pages"
      title="Reverse PDF Pages"
      description="Reverse the order of all pages in the PDF"
      actionLabel="Reverse Pages"
    />
  );
}
