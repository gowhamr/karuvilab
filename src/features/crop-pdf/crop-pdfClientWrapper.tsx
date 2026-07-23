"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CropPdfClient = dynamic(
  () => import('./crop-pdfClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function CropPdfClientWrapper() {
  return <CropPdfClient />;
}
