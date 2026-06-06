"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TypingSpeedTestClient = dynamic(
  () => import("./TypingSpeedTestClient"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function TypingSpeedTestClientWrapper() {
  return <TypingSpeedTestClient />;
}
