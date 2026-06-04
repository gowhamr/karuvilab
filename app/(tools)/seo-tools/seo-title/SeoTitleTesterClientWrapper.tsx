"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SeoTitleTesterClient = dynamic(() => import("./SeoTitleTesterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SeoTitleTesterClientWrapper() {
  return <SeoTitleTesterClient />;
}
