"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const X509Client = dynamic(() => import("./X509Client"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function X509ClientWrapper() {
  return <X509Client />;
}
