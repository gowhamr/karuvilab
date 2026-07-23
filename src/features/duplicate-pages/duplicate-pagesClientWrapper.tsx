"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const DuplicatePagesClient = dynamic(
  () => import('./duplicate-pagesClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function DuplicatePagesClientWrapper() {
  return <DuplicatePagesClient />;
}
