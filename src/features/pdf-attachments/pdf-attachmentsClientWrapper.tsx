"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PdfAttachmentsClient = dynamic(
  () => import('./components/PdfAttachmentsClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function PdfAttachmentsClientWrapper() {
  return <PdfAttachmentsClient />;
}
