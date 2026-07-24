"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SvgConverterClient = dynamic(() => import("./SvgConverterClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function SvgConverterClientWrapper() {
  return <SvgConverterClient />;
}
