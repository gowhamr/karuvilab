"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CodeFormatterClient = dynamic(() => import("@/src/features/format"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function CodeFormatterClientWrapper() {
  return <CodeFormatterClient />;
}
