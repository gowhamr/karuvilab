"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const AvifConverterClient = dynamic(() => import("./AvifConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function AvifConverterClientWrapper() {
  return <AvifConverterClient />;
}
