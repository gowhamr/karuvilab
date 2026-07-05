"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const HkdfClient = dynamic(() => import("./HkdfClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function HkdfClientWrapper() {
  return <HkdfClient />;
}
