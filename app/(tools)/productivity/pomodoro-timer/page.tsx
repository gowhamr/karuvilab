import PomodoroClientWrapper from "./PomodoroClientWrapper";
import { generateToolMetadata } from "@/src/lib/seo";
import { ToolShell } from "@/components/ui/ToolShell";
import { CATEGORIES } from "@/src/tool-registry";
import { Metadata } from "next";

const toolId = "pomodoro-timer";


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
      <PomodoroClientWrapper />
    </ToolShell>
  );
}
