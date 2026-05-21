import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const toolId = "pomodoro-timer";
const PomodoroClient = dynamic(() => import("./PomodoroTimerClient"), {
  loading: () => <div className="w-full h-[60vh] bg-surface rounded-3xl animate-pulse" />,
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
