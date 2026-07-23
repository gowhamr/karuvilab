"use client";

import { PdfLayoutEditor } from "@/src/components/PdfLayoutEditor";

export default function ConvertToLetterClient() {
  return (
    <PdfLayoutEditor
      mode="letter"
      toolId="convert-to-letter"
      title="Convert to US Letter"
      description="Standardize your PDF document to US Letter size (8.5 × 11 in)"
      actionLabel="Convert to Letter"
    />
  );
}
