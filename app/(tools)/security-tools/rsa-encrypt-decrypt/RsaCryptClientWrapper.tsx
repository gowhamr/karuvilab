"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RsaCryptClient = dynamic(() => import("./RsaCryptClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function RsaCryptClientWrapper() {
  return <RsaCryptClient />;
}
