"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SitemapGeneratorClient = dynamic(() => import("./SitemapGeneratorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SitemapGeneratorClientWrapper() {
  return <SitemapGeneratorClient />;
}
