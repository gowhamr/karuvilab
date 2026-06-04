"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SlugGeneratorClient = dynamic(() => import("./SlugGeneratorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SlugGeneratorClientWrapper() {
  return <SlugGeneratorClient />;
}
