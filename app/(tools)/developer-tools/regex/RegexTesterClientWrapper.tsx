"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RegexTesterClient = dynamic(() => import("@/src/features/regex"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function RegexTesterClientWrapper() {
  return <RegexTesterClient />;
}
