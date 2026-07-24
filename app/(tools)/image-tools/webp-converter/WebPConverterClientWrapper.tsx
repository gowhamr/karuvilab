"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const WebPConverterClient = dynamic(() => import("./WebPConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function WebPConverterClientWrapper() {
  return <WebPConverterClient />;
}
