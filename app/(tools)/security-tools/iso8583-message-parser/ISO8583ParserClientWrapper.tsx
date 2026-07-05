"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ISO8583ParserClient = dynamic(() => import("./ISO8583ParserClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ISO8583ParserClientWrapper() {
  return <ISO8583ParserClient />;
}
