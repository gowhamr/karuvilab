"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SmartConverterClient = dynamic(() => import("./SmartConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SmartConverterClientWrapper() {
  return <SmartConverterClient />;
}
