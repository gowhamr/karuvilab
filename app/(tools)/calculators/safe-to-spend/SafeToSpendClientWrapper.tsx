"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SafeToSpendClient = dynamic(() => import("./SafeToSpendClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SafeToSpendClientWrapper() {
  return <SafeToSpendClient />;
}
