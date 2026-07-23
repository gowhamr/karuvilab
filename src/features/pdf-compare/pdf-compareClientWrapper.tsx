"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PdfCompareClient = dynamic(
  () => import('./components/PdfCompareClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function PdfCompareClientWrapper() {
  return <PdfCompareClient />;
}
