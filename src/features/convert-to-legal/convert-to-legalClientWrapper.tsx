"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ConvertToLegalClient = dynamic(
  () => import('./convert-to-legalClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function ConvertToLegalClientWrapper() {
  return <ConvertToLegalClient />;
}
