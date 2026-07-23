"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ExtractPagesClient = dynamic(
  () => import('./extract-pagesClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function ExtractPagesClientWrapper() {
  return <ExtractPagesClient />;
}
