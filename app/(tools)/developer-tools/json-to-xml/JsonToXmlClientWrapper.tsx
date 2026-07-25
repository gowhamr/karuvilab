"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const JsonToXmlClient = dynamic(
  () => import('./JsonToXmlClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function JsonToXmlClientWrapper() {
  return <JsonToXmlClient />;
}
