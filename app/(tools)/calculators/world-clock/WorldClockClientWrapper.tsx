"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const WorldClockClient = dynamic(() => import("./WorldClockClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function WorldClockClientWrapper() {
  return <WorldClockClient />;
}
