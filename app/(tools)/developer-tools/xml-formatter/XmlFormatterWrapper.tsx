'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const XmlFormatterClient = dynamic(() => import('./XmlFormatterClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function XmlFormatterWrapper() {
  return <XmlFormatterClient />;
}