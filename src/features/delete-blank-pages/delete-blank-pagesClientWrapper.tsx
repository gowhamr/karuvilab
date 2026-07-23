"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const DeleteBlankPagesClient = dynamic(
  () => import('./delete-blank-pagesClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function DeleteBlankPagesClientWrapper() {
  return <DeleteBlankPagesClient />;
}
