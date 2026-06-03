import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import CalendarPage from "@/src/features/calendar/CalendarPage";

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
