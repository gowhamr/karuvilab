"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SplitCopyClient = dynamic(() => import("./SplitCopyClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SplitCopyClientWrapper() {
  return <SplitCopyClient />;
}
