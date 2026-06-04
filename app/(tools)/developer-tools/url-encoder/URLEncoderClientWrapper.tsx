"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const URLEncoderClient = dynamic(() => import("./URLEncoderClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function URLEncoderClientWrapper() {
  return <URLEncoderClient />;
}
