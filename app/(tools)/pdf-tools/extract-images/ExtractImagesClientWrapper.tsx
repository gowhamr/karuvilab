"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ExtractImagesClient = dynamic(() => import("@/src/features/extract-images"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function ExtractImagesClientWrapper() {
  return <ExtractImagesClient />;
}
