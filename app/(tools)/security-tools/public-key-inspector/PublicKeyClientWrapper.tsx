"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PublicKeyClient = dynamic(() => import("./PublicKeyClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PublicKeyClientWrapper() {
  return <PublicKeyClient />;
}
