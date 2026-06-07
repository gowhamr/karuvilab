'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const GratuityCalculatorClient = dynamic(() => import('./GratuityCalculatorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function GratuityCalculatorWrapper() {
  return <GratuityCalculatorClient />;
}