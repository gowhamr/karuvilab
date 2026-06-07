'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const NpsCalculatorClient = dynamic(() => import('./NpsCalculatorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function NpsCalculatorWrapper() {
  return <NpsCalculatorClient />;
}