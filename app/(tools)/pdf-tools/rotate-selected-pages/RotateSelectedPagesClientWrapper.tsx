"use client";
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const RotateSelectedPagesClient = dynamic(() => import('./RotateSelectedPagesClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function RotateSelectedPagesClientWrapper() {
  return <RotateSelectedPagesClient />;
}
