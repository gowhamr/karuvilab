"use client";

import { PdfLayoutEditor } from "@/src/components/PdfLayoutEditor";

export default function ConvertToLegalClient() {
  return (
    <PdfLayoutEditor
      mode="legal"
      toolId="convert-to-legal"
      title="Convert to US Legal"
      description="Standardize your PDF document to US Legal size (8.5 × 14 in)"
      actionLabel="Convert to Legal"
    />
  );
}
