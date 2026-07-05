"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const Base64UrlClient = dynamic(() => import("./Base64UrlClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Base64UrlClientWrapper() {
  return <Base64UrlClient />;
}
