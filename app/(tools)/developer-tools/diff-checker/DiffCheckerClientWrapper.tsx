"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const DiffCheckerClient = dynamic(() => import("@/src/features/diff-checker"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function DiffCheckerClientWrapper() {
  return <DiffCheckerClient />;
}
