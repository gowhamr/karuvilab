"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const EcdhClient = dynamic(() => import("./EcdhClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function EcdhClientWrapper() {
  return <EcdhClient />;
}
