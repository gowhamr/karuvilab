"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const LogAnalyzerClient = dynamic(() => import("./LogAnalyzerClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function LogAnalyzerClientWrapper() {
  return <LogAnalyzerClient />;
}
