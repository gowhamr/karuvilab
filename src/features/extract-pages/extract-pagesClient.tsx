"use client";
import { BasicPdfEditor } from "@/src/features/basic-pdf-editor/components/BasicPdfEditor";

export default function ExtractPagesClient() {
  return (
    <BasicPdfEditor
      mode="extract"
      toolId="extract-pages"
      title="Extract PDF Pages"
      description="Select pages to extract into a new PDF"
      actionLabel="Extract Selected Pages"
    />
  );
}
