"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ReactionTimeClient = dynamic(() => import("./ReactionTimeClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ReactionTimeClientWrapper() {
  return <ReactionTimeClient />;
}
