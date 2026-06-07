'use client';
import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';

const CsvToJsonClient = dynamic(() => import('./CsvToJsonClient'), { ssr: false, loading: () => <ToolSkeleton /> });

export default function CsvToJsonWrapper() {
  return <CsvToJsonClient />;
}