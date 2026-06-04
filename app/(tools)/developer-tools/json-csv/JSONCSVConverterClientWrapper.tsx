"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const JSONCSVConverterClient = dynamic(() => import("@/src/features/json-csv"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function JSONCSVConverterClientWrapper() {
  return <JSONCSVConverterClient />;
}
