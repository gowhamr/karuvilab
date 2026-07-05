"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const NanoIdClient = dynamic(() => import("./NanoIdClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function NanoIdClientWrapper() {
  return <NanoIdClient />;
}
