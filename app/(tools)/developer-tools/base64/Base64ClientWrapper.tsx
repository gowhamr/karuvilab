"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const Base64Client = dynamic(() => import("./Base64Client"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Base64ClientWrapper() {
  return <Base64Client />;
}
