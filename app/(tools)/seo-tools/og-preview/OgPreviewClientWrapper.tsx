"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const OgPreviewClient = dynamic(() => import("./OgPreviewClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function OgPreviewClientWrapper() {
  return <OgPreviewClient />;
}
