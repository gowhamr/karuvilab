"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const AesClient = dynamic(() => import("./AesClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function AesClientWrapper() {
  return <AesClient />;
}
