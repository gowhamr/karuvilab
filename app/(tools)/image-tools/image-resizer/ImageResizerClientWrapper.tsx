"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ImageResizerClient = dynamic(() => import("./ImageResizerClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function ImageResizerClientWrapper() {
  return <ImageResizerClient />;
}
