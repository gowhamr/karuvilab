"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const FileViewerDiffClient = dynamic(
  () => import('@/components/tools/file-viewer-diff/FileViewerDiffClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function FileViewerDiffClientWrapper() {
  return <FileViewerDiffClient />;
}
