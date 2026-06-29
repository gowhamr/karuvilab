'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { FocusModeWrapper } from '@/components/ui/FocusModeWrapper';

const CountdownTimerClient = dynamic(
  () => import('./CountdownTimerClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function CountdownTimerClientWrapper() {
  return (
    <FocusModeWrapper toolId="countdown-timer" toolName="Countdown Timer">
      <CountdownTimerClient />
    </FocusModeWrapper>
  );
}
