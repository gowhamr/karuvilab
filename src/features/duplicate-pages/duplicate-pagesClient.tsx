"use client";
import { BasicPdfEditor } from "@/src/features/basic-pdf-editor/components/BasicPdfEditor";

export default function DuplicatePagesClient() {
  return (
    <BasicPdfEditor
      mode="duplicate"
      toolId="duplicate-pages"
      title="Duplicate PDF Pages"
      description="Select pages to duplicate in the PDF"
      actionLabel="Duplicate Selected Pages"
    />
  );
}
