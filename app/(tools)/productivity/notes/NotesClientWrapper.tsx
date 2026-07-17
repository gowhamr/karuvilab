"use client";
import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const NotesPageClient = dynamic(
  () => import('@/src/features/notes/NotesPage.client'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function NotesClientWrapper() {
  return <NotesPageClient />;
}
