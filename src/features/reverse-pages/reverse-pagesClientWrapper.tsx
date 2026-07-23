"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ReversePagesClient = dynamic(
  () => import('./reverse-pagesClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function ReversePagesClientWrapper() {
  return <ReversePagesClient />;
}
