"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MemoryMatchClient = dynamic(() => import("./MemoryMatchClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function MemoryMatchClientWrapper() {
  return <MemoryMatchClient />;
}
