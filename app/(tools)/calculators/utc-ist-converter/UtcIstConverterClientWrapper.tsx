"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const UtcIstConverterClient = dynamic(() => import("./UtcIstConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function UtcIstConverterClientWrapper() {
  return <UtcIstConverterClient />;
}
