"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const LockUnlockPdfClient = dynamic(() => import("@/src/features/lock-unlock"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function LockUnlockPdfClientWrapper() {
  return <LockUnlockPdfClient />;
}
