"use client";
import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const QAWorkbenchClient = dynamic(
  () => import('./QAWorkbenchClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function QAWorkbenchClientWrapper() {
  return <QAWorkbenchClient />;
}
