"use client";
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const EvenPagesExtractorClient = dynamic(() => import('./EvenPagesExtractorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function EvenPagesExtractorClientWrapper() {
  return <EvenPagesExtractorClient />;
}
