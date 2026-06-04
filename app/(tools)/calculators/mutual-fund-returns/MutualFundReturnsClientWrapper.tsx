"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const MutualFundReturnsClient = dynamic(() => import("./MutualFundReturnsClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function MutualFundReturnsClientWrapper() {
  return <MutualFundReturnsClient />;
}
