"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PomodoroClient = dynamic(() => import("./PomodoroTimerClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PomodoroClientWrapper() {
  return <PomodoroClient />;
}
