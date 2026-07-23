"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PdfBookmarksClient = dynamic(
  () => import('./components/PdfBookmarksClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function PdfBookmarksClientWrapper() {
  return <PdfBookmarksClient />;
}
