'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const HmacGeneratorClient = dynamic(() => import('./HmacGeneratorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function HmacGeneratorWrapper() {
  return <HmacGeneratorClient />;
}