"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MarginAdjustmentClient = dynamic(
  () => import('./margin-adjustmentClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function MarginAdjustmentClientWrapper() {
  return <MarginAdjustmentClient />;
}
