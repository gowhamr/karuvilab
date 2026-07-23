"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RemovePagesClient = dynamic(
  () => import('./remove-pagesClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function RemovePagesClientWrapper() {
  return <RemovePagesClient />;
}
