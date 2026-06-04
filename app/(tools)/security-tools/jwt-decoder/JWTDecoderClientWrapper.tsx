"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const JWTDecoderClient = dynamic(() => import("./JWTDecoderClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function JWTDecoderClientWrapper() {
  return <JWTDecoderClient />;
}
