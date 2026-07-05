"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CsrClient = dynamic(() => import("./CsrClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function CsrClientWrapper() {
  return <CsrClient />;
}
