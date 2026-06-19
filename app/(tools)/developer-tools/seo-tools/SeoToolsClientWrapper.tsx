"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const SeoToolsClient = dynamic(
  () => import('@/src/features/seo-tools/SeoToolsClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function SeoToolsClientWrapper() {
  return <SeoToolsClient />;
}
