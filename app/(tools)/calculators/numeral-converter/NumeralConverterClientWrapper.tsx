"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const NumeralConverterClient = dynamic(() => import("./NumeralConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function NumeralConverterClientWrapper() {
  return <NumeralConverterClient />;
}
