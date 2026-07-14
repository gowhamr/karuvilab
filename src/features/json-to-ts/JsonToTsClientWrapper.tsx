"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const JsonToTsClient = dynamic(
  () => import('./JsonToTsClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function JsonToTsClientWrapper() {
  return <JsonToTsClient />;
}
