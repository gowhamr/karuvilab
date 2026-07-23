"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MovePagesClient = dynamic(
  () => import('./move-pagesClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function MovePagesClientWrapper() {
  return <MovePagesClient />;
}
