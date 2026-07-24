"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const AdvancedRotateClient = dynamic(() => import("./AdvancedRotateClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function AdvancedRotateClientWrapper() {
  return <AdvancedRotateClient />;
}
