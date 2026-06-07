'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const TdsCalculatorClient = dynamic(() => import('./TdsCalculatorClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function TdsCalculatorWrapper() {
  return <TdsCalculatorClient />;
}