"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SlugClient = dynamic(() => import("./SlugClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SlugClientWrapper() {
  return <SlugClient />;
}
