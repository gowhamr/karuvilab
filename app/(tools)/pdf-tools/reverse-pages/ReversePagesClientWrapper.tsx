"use client";
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const ReversePagesClient = dynamic(() => import('./ReversePagesClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function ReversePagesClientWrapper() {
  return <ReversePagesClient />;
}
