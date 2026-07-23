"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RemoveMetadataClient = dynamic(
  () => import('./remove-metadataClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function RemoveMetadataClientWrapper() {
  return <RemoveMetadataClient />;
}
