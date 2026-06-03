import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import dynamic from "next/dynamic";
import { Metadata } from "next";

import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const toolId = "pomodoro-timer";
const PomodoroClient = dynamic(() => import("./PomodoroTimerClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata(toolId);

export default function PomodoroTimerPage() {
  const cat = CATEGORIES.find(c => c.id === 'productivity')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Pomodoro Timer"
      description="A simple, customizable timer to help you focus."
      category={cat}
    >
      <PomodoroClient />
    </ToolShell>
  );
}
