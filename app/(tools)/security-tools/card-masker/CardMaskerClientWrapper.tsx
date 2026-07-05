"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CardMaskerClient = dynamic(() => import("./CardMaskerClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function CardMaskerClientWrapper() {
  return <CardMaskerClient />;
}
