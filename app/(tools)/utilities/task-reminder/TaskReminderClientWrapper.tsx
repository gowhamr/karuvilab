"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TaskReminderClient = dynamic(() => import("./TaskReminderClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function TaskReminderClientWrapper() {
  return <TaskReminderClient />;
}
