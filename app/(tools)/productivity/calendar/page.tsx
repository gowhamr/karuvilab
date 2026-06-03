import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const CalendarPage = dynamic(() => import("@/src/features/calendar/CalendarPage"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata("calendar");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "productivity")!;
  return (
    <ToolShell
      title="Calendar"
      description="Professional, fully local-first calendar for managing your time privately."
      category={cat}
    >
      <CalendarPage />
    </ToolShell>
  );
}
