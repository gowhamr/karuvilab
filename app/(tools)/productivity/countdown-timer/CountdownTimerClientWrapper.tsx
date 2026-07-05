'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';


const CountdownTimerClient = dynamic(
  () => import('./CountdownTimerClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function CountdownTimerClientWrapper() {
  return <CountdownTimerClient />;
}
