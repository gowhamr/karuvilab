"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ColorConverterClient = dynamic(() => import("./ColorConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ColorConverterClientWrapper() {
  return <ColorConverterClient />;
}
