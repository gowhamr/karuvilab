"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const YamlClient = dynamic(() => import("./YamlValidatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function YamlClientWrapper() {
  return <YamlClient />;
}
