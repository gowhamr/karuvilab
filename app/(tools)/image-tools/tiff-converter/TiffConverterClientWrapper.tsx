"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TiffConverterClient = dynamic(() => import("./TiffConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function TiffConverterClientWrapper() {
  return <TiffConverterClient />;
}
