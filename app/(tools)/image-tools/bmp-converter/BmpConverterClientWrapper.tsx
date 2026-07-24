"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const BmpConverterClient = dynamic(() => import("./BmpConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function BmpConverterClientWrapper() {
  return <BmpConverterClient />;
}
