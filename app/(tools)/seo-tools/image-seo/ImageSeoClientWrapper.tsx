"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ImageSeoClient = dynamic(() => import("./ImageSeoClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ImageSeoClientWrapper() {
  return <ImageSeoClient />;
}
