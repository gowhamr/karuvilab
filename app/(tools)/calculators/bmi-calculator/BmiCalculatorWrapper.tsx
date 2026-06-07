'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const BmiCalculatorClient = dynamic(
  () => import('./BmiCalculatorClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function BmiCalculatorWrapper() {
  return <BmiCalculatorClient />;
}
