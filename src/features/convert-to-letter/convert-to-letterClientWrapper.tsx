"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ConvertToLetterClient = dynamic(
  () => import('./convert-to-letterClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function ConvertToLetterClientWrapper() {
  return <ConvertToLetterClient />;
}
