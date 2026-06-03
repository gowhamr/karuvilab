"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const HtmlViewerClient = dynamic(() => import("@/src/features/html-viewer"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function HtmlViewerClientWrapper() {
  return <HtmlViewerClient />;
}
