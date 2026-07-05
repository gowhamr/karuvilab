"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SqlFormatterClient = dynamic(() => import("./SqlFormatterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SqlFormatterClientWrapper() {
  return <SqlFormatterClient />;
}
