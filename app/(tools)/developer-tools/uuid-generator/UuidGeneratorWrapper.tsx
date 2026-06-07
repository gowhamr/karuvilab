'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const UuidGeneratorClient = dynamic(() => import('./UuidGeneratorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function UuidGeneratorWrapper() {
  return <UuidGeneratorClient />;
}