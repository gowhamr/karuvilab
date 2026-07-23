"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ReorderPagesClient = dynamic(
  () => import('./reorder-pagesClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function ReorderPagesClientWrapper() {
  return <ReorderPagesClient />;
}
