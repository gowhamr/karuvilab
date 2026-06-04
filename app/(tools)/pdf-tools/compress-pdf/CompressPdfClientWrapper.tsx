"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CompressPdfClient = dynamic(() => import("@/src/features/compress-pdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function CompressPdfClientWrapper() {
  return <CompressPdfClient />;
}
