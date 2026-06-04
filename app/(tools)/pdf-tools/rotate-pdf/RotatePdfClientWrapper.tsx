"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RotatePdfClient = dynamic(() => import("@/src/features/rotate-pdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function RotatePdfClientWrapper() {
  return <RotatePdfClient />;
}
