"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const EditMetadataClient = dynamic(
  () => import('./edit-metadataClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function EditMetadataClientWrapper() {
  return <EditMetadataClient />;
}
