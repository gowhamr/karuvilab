"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ImageFlipClient = dynamic(() => import("./ImageFlipClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ImageFlipClientWrapper() {
  return <ImageFlipClient />;
}
