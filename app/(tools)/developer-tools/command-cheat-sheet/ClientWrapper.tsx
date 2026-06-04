"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const Client = dynamic(() => import("@/src/features/command-cheat-sheet"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ClientWrapper() {
  return <Client />;
}
