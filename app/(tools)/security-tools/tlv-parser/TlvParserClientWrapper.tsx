"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TlvParserClient = dynamic(() => import("./TlvParserClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function TlvParserClientWrapper() {
  return <TlvParserClient />;
}
