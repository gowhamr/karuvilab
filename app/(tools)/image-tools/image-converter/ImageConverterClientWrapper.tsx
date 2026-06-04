"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ImageConverterClient = dynamic(() => import("./ImageConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ImageConverterClientWrapper() {
  return <ImageConverterClient />;
}
