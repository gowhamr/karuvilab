"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PdfPreviewClient = dynamic(
  () => import('./components/PdfPreviewClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function PdfPreviewClientWrapper() {
  return <PdfPreviewClient />;
}
