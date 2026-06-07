'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const GradientGeneratorClient = dynamic(() => import('./GradientGeneratorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function GradientGeneratorWrapper() {
  return <GradientGeneratorClient />;
}