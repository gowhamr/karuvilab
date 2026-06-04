"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const JSONFormatterClient = dynamic(() => import("@/src/features/json-formatter"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function JSONFormatterClientWrapper() {
  return <JSONFormatterClient />;
}
