"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const DirectoryManifestClient = dynamic(() => import("./DirectoryManifestClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function DirectoryManifestClientWrapper() {
  return <DirectoryManifestClient />;
}
