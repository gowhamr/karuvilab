"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SitemapClient = dynamic(() => import("./SitemapClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SitemapClientWrapper() {
  return <SitemapClient />;
}
