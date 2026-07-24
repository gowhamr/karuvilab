"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const IcoGeneratorClient = dynamic(() => import("./IcoGeneratorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function IcoGeneratorClientWrapper() {
  return <IcoGeneratorClient />;
}
