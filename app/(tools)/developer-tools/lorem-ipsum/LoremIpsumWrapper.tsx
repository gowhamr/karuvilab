'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const LoremIpsumClient = dynamic(() => import('./LoremIpsumClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function LoremIpsumWrapper() {
  return <LoremIpsumClient />;
}