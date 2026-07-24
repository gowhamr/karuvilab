"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const HeicConverterClient = dynamic(() => import("./HeicConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function HeicConverterClientWrapper() {
  return <HeicConverterClient />;
}
