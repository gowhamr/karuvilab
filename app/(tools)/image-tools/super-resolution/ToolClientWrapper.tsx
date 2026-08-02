"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const ToolClient = dynamic(
  () => import('./ToolClient'),
  {
    ssr: false,
    loading: () => <ToolSkeleton />
  }
);

export default function ToolClientWrapper() {
  return <ToolClient />;
}
