"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const OrganizePdfClient = dynamic(
  () => import('./organize-pdfClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function OrganizePdfClientWrapper() {
  return <OrganizePdfClient />;
}
