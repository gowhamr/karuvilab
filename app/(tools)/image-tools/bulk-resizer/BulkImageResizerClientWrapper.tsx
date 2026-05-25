"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const BulkImageResizerClient = dynamic(() => import("./BulkImageResizerClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function BulkImageResizerClientWrapper() {
  return <BulkImageResizerClient />;
}
