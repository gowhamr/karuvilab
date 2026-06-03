"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MarkdownEditorClient = dynamic(() => import('./MarkdownEditorWrapper.client'), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function MarkdownEditorWrapper() {
  return <MarkdownEditorClient />;
}
