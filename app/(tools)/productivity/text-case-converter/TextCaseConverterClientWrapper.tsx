"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TextCaseConverterClient = dynamic(() => import("./TextCaseConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function TextCaseConverterClientWrapper() {
  return <TextCaseConverterClient />;
}
