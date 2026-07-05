"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const IbanClient = dynamic(() => import("./IbanClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function IbanClientWrapper() {
  return <IbanClient />;
}
