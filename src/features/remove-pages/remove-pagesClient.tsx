"use client";
import { BasicPdfEditor } from "@/src/features/basic-pdf-editor/components/BasicPdfEditor";

export default function RemovePagesClient() {
  return (
    <BasicPdfEditor
      mode="remove"
      toolId="remove-pages"
      title="Remove PDF Pages"
      description="Select pages to delete from your PDF"
      actionLabel="Remove Selected Pages"
    />
  );
}
