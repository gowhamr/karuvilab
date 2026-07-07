"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const AllToolsClient = dynamic(
  () => import('./AllToolsClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function AllToolsClientWrapper() {
  return <AllToolsClient />;
}
