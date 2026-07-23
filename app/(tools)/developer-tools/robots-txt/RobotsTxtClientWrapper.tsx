"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RobotsTxtClient = dynamic(() => import("./RobotsTxtClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function RobotsTxtClientWrapper() {
  return <RobotsTxtClient />;
}
