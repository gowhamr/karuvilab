'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const CspBuilderClient = dynamic(() => import('./CspBuilderClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function CspBuilderWrapper() {
  return <CspBuilderClient />;
}