"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const BatchImageConverterClient = dynamic(() => import("./BatchImageConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function BatchImageConverterClientWrapper() {
  return <BatchImageConverterClient />;
}
