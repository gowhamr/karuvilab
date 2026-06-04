"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const UnitConverterClient = dynamic(() => import("./UnitConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function UnitConverterClientWrapper() {
  return <UnitConverterClient />;
}
