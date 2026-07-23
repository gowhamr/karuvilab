"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PageSizeConverterClient = dynamic(
  () => import('./page-size-converterClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function PageSizeConverterClientWrapper() {
  return <PageSizeConverterClient />;
}
