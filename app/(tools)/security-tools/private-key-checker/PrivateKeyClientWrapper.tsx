"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PrivateKeyClient = dynamic(() => import("./PrivateKeyClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PrivateKeyClientWrapper() {
  return <PrivateKeyClient />;
}
