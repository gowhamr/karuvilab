"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ImagePaddingClient = dynamic(() => import("./ImagePaddingClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ImagePaddingClientWrapper() {
  return <ImagePaddingClient />;
}
