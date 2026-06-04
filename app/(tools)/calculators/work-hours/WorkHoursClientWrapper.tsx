"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const WorkHoursClient = dynamic(() => import("./WorkHoursClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function WorkHoursClientWrapper() {
  return <WorkHoursClient />;
}
