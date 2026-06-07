// app/(tools)/developer-tools/crontab-editor/CrontabEditorWrapper.tsx
'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const CrontabEditorClient = dynamic(
  () => import('./CrontabEditorClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function CrontabEditorWrapper() {
  return <CrontabEditorClient />;
}
