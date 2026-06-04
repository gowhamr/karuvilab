"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RobotsTxtBuilderClient = dynamic(() => import("./RobotsTxtBuilderClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function RobotsTxtBuilderClientWrapper() {
  return <RobotsTxtBuilderClient />;
}
