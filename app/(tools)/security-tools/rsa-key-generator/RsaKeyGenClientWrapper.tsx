"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RsaKeyGenClient = dynamic(() => import("./RsaKeyGenClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function RsaKeyGenClientWrapper() {
  return <RsaKeyGenClient />;
}
