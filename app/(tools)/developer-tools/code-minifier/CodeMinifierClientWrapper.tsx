"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CodeMinifierClient = dynamic(() => import("@/src/features/code-minifier"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function CodeMinifierClientWrapper() {
  return <CodeMinifierClient />;
}
