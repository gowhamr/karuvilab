"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const HTMLEntitiesClient = dynamic(() => import("./HTMLEntitiesClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function HTMLEntitiesClientWrapper() {
  return <HTMLEntitiesClient />;
}
