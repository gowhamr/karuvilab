"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CanvasResizeClient = dynamic(() => import("./CanvasResizeClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function CanvasResizeClientWrapper() {
  return <CanvasResizeClient />;
}
