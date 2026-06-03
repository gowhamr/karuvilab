"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const BgRemoverClient = dynamic(() => import("./BgRemoverClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function BgRemoverClientWrapper() {
  return <BgRemoverClient />;
}
