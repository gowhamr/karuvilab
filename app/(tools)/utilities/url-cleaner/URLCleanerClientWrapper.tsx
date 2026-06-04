"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const URLCleanerClient = dynamic(() => import("./URLCleanerClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function URLCleanerClientWrapper() {
  return <URLCleanerClient />;
}
