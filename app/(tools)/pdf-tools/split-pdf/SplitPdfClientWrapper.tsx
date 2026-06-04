"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SplitPdfClient = dynamic(() => import("@/src/features/split-pdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SplitPdfClientWrapper() {
  return <SplitPdfClient />;
}
