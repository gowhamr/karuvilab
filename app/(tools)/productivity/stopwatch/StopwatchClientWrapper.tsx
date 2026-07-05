'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';


const StopwatchClient = dynamic(
  () => import('./StopwatchClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function StopwatchClientWrapper() {
  return <StopwatchClient />;
}
