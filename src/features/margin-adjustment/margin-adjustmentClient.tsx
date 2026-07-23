"use client";

import { PdfLayoutEditor } from "@/src/components/PdfLayoutEditor";

export default function MarginAdjustmentClient() {
  return (
    <PdfLayoutEditor
      mode="margin"
      toolId="margin-adjustment"
      title="Margin Adjustment"
      description="Add or reduce margins/padding around your PDF pages"
      actionLabel="Adjust Margins"
    />
  );
}
