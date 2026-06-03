"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TimeZoneConverterClient = dynamic(() => import("./TimeZoneConverterClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function TimeZoneConverterClientWrapper() {
  return <TimeZoneConverterClient />;
}
