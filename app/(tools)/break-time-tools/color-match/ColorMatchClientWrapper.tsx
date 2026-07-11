"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ColorMatchClient = dynamic(() => import("./ColorMatchClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ColorMatchClientWrapper() {
  return <ColorMatchClient />;
}
