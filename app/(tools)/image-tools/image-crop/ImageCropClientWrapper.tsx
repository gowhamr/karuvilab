"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ImageCropClient = dynamic(() => import("./ImageCropClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function ImageCropClientWrapper() {
  return <ImageCropClient />;
}
