'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const UnixTimestampClient = dynamic(() => import('./UnixTimestampClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function UnixTimestampWrapper() {
  return <UnixTimestampClient />;
}