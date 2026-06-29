'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { FocusModeWrapper } from '@/components/ui/FocusModeWrapper';

const StopwatchClient = dynamic(
  () => import('./StopwatchClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function StopwatchClientWrapper() {
  return (
    <FocusModeWrapper toolId="stopwatch" toolName="Stopwatch">
      <StopwatchClient />
    </FocusModeWrapper>
  );
}
