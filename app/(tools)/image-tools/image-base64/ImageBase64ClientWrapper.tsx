"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ImageBase64Client = dynamic(() => import("./ImageBase64Client"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function ImageBase64ClientWrapper() {
  return <ImageBase64Client />;
}
