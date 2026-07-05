"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RsaSignClient = dynamic(() => import("./RsaSignClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function RsaSignClientWrapper() {
  return <RsaSignClient />;
}
