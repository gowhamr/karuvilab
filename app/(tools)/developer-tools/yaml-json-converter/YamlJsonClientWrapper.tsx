"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const YamlJsonClient = dynamic(() => import("./YamlJsonClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function YamlJsonClientWrapper() {
  return <YamlJsonClient />;
}
