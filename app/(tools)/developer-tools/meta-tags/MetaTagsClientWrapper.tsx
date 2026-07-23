"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MetaTagsClient = dynamic(() => import("./MetaTagsClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function MetaTagsClientWrapper() {
  return <MetaTagsClient />;
}
