'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const BoxShadowGeneratorClient = dynamic(() => import('./BoxShadowGeneratorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function BoxShadowGeneratorWrapper() {
  return <BoxShadowGeneratorClient />;
}