"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MetaTagsGeneratorClient = dynamic(() => import("./MetaTagsGeneratorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function MetaTagsGeneratorClientWrapper() {
  return <MetaTagsGeneratorClient />;
}
