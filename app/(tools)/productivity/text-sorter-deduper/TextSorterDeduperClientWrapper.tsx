"use client";
import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TextSorterDeduperClient = dynamic(
  () => import('./TextSorterDeduperClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function TextSorterDeduperClientWrapper() {
  return <TextSorterDeduperClient />;
}
