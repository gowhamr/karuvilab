'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const ContrastCheckerClient = dynamic(() => import('./ContrastCheckerClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function ContrastCheckerWrapper() {
  return <ContrastCheckerClient />;
}