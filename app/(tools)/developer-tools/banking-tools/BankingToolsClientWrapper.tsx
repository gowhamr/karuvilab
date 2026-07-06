"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const BankingToolsClient = dynamic(
  () => import('@/src/features/banking-tools/BankingToolsClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function BankingToolsClientWrapper() {
  return <BankingToolsClient />;
}
