"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const BorderGeneratorClient = dynamic(() => import("./BorderGeneratorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function BorderGeneratorClientWrapper() {
  return <BorderGeneratorClient />;
}
