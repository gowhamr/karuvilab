"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ConvertToA4Client = dynamic(
  () => import('./convert-to-a4Client'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function ConvertToA4ClientWrapper() {
  return <ConvertToA4Client />;
}
