"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SamlClient = dynamic(() => import("./SamlClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SamlClientWrapper() {
  return <SamlClient />;
}
