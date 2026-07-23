"use client";

import { PdfLayoutEditor } from "@/src/components/PdfLayoutEditor";

export default function ConvertToA4Client() {
  return (
    <PdfLayoutEditor
      mode="a4"
      toolId="convert-to-a4"
      title="Convert to A4"
      description="Standardize your PDF document to A4 size (210 × 297 mm)"
      actionLabel="Convert to A4"
    />
  );
}
