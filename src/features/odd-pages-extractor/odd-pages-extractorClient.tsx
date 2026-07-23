"use client";
import { BasicPdfEditor } from "@/src/features/basic-pdf-editor/components/BasicPdfEditor";

export default function OddPagesExtractorClient() {
  return (
    <BasicPdfEditor
      mode="odd"
      toolId="odd-pages-extractor"
      title="Odd Pages Extractor"
      description="Extract all odd-numbered pages from a PDF"
      actionLabel="Extract Odd Pages"
    />
  );
}
