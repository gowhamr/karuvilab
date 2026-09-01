"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MetadataViewerClient = dynamic(
  () => import('./metadata-viewerClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function MetadataViewerClientWrapper() {
  return <MetadataViewerClient />;
}
