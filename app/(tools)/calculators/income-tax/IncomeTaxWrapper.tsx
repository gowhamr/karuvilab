'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const IncomeTaxClient = dynamic(() => import('./IncomeTaxClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function IncomeTaxWrapper() {
  return <IncomeTaxClient />;
}