'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const GlassmorphismGeneratorClient = dynamic(() => import('./GlassmorphismGeneratorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function GlassmorphismGeneratorWrapper() {
  return <GlassmorphismGeneratorClient />;
}