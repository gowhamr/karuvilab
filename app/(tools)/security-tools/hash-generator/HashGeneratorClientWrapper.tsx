"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const HashGeneratorClient = dynamic(() => import("./HashGeneratorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function HashGeneratorClientWrapper() {
  return <HashGeneratorClient />;
}
