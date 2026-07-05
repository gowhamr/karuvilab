"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const OAuthClient = dynamic(() => import("./OAuthClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function OAuthClientWrapper() {
  return <OAuthClient />;
}
