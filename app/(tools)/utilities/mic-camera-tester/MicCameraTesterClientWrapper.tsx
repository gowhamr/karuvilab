"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MicCameraTesterClient = dynamic(() => import("./MicCameraTesterClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function MicCameraTesterClientWrapper() {
  return <MicCameraTesterClient />;
}
