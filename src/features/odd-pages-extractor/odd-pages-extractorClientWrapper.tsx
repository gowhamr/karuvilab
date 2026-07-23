"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const OddPagesExtractorClient = dynamic(
  () => import('./odd-pages-extractorClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function OddPagesExtractorClientWrapper() {
  return <OddPagesExtractorClient />;
}
