"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MergePdfClient = dynamic(() => import("@/src/features/merge-pdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function MergePdfClientWrapper() {
  return <MergePdfClient />;
}
