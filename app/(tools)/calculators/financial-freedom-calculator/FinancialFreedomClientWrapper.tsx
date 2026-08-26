'use client';

import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const FinancialFreedomClient = dynamic(
  () => import('./FinancialFreedomClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function FinancialFreedomClientWrapper() {
  return <FinancialFreedomClient />;
}
