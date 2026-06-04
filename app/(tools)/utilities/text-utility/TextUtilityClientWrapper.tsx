"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TextUtilityClient = dynamic(() => import("./TextUtilityClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function TextUtilityClientWrapper() {
  return <TextUtilityClient />;
}
