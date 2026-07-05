"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const LuhnClient = dynamic(() => import("./LuhnClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function LuhnClientWrapper() {
  return <LuhnClient />;
}
