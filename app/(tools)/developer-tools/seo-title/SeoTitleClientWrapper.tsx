"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SeoTitleClient = dynamic(() => import("./SeoTitleClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SeoTitleClientWrapper() {
  return <SeoTitleClient />;
}
