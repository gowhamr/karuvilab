"use client";

import { PdfLayoutEditor } from "@/src/components/PdfLayoutEditor";

export default function CropPdfClient() {
  return (
    <PdfLayoutEditor
      mode="crop"
      toolId="crop-pdf"
      title="Crop PDF"
      description="Trim margins or crop specific areas of your PDF pages"
      actionLabel="Crop PDF"
    />
  );
}
