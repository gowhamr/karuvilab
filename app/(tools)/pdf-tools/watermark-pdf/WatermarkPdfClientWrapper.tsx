"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const WatermarkPdfClient = dynamic(() => import("@/src/features/watermark-pdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function WatermarkPdfClientWrapper() {
  return <WatermarkPdfClient />;
}
