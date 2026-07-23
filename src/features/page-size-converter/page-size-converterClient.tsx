"use client";

import { PdfLayoutEditor } from "@/src/components/PdfLayoutEditor";

export default function PageSizeConverterClient() {
  return (
    <PdfLayoutEditor
      mode="resize"
      toolId="page-size-converter"
      title="Page Size Converter"
      description="Change the page size of your PDF document"
      actionLabel="Convert Page Size"
    />
  );
}
