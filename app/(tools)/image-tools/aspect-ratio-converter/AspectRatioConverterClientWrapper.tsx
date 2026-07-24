"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const AspectRatioConverterClient = dynamic(() => import("./AspectRatioConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function AspectRatioConverterClientWrapper() {
  return <AspectRatioConverterClient />;
}
