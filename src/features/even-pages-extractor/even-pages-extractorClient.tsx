"use client";
import { BasicPdfEditor } from "@/src/features/basic-pdf-editor/components/BasicPdfEditor";

export default function EvenPagesExtractorClient() {
  return (
    <BasicPdfEditor
      mode="even"
      toolId="even-pages-extractor"
      title="Even Pages Extractor"
      description="Extract all even-numbered pages from a PDF"
      actionLabel="Extract Even Pages"
    />
  );
}
