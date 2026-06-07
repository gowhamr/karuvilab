'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const CipherToolsClient = dynamic(() => import('./CipherToolsClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function CipherToolsWrapper() {
  return <CipherToolsClient />;
}