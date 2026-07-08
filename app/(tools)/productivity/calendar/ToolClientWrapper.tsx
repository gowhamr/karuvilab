"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CalendarPage = dynamic(
  () => import('@/src/features/calendar/CalendarPage'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function ToolClientWrapper() {
  return <CalendarPage />;
}
